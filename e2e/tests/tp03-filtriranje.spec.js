// TP-03 Filtriranje Low Top (F-02, prioriteta srednja)
const { test, expect } = require('../pripomocki');
const { Glava, StranIzdelki } = require('../strani');
const P = require('../podatki');

test('TP-03 | Filter Low Top in obnovitev celotnega kataloga', async ({ page, katalog }) => {
  const glava = new Glava(page);
  const izdelki = new StranIzdelki(page);
  let zacetniNazivi;

  await test.step('Predpogoj: katalog vsebuje Low Top, Mid Top in High Top ter Triple White', async () => {
    const nazivi = katalog.izdelki.map(p => p.name);
    expect(nazivi).toContain(P.izdelki.tripleWhite.naziv);
    expect(nazivi.some(n => / Low /.test(n))).toBe(true);
    expect(nazivi.some(n => / Mid /.test(n))).toBe(true);
    expect(nazivi.some(n => / High /.test(n))).toBe(true);
  });

  await test.step('1. Klikni »Izdelki« in »Vsi izdelki«; zabeleži nazive in število', async () => {
    await page.goto('/');
    await glava.izdelki.click();
    await izdelki.filter(P.filterVsi).click();
    await expect(izdelki.kartice).toHaveCount(katalog.izdelki.length);
    zacetniNazivi = await izdelki.nazivi.allTextContents();
    expect([...zacetniNazivi].sort()).toEqual(katalog.izdelki.map(p => p.name).sort());
  });

  await test.step('2. Klikni »Low Top« in preveri nazive vseh prikazanih modelov', async () => {
    const vsiLow = zacetniNazivi.filter(n => / Low /.test(n));
    await izdelki.filter(P.filterLow).click();
    // Počakaj, da se seznam osveži (števec in število kartic), šele nato beri nazive.
    await expect(izdelki.stevec(vsiLow.length, zacetniNazivi.length)).toBeVisible();
    await expect(izdelki.kartice).toHaveCount(vsiLow.length);
    // Triple White mora biti prikazan ...
    await expect(izdelki.kartica(P.izdelki.tripleWhite.naziv)).toBeVisible();
    // ... in vsak prikazan model mora biti Low Top (brez Mid Top in High Top).
    const prikazani = await izdelki.nazivi.allTextContents();
    expect(prikazani.length).toBeGreaterThan(0);
    for (const naziv of prikazani) {
      expect(naziv, `${naziv} ni model Low Top`).toMatch(/ Low /);
      expect(naziv).not.toMatch(/ (Mid|High) /);
    }
    // Prikazani so vsi Low Top modeli iz kataloga, ne le del.
    expect([...prikazani].sort()).toEqual([...vsiLow].sort());
  });

  await test.step('3. Klikni »Vsi izdelki« – nazivi in število so enaki začetnemu katalogu', async () => {
    await izdelki.filter(P.filterVsi).click();
    await expect(izdelki.nazivi).toHaveText(zacetniNazivi);
    await expect(izdelki.stevec(zacetniNazivi.length, zacetniNazivi.length)).toBeVisible();
  });
});
