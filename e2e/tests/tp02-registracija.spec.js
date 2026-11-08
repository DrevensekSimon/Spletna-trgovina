// TP-02 Registracija novega uporabnika (F-05, prioriteta visoka)
const { test, expect } = require('../pripomocki');
const { Glava, StranPrijava, StranRegistracija } = require('../strani');
const P = require('../podatki');

test('TP-02 | Registracija novega uporabnika in samodejna prijava', async ({ page, racuni, baza }) => {
  const glava = new Glava(page);
  const prijava = new StranPrijava(page);
  const registracija = new StranRegistracija(page);
  const nov = racuni.rezerviraj(P.novUporabnik);

  await test.step('Predpogoj: uporabnik je odjavljen, e-pošta še ni registrirana', async () => {
    const [obstojeci] = await baza.execute('SELECT id FROM users WHERE email = ?', [nov.email]);
    expect(obstojeci).toHaveLength(0);
    await page.goto('/');
    await glava.pricakujOdjavljen();
  });

  await test.step('1. Klikni »Prijava«, nato povezavo »Registracija«', async () => {
    await glava.prijava.click();
    await prijava.povezavaRegistracija.click();
    await expect(registracija.naslov).toBeVisible();
  });

  await test.step('2. Izpolni »Ime«, »Priimek«, »Email« in »Geslo«', async () => {
    await registracija.ime.fill(nov.ime);
    await registracija.priimek.fill(nov.priimek);
    await registracija.email.fill(nov.email);
    await registracija.geslo.fill(nov.geslo);
  });

  await test.step('3. Klikni »Registriraj se«', async () => {
    await registracija.gumbRegistriraj.click();
  });

  await test.step('4. Pričakovano: domača stran, samodejna prijava, v glavi »Test« in »Naročila«', async () => {
    await expect(page).toHaveURL('/');
    await glava.pricakujPrijavljen(P.novUporabnik.ime);
  });

  await test.step('4. Osveži stran – prijava ostane aktivna', async () => {
    await page.reload();
    await glava.pricakujPrijavljen(P.novUporabnik.ime);
  });

  await test.step('Končno stanje: nov račun je shranjen z vnesenimi podatki', async () => {
    const [zapisi] = await baza.execute(
      'SELECT email, first_name, last_name FROM users WHERE email = ?', [nov.email]);
    expect(zapisi).toEqual([{ email: nov.email, first_name: nov.ime, last_name: nov.priimek }]);
  });
});
