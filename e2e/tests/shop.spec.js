const { test, expect, loginThroughUI, expectSignedIn, addProduct } = require('../fixtures');
const seedProducts = require('../../backend/seeders/products.json');

const chicago = 'Air Jordan 1 Retro High OG "Chicago"';
const smokeGrey = 'Air Jordan 1 Mid "Smoke Grey"';
const tripleWhite = 'Air Jordan 1 Low "Triple White"';
const cartItem = (page, name) => page.getByTestId('cart-item').filter({
  has: page.getByRole('heading', { name, exact: true }),
});

test('TP-01A | Uspešna prijava registriranega računa R1', async ({ page, account, request }) => {
  await test.step('Predpogoji: neodvisno preverjen R1 in čista neprijavljena seja', async () => {
    await page.goto('/');
    await expect(page.getByRole('banner').getByRole('link', { name: 'Prijava', exact: true })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
  });
  await test.step('Izvedi prijavo in preveri domačo stran, ime ter Naročila', async () => {
    await loginThroughUI(page, account);
    await expectSignedIn(page, 'Testni');
  });
  await test.step('Preveri aktivno sejo in obstoj prijave po osvežitvi', async () => {
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
    const me = await request.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    expect(me.status()).toBe(200);
    expect((await me.json()).email).toBe(account.email);
    await page.reload();
    await expectSignedIn(page, 'Testni');
  });
});

test('TP-01B | Zavrnitev napačnega gesla za preverjen račun R1', async ({ page, account, request }) => {
  await test.step('Uporabi pravi R1 in drugačno napačno geslo', async () => {
    expect(account.password).not.toBe('Napacno123!');
    await loginThroughUI(page, account, 'Napacno123!');
  });
  await test.step('Preveri obvestilo, URL in neprijavljeno stanje', async () => {
    await expect(page.getByRole('alert')).toHaveText('Napačen email ali geslo');
    await expect(page).toHaveURL('/login');
    const header = page.getByRole('banner');
    await expect(header.getByRole('link', { name: 'Prijava', exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Naročila', exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
    expect((await request.get('/api/orders')).status()).toBe(401);
  });
});

test('TP-02 | Registracija novega uporabnika in samodejna prijava', async ({ page, accounts, db, request }) => {
  const account = accounts.reserve('Test', 'Test123!', 'test.registracija');
  await test.step('Preveri novo e-pošto in odpri obrazec Registracija', async () => {
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [account.email]);
    expect(existing).toHaveLength(0);
    await page.goto('/');
    await page.getByRole('banner').getByRole('link', { name: 'Prijava', exact: true }).click();
    await page.getByRole('main').getByRole('link', { name: 'Registracija', exact: true }).click();
  });
  await test.step('Vnesi vse podatke in ustvari račun prek uporabniškega vmesnika', async () => {
    await page.getByLabel('Ime', { exact: true }).fill(account.firstName);
    await page.getByLabel('Priimek', { exact: true }).fill(account.lastName);
    await page.getByLabel('Email', { exact: true }).fill(account.email);
    await page.getByLabel('Geslo', { exact: true }).fill(account.password);
    await page.getByRole('button', { name: 'Registriraj se', exact: true }).click();
    await expectSignedIn(page, 'Test');
  });
  await test.step('Preveri shranjene podatke in prijavo po osvežitvi', async () => {
    const [users] = await db.execute('SELECT email, first_name, last_name FROM users WHERE email = ?', [account.email]);
    expect(users).toEqual([{ email: account.email, first_name: 'Test', last_name: 'Uporabnik' }]);
    const login = await request.post('/api/auth/login', { data: account });
    expect(login.status(), 'Novo geslo mora omogočati prijavo v ustvarjeni račun').toBe(200);
    expect((await login.json()).user.email).toBe(account.email);
    await page.reload();
    await expectSignedIn(page, 'Test');
  });
});

test('TP-03 | Low Top prikaže pravilne modele in Vsi izdelki obnovi katalog', async ({ page, request }) => {
  await test.step('Preveri predpogoje kataloga in zabeleži začetni seznam', async () => {
    const response = await request.get('/api/products');
    expect(response.status()).toBe(200);
    const products = await response.json();
    expect(products.map(p => p.name).sort()).toEqual(seedProducts.map(p => p.name).sort());
    await page.goto('/');
    await page.getByRole('banner').getByRole('link', { name: 'Izdelki', exact: true }).click();
    await page.getByRole('button', { name: 'Vsi izdelki', exact: true }).click();
    await expect(page.getByTestId('product-card')).toHaveCount(8);
  });
  const headings = page.getByTestId('product-card').getByRole('heading', { level: 3 });
  const originalNames = await headings.allTextContents();
  expect([...originalNames].sort()).toEqual(seedProducts.map(p => p.name).sort());
  await test.step('Preveri vse nazive Low Top in odsotnost High Top ter Mid Top', async () => {
    await page.getByRole('button', { name: 'Low Top', exact: true }).click();
    await expect(headings).toHaveText([tripleWhite]);
    await expect(headings.filter({ hasText: /High|Mid/ })).toHaveCount(0);
    await expect(page.getByText('Prikazanih 1 od 8 izdelkov', { exact: true })).toBeVisible();
  });
  await test.step('Obnovi in primerjaj celoten katalog', async () => {
    await page.getByRole('button', { name: 'Vsi izdelki', exact: true }).click();
    await expect(headings).toHaveText(originalNames);
    await expect(page.getByText('Prikazanih 8 od 8 izdelkov', { exact: true })).toBeVisible();
  });
});

test('TP-04 | Chicago 42 poveča količino in znesek ter ohrani druge postavke', async ({ page, request, db }) => {
  const [[ordersBefore]] = await db.query('SELECT COUNT(*) AS count FROM orders');
  const products = await (await request.get('/api/products')).json();
  const product = products.find(p => p.name === chicago);
  expect(Number(product.price)).toBe(180);
  const detail = await (await request.get(`/api/products/${product.id}`)).json();
  expect(detail.sizes.find(s => s.size === '42').stock).toBeGreaterThan(0);
  await test.step('Začetek s prazno košarico: Chicago 42, količina 1, skupaj 180 €', async () => {
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Vaša košarica je prazna' })).toBeVisible();
    await addProduct(page, chicago);
    await expect(cartItem(page, chicago).getByText('Velikost: 42', { exact: true })).toBeVisible();
    await expect(cartItem(page, chicago).getByTestId('cart-quantity')).toHaveText('1');
    await expect(cartItem(page, chicago).getByText('180.00 €', { exact: true })).toBeVisible();
    await expect(page.getByTestId('cart-total')).toHaveText('180.00 €');
    await expect(page.getByTestId('cart-item')).toHaveCount(1);
  });
  await test.step('Pripravi znano začetno stanje q0 = 1, S0 = 305 € in drugo postavko', async () => {
    await addProduct(page, smokeGrey);
    await expect(page.getByTestId('cart-item')).toHaveCount(2);
    await expect(page.getByTestId('cart-total')).toHaveText('305.00 €');
    await expect(cartItem(page, smokeGrey).getByTestId('cart-quantity')).toHaveText('1');
  });
  const otherItemBefore = await cartItem(page, smokeGrey).textContent();
  await test.step('Ponovno dodaj Chicago 42 in preveri q0 + 1 ter S0 + 180 €', async () => {
    await addProduct(page, chicago);
    await expect(cartItem(page, chicago).getByTestId('cart-quantity')).toHaveText('2');
    await expect(cartItem(page, chicago).getByText('Velikost: 42', { exact: true })).toBeVisible();
    await expect(page.getByTestId('cart-total')).toHaveText('485.00 €');
    await expect(page.getByTestId('cart-item')).toHaveCount(2);
    await expect(cartItem(page, smokeGrey)).toHaveText(otherItemBefore);
    await expect(page.getByRole('button', { name: 'Prijava za nadaljevanje' })).toBeVisible();
    const [[ordersAfter]] = await db.query('SELECT COUNT(*) AS count FROM orders');
    expect(ordersAfter.count, 'Dodajanje v košarico še ne ustvari naročila').toBe(ordersBefore.count);
  });
});

test('TP-05 | Oddaja naročila shrani prave podatke in izprazni košarico', async ({ page, account, request, db }, testInfo) => {
  const headers = { Authorization: `Bearer ${account.token}` };
  const before = await (await request.get('/api/orders', { headers })).json();
  await test.step('Neodvisno pripravi prijavo in točno en Chicago 42 za 180 €', async () => {
    await loginThroughUI(page, account);
    await expectSignedIn(page, 'Testni');
    await page.getByRole('banner').getByRole('link', { name: 'Košarica', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Vaša košarica je prazna' })).toBeVisible();
    await addProduct(page, chicago);
    await expect(cartItem(page, chicago).getByTestId('cart-quantity')).toHaveText('1');
    await expect(page.getByTestId('cart-total')).toHaveText('180.00 €');
  });
  await test.step('Odpri blagajno, vnesi dostavo in preveri povzetek', async () => {
    await page.getByRole('button', { name: 'Nadaljuj na blagajno', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Blagajna', exact: true })).toBeVisible();
    await page.getByLabel('Naslov', { exact: true }).fill('Testna ulica 10');
    await page.getByLabel('Mesto', { exact: true }).fill('Maribor');
    await page.getByLabel('Poštna številka', { exact: true }).fill('2000');
    await expect(page.getByText(`${chicago} (Vel. 42) x1`, { exact: true })).toBeVisible();
    await expect(page.getByTestId('checkout-total')).toHaveText('180.00 €');
  });
  let orderId;
  await test.step('Oddaj naročilo in preveri ter potrdi obvestilo', async () => {
    const responsePromise = page.waitForResponse(r => r.url().endsWith('/api/orders') && r.request().method() === 'POST');
    const dialogPromise = page.waitForEvent('dialog');
    const clickPromise = page.getByRole('button', { name: 'Potrdi naročilo', exact: true }).click();
    const dialog = await dialogPromise;
    const message = dialog.message();
    await dialog.accept();
    await clickPromise;
    expect(message).toBe('Naročilo uspešno oddano!');
    const response = await responsePromise;
    expect(response.status()).toBe(201);
    const result = await response.json();
    orderId = result.orderId;
    expect(before.map(o => o.id)).not.toContain(orderId);
    expect(Number(result.totalAmount)).toBe(180);
    expect(response.request().postDataJSON()).toMatchObject({
      shippingAddress: 'Testna ulica 10', shippingCity: 'Maribor', shippingPostalCode: '2000',
      items: [expect.objectContaining({ size: '42', quantity: 1 })],
    });
  });
  const order = page.getByTestId('order-card').filter({
    has: page.getByText(`Naročilo #${orderId}`, { exact: true }),
  });
  await test.step('Preveri novo naročilo in ohranitev istega zapisa po osvežitvi', async () => {
    await expect(page.getByRole('heading', { name: 'Moja naročila', exact: true })).toBeVisible();
    for (const refresh of [false, true]) {
      if (refresh) await page.reload();
      await expect(order).toHaveCount(1);
      await expect(order.getByText(chicago, { exact: true })).toBeVisible();
      await expect(order.getByText('Vel. 42 x1', { exact: true })).toBeVisible();
      await expect(order.getByTestId('order-total')).toHaveText('180.00 €');
      await expect(order.getByText('V čakanju', { exact: true })).toBeVisible();
    }
    const [stored] = await db.execute('SELECT user_id, total_amount, shipping_address, shipping_city, shipping_postal_code, status FROM orders WHERE id = ?', [orderId]);
    expect(stored).toEqual([{
      user_id: account.user.id, total_amount: '180.00', shipping_address: 'Testna ulica 10',
      shipping_city: 'Maribor', shipping_postal_code: '2000', status: 'pending',
    }]);
    const after = await (await request.get('/api/orders', { headers })).json();
    expect(after).toHaveLength(before.length + 1);
    await testInfo.attach('shranjeno-narocilo.json', { body: Buffer.from(JSON.stringify({ orderId, ...stored[0] }, null, 2)), contentType: 'application/json' });
  });
  await test.step('Preveri prazno košarico tudi po osvežitvi', async () => {
    await page.getByRole('banner').getByRole('link', { name: 'Košarica', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Vaša košarica je prazna' })).toBeVisible();
    await expect(page.getByTestId('cart-item')).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Vaša košarica je prazna' })).toBeVisible();
  });
});
