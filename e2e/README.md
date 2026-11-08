# Naloga 4 - avtomatizirano funkcionalno testiranje

Playwright izvaja pet testnih primerov iz poročila različice 1.2 kot šest
neodvisnih scenarijev. Aplikacija, Express API in MySQL so resnični; odzivov
prijave, registracije, kataloga ali naročil testi ne nadomeščajo.
Zamenjane so samo zunanje fotografije Unsplash, da njihov prenos ne vpliva
na zanesljivost funkcionalnih testov.

## Namestitev in zagon

Potrebuješ Node.js 22 ali novejši in zagnan Docker.
V korenski mapi projekta izvedi:

```sh
npm ci
npm ci --prefix backend
npm ci --prefix frontend
npx playwright install chromium
npm run e2e:db
npm run test:e2e
```

Testi sami pripravijo shemo in začetne podatke ter zaženejo API na priključku
5101 in produkcijsko zgrajen React na http://127.0.0.1:3101.
Playwright počaka na pripravljenost obeh strežnikov in ju po izvedbi ustavi.
Testna baza `shoe_shop_e2e` teče na priključku 43306, ločeno od razvojne baze.
Njeni podatki so začasni; zaustaviš jo z `npm run e2e:db:stop`.

HTML-poročilo odpreš z:

```sh
npm run test:e2e:report
```

Za ogled izvajanja uporabi `npm run test:e2e -- --headed`, za interaktivno
razhroščevanje pa `npm run test:e2e:ui`.
En sam scenarij lahko zaženeš npr. z `npm run test:e2e -- --grep TP-01B`.

## Povezava s primeri in pregled skript

| Primer | Test v `tests/shop.spec.js` | Preverjanje pričakovanega rezultata |
| --- | --- | --- |
| TP-01 A / F-01 | Uspešna prijava registriranega računa R1 | Domača stran, ime, Naročila, veljavna seja, obstoj prijave po osvežitvi. |
| TP-01 B / F-01 | Zavrnitev napačnega gesla za preverjen račun R1 | Točno obvestilo, URL prijave, neprijavljena glava, odsotnost žetona in zavrnitev dostopa do naročil. |
| TP-02 / F-05 | Registracija novega uporabnika in samodejna prijava | Vnos vseh štirih polj, samodejna prijava, zapis uporabnika v bazi in prijava po osvežitvi. |
| TP-03 / F-02 | Low Top prikaže pravilne modele in Vsi izdelki obnovi katalog | Celoten začetni seznam osmih izdelkov, samo Triple White v Low Top, odsotnost High/Mid in obnovitev istega seznama. |
| TP-04 / F-03 | Chicago 42 poveča količino in znesek ter ohrani druge postavke | Prazna košarica -> 1 kos/180 EUR; nato znan začetek q0=1/S0=305 EUR -> 2 kosa/485 EUR, Smoke Grey ostane nespremenjen. |
| TP-05 / F-04 | Oddaja naročila shrani prave podatke in izprazni košarico | Povzetek, dostava, potrditveno obvestilo, nov ID, izdelek/velikost/količina/znesek/stanje, obstoj po osvežitvi, podatki v bazi in prazna košarica. |

`fixtures.js` za vsak scenarij ustvari svež račun z naključno e-pošto.
Za oba scenarija prijave predhodno preveri pravilno geslo prek API-ja.
Vnos prijave v samem testu še vedno poteka skozi brskalnik. TP-05 si sam
pripravi prijavo in košarico; izvedbe drugih testov ne potrebuje.
Priprava in odstranjevanje podatkov ne štejeta za izvedbo drugega testnega primera.

Vsak test ima svoj brskalniški kontekst, piškotke in lokalno shrambo.
Po testu se odstranijo samo njegovi računi in naročila ter povrne porabljena
zaloga. Povezovanje z običajno bazo prepreči preverjanje končnice `_e2e`.
Zaradi skupnega kataloga je privzeto en izvajalec; vrstni red testov ni pogoj.

Izbira elementov uporablja `getByRole`, `getByLabel` in omejene stabilne
`data-testid` oznake za postavke ter zneske. Obrazci imajo povezane oznake in
polja. Čakanje temelji na Playwrightovih preverjanjih stanja, odzivu API-ja
in dogodku dialoga; ni fiksnih premorov `waitForTimeout` ali `sleep`.
Samodejne ponovitve so izklopljene, da prvi neuspeh ostane viden.

## Cevovod in rezultati

V `.github/workflows/test.yml` je opravilo `functional-tests` z Node.js 24,
MySQL 8.0, namestitvijo Chromiuma ter istim ukazom `npm run test:e2e`.
Izvede se ob pushu oziroma pull requestu v obstoječe veje cevovoda in tudi
prek `workflow_dispatch`. Opravilo `build` zahteva uspešne funkcionalne teste.
Neuspeh zato ustavi odvisne korake gradnje in objave.

Rezultati se shranijo tudi ob neuspehu:

- `playwright-report/index.html`: pregled izvajanja, korakov in prilog;
- `output/naloga-4/results.json`: strojno berljivi podrobni rezultati;
- `output/naloga-4/junit.xml`: rezultati JUnit XML;
- `test-results/`: ob neuspehu posnetek zaslona, video in sled izvajanja.

GitHub Actions jih hrani 30 dni v artefaktu `functional-test-reports`.
Sledi in drugi dokazi lahko vsebujejo podatke začasnih testnih računov.

## Druga lokalna instanca MySQL

Namesto Dockerja lahko uporabiš svojo ločeno bazo s končnico `_e2e`.
Povezavo določajo `E2E_DB_HOST`, `E2E_DB_PORT`, `E2E_DB_NAME`,
`E2E_DB_USER` in `E2E_DB_PASSWORD`. Baza in uporabnik z dovoljenji za
ustvarjanje tabel morata že obstajati. `E2E_API_PORT` in `E2E_APP_PORT`
spremenita priključka strežnikov.

## Viri za izbiro orodja

- https://playwright.dev/docs/intro
- https://playwright.dev/docs/test-fixtures
- https://playwright.dev/docs/test-webserver
- https://playwright.dev/docs/test-reporters
- https://playwright.dev/docs/ci-intro
