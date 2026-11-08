// TP-04 Dodajanje v košarico (F-03, prioriteta visoka)
// TP v1.2 dovoljuje poljubno začetno košarico (q0, S0, druge postavke), zato je primer
// izveden z dvema začetnima stanjema: prazna košarica in košarica z drugimi postavkami.
const { test, expect } = require('../pripomocki');
const { Glava, StranIzdelki, StranIzdelek, StranKosarica } = require('../strani');
const P = require('../podatki');

const { chicago, smokeGrey } = P.izdelki;

const zacetnaStanja = [
  { opis: 'prazna košarica', postavke: [] },
  {
    opis: 'košarica z drugo postavko in že enim Chicago 42',
    postavke: [{ naziv: smokeGrey.naziv, velikost: P.velikost, kolicina: 1 },
               { naziv: chicago.naziv, velikost: P.velikost, kolicina: 1 }],
  },
];

for (const stanje of zacetnaStanja) {
  test(`TP-04 | Dodajanje Chicago 42 v košarico (${stanje.opis})`, async ({ page, katalog }) => {
    const glava = new Glava(page);
    const seznam = new StranIzdelki(page);
    const izdelek = new StranIzdelek(page);
    const kosarica = new StranKosarica(page);
    let zacetek;

    // Zaznaj vsak poskus oddaje naročila – dodajanje v košarico ga ne sme sprožiti.
    const oddajeNarocil = [];
    page.on('request', r => {
      if (r.method() === 'POST' && new URL(r.url()).pathname === '/api/orders') oddajeNarocil.push(r.url());
    });

    await test.step('Predpogoj: Chicago 42 je na zalogi; pripravi začetno stanje košarice', async () => {
      expect(await katalog.zaloga(chicago.naziv, P.velikost)).toBeGreaterThan(0);
      const vsebina = stanje.postavke.map(p => {
        const iz = katalog.poNazivu(p.naziv);
        return { productId: iz.id, name: iz.name, price: iz.price, image: iz.image_url, size: p.velikost, quantity: p.kolicina };
      });
      await page.goto('/');
      await page.evaluate(v => localStorage.setItem('cart', JSON.stringify(v)), vsebina);
    });

    await test.step('Predpogoj: odpri košarico in zabeleži q0, S0 in druge postavke', async () => {
      await page.reload();
      await glava.kosarica.click();
      zacetek = await kosarica.preberiStanje();
      // Prebrano stanje z zaslona se mora ujemati s pripravljenim.
      expect(zacetek.postavke).toEqual(stanje.postavke);
    });
    const q0 = zacetek.postavke.find(p => p.naziv === chicago.naziv && p.velikost === P.velikost)?.kolicina ?? 0;
    const S0 = zacetek.skupaj;
    const druge = zacetek.postavke.filter(p => !(p.naziv === chicago.naziv && p.velikost === P.velikost));

    await test.step('1. Klikni »Izdelki«, nato kartico izdelka Chicago', async () => {
      await glava.izdelki.click();
      await seznam.kartica(chicago.naziv).click();
      await expect(izdelek.naslov(chicago.naziv)).toBeVisible();
    });

    await test.step('2. Preveri ceno 180 € in da je gumb »42« omogočen; klikni ga', async () => {
      await expect(izdelek.cena(P.eur(chicago.cena))).toBeVisible();
      await expect(izdelek.velikost(P.velikost)).toBeEnabled();
      await izdelek.velikost(P.velikost).click();
      await expect(izdelek.velikost(P.velikost)).toHaveAttribute('aria-pressed', 'true');
    });

    await test.step('3. Klikni »Dodaj v košarico«', async () => {
      await izdelek.gumbDodaj.click();
    });

    await test.step(`4. Pričakovano: košarica, Chicago 42 ima količino q0+1 = ${q0 + 1}, skupaj S0+180 = ${S0 + chicago.cena} €`, async () => {
      await expect(page).toHaveURL('/cart');
      await expect(kosarica.naslov).toBeVisible();
      await expect(kosarica.postavka(chicago.naziv, P.velikost)).toHaveCount(1);
      await expect(kosarica.kolicina(chicago.naziv, P.velikost)).toHaveText(String(q0 + 1));
      await expect(kosarica.skupaj).toHaveText(P.eur(S0 + chicago.cena));
    });

    await test.step('4. Druge postavke so nespremenjene', async () => {
      const konec = await kosarica.preberiStanje();
      const drugeKonec = konec.postavke.filter(p => !(p.naziv === chicago.naziv && p.velikost === P.velikost));
      expect(drugeKonec).toEqual(druge);
      if (stanje.postavke.length === 0) {
        // Pri praznem začetku: samo Chicago 42, količina 1, skupaj 180 €.
        expect(konec).toEqual({ postavke: [{ naziv: chicago.naziv, velikost: P.velikost, kolicina: 1 }], skupaj: 180 });
      }
    });

    await test.step('Končno stanje: izdelek je v košarici, naročilo ni oddano', async () => {
      await page.reload();
      await expect(kosarica.kolicina(chicago.naziv, P.velikost)).toHaveText(String(q0 + 1));
      await expect(kosarica.prijavaZaNadaljevanje).toBeVisible();
      expect(oddajeNarocil, 'Dodajanje v košarico ne sme oddati naročila').toEqual([]);
    });
  });
}
