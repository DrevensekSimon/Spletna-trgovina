// Testni podatki iz dokumenta »Oblikovanje testnih primerov« v1.2 (7. 11. 2026).
// Vsaka vrednost je prepisana iz razdelka »Podatki« ustreznega testnega primera.

const izdelki = {
  chicago: { naziv: 'Air Jordan 1 Retro High OG "Chicago"', cena: 180 },
  tripleWhite: { naziv: 'Air Jordan 1 Low "Triple White"', cena: 110 },
  smokeGrey: { naziv: 'Air Jordan 1 Mid "Smoke Grey"', cena: 125 },
};

module.exports = {
  izdelki,
  velikost: '42',

  // TP-01: račun R1, pravilno in napačno geslo
  r1: { ime: 'Testni', priimek: 'Uporabnik', predpona: 'test.prijava', geslo: 'Prijava123!' },
  napacnoGeslo: 'Napacno123!',
  sporociloNapacnaPrijava: 'Napačen email ali geslo',

  // TP-02: nov uporabnik
  novUporabnik: { ime: 'Test', priimek: 'Uporabnik', predpona: 'test.registracija', geslo: 'Test123!' },

  // TP-03: filtra
  filterLow: 'Low Top',
  filterVsi: 'Vsi izdelki',

  // TP-05: podatki za dostavo in pričakovana obvestila
  dostava: { naslov: 'Testna ulica 10', mesto: 'Maribor', postnaStevilka: '2000' },
  sporociloNarocilo: 'Naročilo uspešno oddano!',
  stanjeNovegaNarocila: 'V čakanju',
  praznaKosarica: 'Vaša košarica je prazna',
};

// Pretvori znesek v obliko, ki jo prikazuje aplikacija (npr. 180 -> "180.00 €").
module.exports.eur = (znesek) => `${Number(znesek).toFixed(2)} €`;
