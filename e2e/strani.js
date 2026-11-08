// Page Object Model: vsak razred opisuje eno stran trgovine.
// Elementi se izbirajo po vlogah (getByRole), oznakah polj (getByLabel) in
// stabilnih data-testid oznakah. Fiksnih pavz ni – vse čakanje opravijo
// Playwrightova preverjanja (expect ... toBeVisible/toHaveText ...).
const { expect } = require('@playwright/test');

class Glava {
  constructor(page) {
    this.page = page;
    this.root = page.getByRole('banner');
    this.prijava = this.root.getByRole('link', { name: 'Prijava', exact: true });
    this.izdelki = this.root.getByRole('link', { name: 'Izdelki', exact: true });
    this.narocila = this.root.getByRole('link', { name: 'Naročila', exact: true });
    this.kosarica = this.root.getByRole('link', { name: 'Košarica', exact: true });
    this.odjava = this.root.getByRole('button', { name: 'Odjava', exact: true });
  }

  async pricakujPrijavljen(ime) {
    await expect(this.root.getByText(ime, { exact: true })).toBeVisible();
    await expect(this.narocila).toBeVisible();
    await expect(this.odjava).toBeVisible();
    await expect(this.prijava).toHaveCount(0);
  }

  async pricakujOdjavljen() {
    await expect(this.prijava).toBeVisible();
    await expect(this.narocila).toHaveCount(0);
    await expect(this.odjava).toHaveCount(0);
  }
}

class StranPrijava {
  constructor(page) {
    this.page = page;
    this.naslov = page.getByRole('heading', { name: 'Prijava', exact: true, level: 1 });
    this.email = page.getByLabel('Email', { exact: true });
    this.geslo = page.getByLabel('Geslo', { exact: true });
    this.gumbPrijava = page.getByRole('button', { name: 'Prijava', exact: true });
    this.povezavaRegistracija = page.getByRole('main').getByRole('link', { name: 'Registracija', exact: true });
    this.obvestilo = page.getByRole('alert');
  }

  async prijavi(email, geslo) {
    await expect(this.naslov).toBeVisible();
    await this.email.fill(email);
    await this.geslo.fill(geslo);
    await this.gumbPrijava.click();
  }
}

class StranRegistracija {
  constructor(page) {
    this.naslov = page.getByRole('heading', { name: 'Registracija', exact: true, level: 1 });
    this.ime = page.getByLabel('Ime', { exact: true });
    this.priimek = page.getByLabel('Priimek', { exact: true });
    this.email = page.getByLabel('Email', { exact: true });
    this.geslo = page.getByLabel('Geslo', { exact: true });
    this.gumbRegistriraj = page.getByRole('button', { name: 'Registriraj se', exact: true });
  }
}

class StranIzdelki {
  constructor(page) {
    this.page = page;
    this.kartice = page.getByTestId('product-card');
    this.nazivi = this.kartice.getByRole('heading', { level: 3 });
  }

  filter(ime) {
    return this.page.getByRole('button', { name: ime, exact: true });
  }

  stevec(prikazanih, vseh) {
    return this.page.getByText(`Prikazanih ${prikazanih} od ${vseh} izdelkov`, { exact: true });
  }

  kartica(naziv) {
    return this.page.getByRole('link', { name: naziv, exact: true });
  }
}

class StranIzdelek {
  constructor(page) {
    this.page = page;
    this.gumbDodaj = page.getByRole('button', { name: 'Dodaj v košarico', exact: true });
  }

  naslov(naziv) {
    return this.page.getByRole('heading', { name: naziv, exact: true, level: 1 });
  }

  cena(besedilo) {
    return this.page.getByRole('main').getByText(besedilo, { exact: true });
  }

  velikost(v) {
    return this.page.getByRole('button', { name: v, exact: true });
  }
}

class StranKosarica {
  constructor(page) {
    this.page = page;
    this.naslov = page.getByRole('heading', { name: 'Košarica', exact: true, level: 1 });
    this.postavke = page.getByTestId('cart-item');
    this.skupaj = page.getByTestId('cart-total');
    this.prazna = page.getByRole('heading', { name: 'Vaša košarica je prazna', exact: true });
    this.naBlagajno = page.getByRole('button', { name: 'Nadaljuj na blagajno', exact: true });
    this.prijavaZaNadaljevanje = page.getByRole('button', { name: 'Prijava za nadaljevanje', exact: true });
  }

  postavka(naziv, velikost) {
    return this.postavke
      .filter({ has: this.page.getByRole('heading', { name: naziv, exact: true }) })
      .filter({ hasText: `Velikost: ${velikost}` });
  }

  kolicina(naziv, velikost) {
    return this.postavka(naziv, velikost).getByTestId('cart-quantity');
  }

  // Prebere celotno stanje košarice z zaslona: postavke, količine in skupni znesek.
  async preberiStanje() {
    await expect(this.naslov.or(this.prazna)).toBeVisible();
    if (await this.prazna.isVisible()) return { postavke: [], skupaj: 0 };
    const postavke = [];
    for (const vrstica of await this.postavke.all()) {
      postavke.push({
        naziv: (await vrstica.getByRole('heading').textContent()).trim(),
        velikost: (await vrstica.getByText(/^Velikost:/).textContent()).replace('Velikost:', '').trim(),
        kolicina: Number(await vrstica.getByTestId('cart-quantity').textContent()),
      });
    }
    const skupaj = parseFloat((await this.skupaj.textContent()).replace('€', '').trim());
    return { postavke, skupaj };
  }
}

class StranBlagajna {
  constructor(page) {
    this.page = page;
    this.naslov = page.getByRole('heading', { name: 'Blagajna', exact: true, level: 1 });
    this.naslovDostave = page.getByLabel('Naslov', { exact: true });
    this.mesto = page.getByLabel('Mesto', { exact: true });
    this.postnaStevilka = page.getByLabel('Poštna številka', { exact: true });
    this.skupaj = page.getByTestId('checkout-total');
    this.potrdi = page.getByRole('button', { name: 'Potrdi naročilo', exact: true });
  }

  vrsticaPovzetka(naziv, velikost, kolicina) {
    return this.page.getByText(`${naziv} (Vel. ${velikost}) x${kolicina}`, { exact: true });
  }
}

class StranNarocila {
  constructor(page) {
    this.page = page;
    this.naslov = page.getByRole('heading', { name: 'Moja naročila', exact: true, level: 1 });
    this.kartice = page.getByTestId('order-card');
    this.brezNarocil = page.getByText('Nimate še nobenih naročil', { exact: true });
  }

  // Vrne ID-je vseh prikazanih naročil (iz besedila »Naročilo #<id>«).
  async preberiIdje() {
    await expect(this.naslov).toBeVisible();
    await expect(this.kartice.first().or(this.brezNarocil)).toBeVisible();
    const besedila = await this.kartice.getByText(/^Naročilo #\d+$/).allTextContents();
    return besedila.map(b => Number(b.replace('Naročilo #', '')));
  }

  kartica(id) {
    return this.kartice.filter({ has: this.page.getByText(`Naročilo #${id}`, { exact: true }) });
  }
}

module.exports = {
  Glava, StranPrijava, StranRegistracija, StranIzdelki, StranIzdelek,
  StranKosarica, StranBlagajna, StranNarocila,
};
