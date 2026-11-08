// TP-05 Oddaja naročila (F-04, prioriteta visoka)
const { test, expect } = require('../pripomocki');
const {
  Glava, StranPrijava, StranIzdelki, StranIzdelek, StranKosarica, StranBlagajna, StranNarocila,
} = require('../strani');
const P = require('../podatki');

const { chicago } = P.izdelki;

test('TP-05 | Oddaja naročila, shranjeno naročilo in prazna košarica', async ({ page, racuni, katalog, request }) => {
  const glava = new Glava(page);
  const kosarica = new StranKosarica(page);
  const blagajna = new StranBlagajna(page);
  const narocila = new StranNarocila(page);
  let racun;
  let zacetniIdji;
  let novId;

  await test.step('Predpogoj: neodvisno pripravi in prijavi registriran račun', async () => {
    racun = await racuni.pripravi(P.r1);
    await page.goto('/');
    await glava.prijava.click();
    await new StranPrijava(page).prijavi(racun.email, racun.geslo);
    await glava.pricakujPrijavljen(racun.ime);
  });

  await test.step('Predpogoj: zabeleži obstoječa naročila', async () => {
    await glava.narocila.click();
    zacetniIdji = await narocila.preberiIdje();
  });

  await test.step('Predpogoj: košarica vsebuje samo Chicago 42, količina 1, 180 € (na zalogi)', async () => {
    expect(await katalog.zaloga(chicago.naziv, P.velikost)).toBeGreaterThan(0);
    await glava.kosarica.click();
    await expect(kosarica.prazna).toBeVisible();
    await glava.izdelki.click();
    await new StranIzdelki(page).kartica(chicago.naziv).click();
    const izdelek = new StranIzdelek(page);
    await izdelek.velikost(P.velikost).click();
    await izdelek.gumbDodaj.click();
    expect(await kosarica.preberiStanje()).toEqual({
      postavke: [{ naziv: chicago.naziv, velikost: P.velikost, kolicina: 1 }], skupaj: chicago.cena,
    });
  });

  await test.step('1. V košarici klikni »Nadaljuj na blagajno«; preveri naslov »Blagajna«', async () => {
    await kosarica.naBlagajno.click();
    await expect(blagajna.naslov).toBeVisible();
  });

  await test.step('2. Izpolni dostavna polja in preveri povzetek: Chicago, 42, 1, skupaj 180 €', async () => {
    await blagajna.naslovDostave.fill(P.dostava.naslov);
    await blagajna.mesto.fill(P.dostava.mesto);
    await blagajna.postnaStevilka.fill(P.dostava.postnaStevilka);
    await expect(blagajna.naslovDostave).toHaveValue(P.dostava.naslov);
    await expect(blagajna.mesto).toHaveValue(P.dostava.mesto);
    await expect(blagajna.postnaStevilka).toHaveValue(P.dostava.postnaStevilka);
    await expect(blagajna.vrsticaPovzetka(chicago.naziv, P.velikost, 1)).toBeVisible();
    await expect(blagajna.skupaj).toHaveText(P.eur(chicago.cena));
  });

  await test.step('3. Klikni »Potrdi naročilo«, preveri »Naročilo uspešno oddano!« in potrdi z »OK«', async () => {
    const obvestilo = page.waitForEvent('dialog');
    await blagajna.potrdi.click();
    const dialog = await obvestilo;
    expect(dialog.message()).toBe(P.sporociloNarocilo);
    await dialog.accept();
  });

  await test.step('Pričakovano: po potrditvi obvestila se odpre »Moja naročila«', async () => {
    await expect(page).toHaveURL('/orders');
    await expect(narocila.naslov).toBeVisible();
  });

  await test.step('4. Poišči nov ID glede na začetni seznam in preveri vsebino, znesek in stanje', async () => {
    await expect(narocila.kartice).toHaveCount(zacetniIdji.length + 1);
    const novi = (await narocila.preberiIdje()).filter(id => !zacetniIdji.includes(id));
    expect(novi, 'Nastati mora natanko eno novo naročilo').toHaveLength(1);
    [novId] = novi;
    const kartica = narocila.kartica(novId);
    await expect(kartica.getByText(chicago.naziv, { exact: true })).toBeVisible();
    await expect(kartica.getByText(`Vel. ${P.velikost} x1`, { exact: true })).toBeVisible();
    await expect(kartica.getByTestId('order-total')).toHaveText(P.eur(chicago.cena));
    await expect(kartica.getByText(P.stanjeNovegaNarocila, { exact: true })).toBeVisible();
  });

  await test.step('4. Osveži stran in ponovno preveri isti zapis', async () => {
    await page.reload();
    const kartica = narocila.kartica(novId);
    await expect(kartica).toHaveCount(1);
    await expect(kartica.getByText(chicago.naziv, { exact: true })).toBeVisible();
    await expect(kartica.getByText(`Vel. ${P.velikost} x1`, { exact: true })).toBeVisible();
    await expect(kartica.getByTestId('order-total')).toHaveText(P.eur(chicago.cena));
    await expect(kartica.getByText(P.stanjeNovegaNarocila, { exact: true })).toBeVisible();
    // Naročilo je shranjeno na strežniku skupaj z naslovom za dostavo.
    const odziv = await request.get('/api/orders', { headers: { Authorization: `Bearer ${racun.zeton}` } });
    const shranjeno = (await odziv.json()).find(o => o.id === novId);
    expect(shranjeno).toMatchObject({
      shipping_address: P.dostava.naslov, shipping_city: P.dostava.mesto,
      shipping_postal_code: P.dostava.postnaStevilka, status: 'pending',
    });
  });

  await test.step('5. Odpri košarico – prikazuje »Vaša košarica je prazna«', async () => {
    await glava.kosarica.click();
    await expect(kosarica.prazna).toBeVisible();
    await expect(kosarica.postavke).toHaveCount(0);
  });
});
