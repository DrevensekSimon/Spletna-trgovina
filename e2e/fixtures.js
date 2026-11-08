const { test: base, expect } = require('@playwright/test');
const mysql = require('mysql2/promise');
const { randomUUID } = require('node:crypto');
const { database } = require('./environment');

const test = base.extend({
  page: async ({ page }, use) => {
    // Product photographs are an external dependency, not part of the shop API.
    await page.route('https://images.unsplash.com/**', route => route.fulfill({
      status: 200, contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="#eee"/></svg>',
    }));
    await use(page);
  },
  db: async ({}, use) => {
    const connection = await mysql.createConnection(database);
    try { await use(connection); } finally { await connection.end(); }
  },
  accounts: async ({ request, db }, use) => {
    const emails = [];
    const reserve = (firstName = 'Testni', password = 'Prijava123!', prefix = 'test.prijava') => {
      const account = {
        email: `${prefix}.${randomUUID()}@example.com`, password,
        firstName, lastName: 'Uporabnik',
      };
      emails.push(account.email);
      return account;
    };
    const create = async () => {
      const account = reserve();
      const registration = await request.post('/api/auth/register', { data: account });
      expect(registration.status(), 'Priprava R1: račun mora biti ustvarjen').toBe(201);
      // A valid login is checked independently before both TP-01 scenarios.
      const login = await request.post('/api/auth/login', { data: account });
      expect(login.status(), 'Priprava R1: pravilno geslo mora delovati').toBe(200);
      Object.assign(account, await login.json());
      return account;
    };
    try {
      await use({ reserve, create });
    } finally {
      // Only exact, randomly generated accounts belonging to this test are removed.
      await db.beginTransaction();
      try {
        for (const email of emails) {
          const [users] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
          for (const user of users) {
            const [items] = await db.execute(
              `SELECT oi.product_id, oi.size, SUM(oi.quantity) AS quantity
               FROM order_items oi JOIN orders o ON o.id = oi.order_id
               WHERE o.user_id = ? GROUP BY oi.product_id, oi.size`, [user.id]);
            for (const item of items) {
              await db.execute('UPDATE product_sizes SET stock = stock + ? WHERE product_id = ? AND size = ?',
                [Number(item.quantity), item.product_id, item.size]);
            }
            await db.execute('DELETE FROM orders WHERE user_id = ?', [user.id]);
            await db.execute('DELETE FROM users WHERE id = ?', [user.id]);
          }
        }
        await db.commit();
      } catch (error) { await db.rollback(); throw error; }
    }
  },
  account: async ({ accounts }, use) => { await use(await accounts.create()); },
});

async function loginThroughUI(page, account, password = account.password) {
  await page.goto('/');
  await page.getByRole('banner').getByRole('link', { name: 'Prijava', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Prijava', exact: true })).toBeVisible();
  await page.getByLabel('Email', { exact: true }).fill(account.email);
  await page.getByLabel('Geslo', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Prijava', exact: true }).click();
}

async function expectSignedIn(page, firstName) {
  await expect(page).toHaveURL('/');
  const header = page.getByRole('banner');
  await expect(header.getByText(firstName, { exact: true })).toBeVisible();
  await expect(header.getByRole('link', { name: 'Naročila', exact: true })).toBeVisible();
  await expect(header.getByRole('button', { name: 'Odjava', exact: true })).toBeVisible();
  await expect(header.getByRole('link', { name: 'Prijava', exact: true })).toHaveCount(0);
}

async function addProduct(page, name, size = '42') {
  await page.getByRole('banner').getByRole('link', { name: 'Izdelki', exact: true }).click();
  await page.getByRole('link', { name, exact: true }).click();
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  const button = page.getByRole('button', { name: size, exact: true });
  await expect(button).toBeEnabled();
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Dodaj v košarico', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Košarica', exact: true })).toBeVisible();
}

module.exports = { test, expect, loginThroughUI, expectSignedIn, addProduct };
