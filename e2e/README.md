# Naloga 4 – avtomatizirano funkcionalno testiranje (Marko Kramer)

Veja `naloga-4-marko`. Playwright Test izvaja testne primere iz dokumenta
»Oblikovanje testnih primerov« v1.2 (posodobljen po pregledu Gaje Gujt in Ide Rezo).
Aplikacija, Express API in MySQL so resnični; nadomeščene so le zunanje slike Unsplash.

## Struktura

| Datoteka | Vsebina |
| --- | --- |
| `podatki.js` | testni podatki, prepisani iz razdelka »Podatki« vsakega TP |
| `strani.js` | Page Object Model (glava, prijava, registracija, izdelki, izdelek, košarica, blagajna, naročila) |
| `pripomocki.js` | fixture-i: priprava računov z enolično oznako, katalog, čiščenje po testu |
| `tests/tp01-prijava.spec.js` | TP-01 A uspešna prijava, TP-01 B napačno geslo |
| `tests/tp02-registracija.spec.js` | TP-02 registracija in samodejna prijava |
| `tests/tp03-filtriranje.spec.js` | TP-03 filter Low Top in obnovitev kataloga |
| `tests/tp04-kosarica.spec.js` | TP-04 dodajanje Chicago 42 – dve začetni stanji (prazna / z drugimi postavkami) |
| `tests/tp05-narocilo.spec.js` | TP-05 oddaja naročila, »Moja naročila«, prazna košarica |
| `environment.js`, `start-backend.js`, `serve-frontend.js` | zagon testne baze, API-ja in Reacta (skupna infrastruktura projekta) |

Vsak korak TP je v skripti svoj `test.step` z enakim besedilom kot v dokumentu,
zato se v HTML-poročilu vidi, kateri korak je uspel ali padel.

## Zagon

Potrebna sta Node.js 22+ in zagnan Docker.

```sh
npm ci
npm ci --prefix backend
npm ci --prefix frontend
npx playwright install chromium
npm run e2e:db          # testna baza MySQL na 127.0.0.1:43306
npm run test:e2e        # TP-01 … TP-05
npm run test:e2e:report # odpre HTML-poročilo
npm run e2e:db:stop
```

## Cevovod

Opravilo `functional-tests` v `.github/workflows/test.yml` se izvede ob pushu na
vejo `naloga-4-marko`: zažene MySQL kot storitev, namesti Chromium in izvede
`npm run test:e2e`. Artefakt `functional-test-reports-marko` vsebuje
`playwright-report/` (HTML), `output/naloga-4-marko/junit.xml`,
`output/naloga-4-marko/results.json` in ob neuspehu `test-results/`
(posnetek zaslona, video, sled). Opravilo `build` je odvisno od uspešnih
funkcionalnih testov. Na tej veji se Docker slike ne objavljajo.
