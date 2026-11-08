// TP-01 Prijava uporabnika (F-01, prioriteta visoka) – scenarija A in B
const { test, expect } = require('../pripomocki');
const { Glava, StranPrijava } = require('../strani');
const P = require('../podatki');

test.describe('TP-01 Prijava uporabnika', () => {
  test('TP-01 A | Uspešna prijava s pravilnim geslom', async ({ page, racuni }) => {
    const glava = new Glava(page);
    const prijava = new StranPrijava(page);
    let r1;

    await test.step('Predpogoj: R1 je registriran, prijava s pravilnim geslom preverjena, uporabnik odjavljen', async () => {
      r1 = await racuni.pripravi(P.r1);
      await page.goto('/');
      await glava.pricakujOdjavljen();
    });

    await test.step('1. Na domači strani klikni »Prijava« zgoraj desno', async () => {
      await glava.prijava.click();
      await expect(page).toHaveURL('/login');
    });

    await test.step('2. Vnesi e-pošto R1 in Prijava123!, nato klikni »Prijava«', async () => {
      await prijava.prijavi(r1.email, P.r1.geslo);
    });

    await test.step('3. Pričakovano: domača stran, v glavi »Testni« in »Naročila«', async () => {
      await expect(page).toHaveURL('/');
      await glava.pricakujPrijavljen(P.r1.ime);
    });

    await test.step('3. Osveži stran – prijava ostane aktivna', async () => {
      await page.reload();
      await expect(page).toHaveURL('/');
      await glava.pricakujPrijavljen(P.r1.ime);
    });
  });

  test('TP-01 B | Prijava z napačnim geslom je zavrnjena', async ({ page, racuni }) => {
    const glava = new Glava(page);
    const prijava = new StranPrijava(page);
    let r1;

    await test.step('Predpogoj: lastna priprava R1 v novem oknu (neodvisno od scenarija A)', async () => {
      r1 = await racuni.pripravi(P.r1);
      expect(P.napacnoGeslo).not.toBe(P.r1.geslo);
      await page.goto('/');
      await glava.pricakujOdjavljen();
    });

    await test.step('1. Klikni »Prijava«', async () => {
      await glava.prijava.click();
    });

    await test.step('2. Vnesi e-pošto R1 in Napacno123!, nato klikni »Prijava«', async () => {
      await prijava.prijavi(r1.email, P.napacnoGeslo);
    });

    await test.step('3. Pričakovano: obvestilo »Napačen email ali geslo«, ostane na prijavi, odjavljen', async () => {
      await expect(prijava.obvestilo).toHaveText(P.sporociloNapacnaPrijava);
      await expect(page).toHaveURL('/login');
      await expect(prijava.naslov).toBeVisible();
      await glava.pricakujOdjavljen();
    });

    await test.step('Končno stanje: uporabnik je odjavljen tudi po osvežitvi', async () => {
      await page.reload();
      await glava.pricakujOdjavljen();
    });
  });
});
