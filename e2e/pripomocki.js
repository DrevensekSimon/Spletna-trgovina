// Fixture-i za neodvisnost testov:
//  - vsak test dobi svoj brskalniški kontekst (privzeto v Playwrightu = »novo zasebno okno«),
//  - račune si vsak test pripravi sam z enolično e-pošto (<oznaka> iz TP v1.2),
//  - po testu se izbrišejo samo računi in naročila tega testa, porabljena zaloga se vrne.
const { test: base, expect } = require('@playwright/test');
const mysql = require('mysql2/promise');
const { database } = require('./environment');
const podatki = require('./podatki');

// Enolična oznaka izvedbe, npr. 20261108-214501-a1b2c3 (format iz TP v1.2).
function oznakaIzvedbe() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  const datum = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
  const cas = `${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  return `${datum}-${cas}-${Math.random().toString(16).slice(2, 8)}`;
}

const test = base.extend({
  // Slike izdelkov so na zunanjem strežniku (Unsplash) in niso del funkcionalnosti.
  // Nadomestimo jih, da počasno omrežje ne vpliva na rezultat testov.
  page: async ({ page }, use) => {
    await page.route('https://images.unsplash.com/**', route => route.fulfill({
      status: 200, contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"/>',
    }));
    await use(page);
  },

  baza: async ({}, use) => {
    const povezava = await mysql.createConnection(database);
    try { await use(povezava); } finally { await povezava.end(); }
  },

  // Upravljanje testnih računov
  racuni: async ({ request, baza }, use) => {
    const ustvarjeni = [];
    const racuni = {
      // Samo rezervira e-pošto (za TP-02, kjer račun ustvari test sam prek obrazca).
      rezerviraj(opis) {
        const racun = {
          ime: opis.ime, priimek: opis.priimek, geslo: opis.geslo,
          email: `${opis.predpona}.${oznakaIzvedbe()}@example.com`,
        };
        ustvarjeni.push(racun.email);
        return racun;
      },
      // Predpogoj TP-01/TP-05: registriran račun, pri katerem je prijava s pravilnim geslom preverjena.
      async pripravi(opis = podatki.r1) {
        const racun = racuni.rezerviraj(opis);
        const reg = await request.post('/api/auth/register', {
          data: { email: racun.email, password: racun.geslo, firstName: racun.ime, lastName: racun.priimek },
        });
        expect(reg.status(), 'Predpogoj: račun mora biti ustvarjen').toBe(201);
        const prijava = await request.post('/api/auth/login', { data: { email: racun.email, password: racun.geslo } });
        expect(prijava.status(), 'Predpogoj: prijava s pravilnim geslom mora delovati').toBe(200);
        const telo = await prijava.json();
        racun.id = telo.user.id;
        racun.zeton = telo.token;
        return racun;
      },
    };
    await use(racuni);

    // Čiščenje: samo računi tega testa.
    for (const email of ustvarjeni) {
      const [uporabniki] = await baza.execute('SELECT id FROM users WHERE email = ?', [email]);
      for (const { id } of uporabniki) {
        const [postavke] = await baza.execute(
          `SELECT oi.product_id, oi.size, SUM(oi.quantity) AS kolicina FROM order_items oi
           JOIN orders o ON o.id = oi.order_id WHERE o.user_id = ? GROUP BY oi.product_id, oi.size`, [id]);
        for (const p of postavke) {
          await baza.execute('UPDATE product_sizes SET stock = stock + ? WHERE product_id = ? AND size = ?',
            [Number(p.kolicina), p.product_id, p.size]);
        }
        await baza.execute('DELETE FROM orders WHERE user_id = ?', [id]);
        await baza.execute('DELETE FROM users WHERE id = ?', [id]);
      }
    }
  },

  // Katalog iz API-ja (za iskanje ID-jev in zaloge pri pripravi predpogojev).
  katalog: async ({ request }, use) => {
    const odziv = await request.get('/api/products');
    expect(odziv.status()).toBe(200);
    const izdelki = await odziv.json();
    await use({
      izdelki,
      poNazivu: (naziv) => {
        const izdelek = izdelki.find(p => p.name === naziv);
        expect(izdelek, `Izdelek ${naziv} mora obstajati v katalogu`).toBeTruthy();
        return izdelek;
      },
      async zaloga(naziv, velikost) {
        const id = this.poNazivu(naziv).id;
        const podrobno = await (await request.get(`/api/products/${id}`)).json();
        return podrobno.sizes.find(s => s.size === velikost)?.stock ?? 0;
      },
    });
  },
});

module.exports = { test, expect };
