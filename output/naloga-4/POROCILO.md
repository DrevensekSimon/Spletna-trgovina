# Avtomatizacija funkcionalnega testiranja spletne trgovine Shoe Shop

4. naloga | Simon Drevenšek in Marko Kramer | 8. 11. 2026

Avtomatiziranih je pet testnih primerov kot šest samostojnih scenarijev. Končni lokalni zagon je uspešno zaključil vseh 6 scenarijev, brez preskokov in samodejnih ponovitev. Dodatni zagon za preverjanje neodvisnosti je uspešno zaključil oba izbrana scenarija. Testi so vključeni v konfiguracijo GitHub Actions.

## Izbira orodja in način uporabe

Izbran je Playwright Test 1.65.0. Projekt uporablja JavaScript, React in Express, zato teste pišemo v istem jeziku. Orodje omogoča izvajanje v resničnem brskalniku, preverjanje elementov po vlogah in oznakah, samodejno čakanje na njihovo stanje ter ločene brskalniške kontekste. Podpira GitHub Actions in izhode HTML, JSON ter JUnit XML.

Skripte je pripravil agent umetne inteligence OpenAI Codex. Pri tehničnem pregledu so bili primerjani predpogoji, podatki, koraki in pričakovani rezultati s poročilom testnih primerov različice 1.2 ter dopolnitvami iz 3. naloge. Dejanska izvedba je preverila tudi pravilnost ustvarjenih skript.

## Okolje in namestitev

| Del okolja | Uporabljena nastavitev |
| --- | --- |
| Sistem in Node.js | macOS 26.4, arm64; Node.js v24.22.1 |
| Brskalnik | Chromium 158.0.8127.18, 1280 x 720, sl-SI |
| Podatkovna baza | MySQL 8.0.46 v Dockerju; shoe_shop_e2e, priključek 43306 |
| Aplikacija | React: http://127.0.0.1:3101; Express API: http://127.0.0.1:5101 |

Po namestitvi Node.js 22 ali novejšega in zagonu Dockerja se odvisnosti, Chromium ter testna baza pripravijo iz korenske mape projekta:

```sh
npm ci
npm ci --prefix backend
npm ci --prefix frontend
npx playwright install chromium
npm run e2e:db
npm run test:e2e
```

Playwright sam pripravi shemo in začetne podatke, zgradi React ter zažene in po izvedbi ustavi oba testna strežnika. Baza je ločena od razvojne baze in uporablja začasno shrambo.

## Pokritost testnih primerov

Izvirna uspešna in neuspešna prijava sta združeni v TP-01 A in B. Novi TP-02 preverja registracijo. TP-03 do TP-05 ohranijo svoje oznake. Vsi scenariji so v e2e/tests/shop.spec.js; priprava in čiščenje sta v e2e/fixtures.js.

| Primer | Predpogoji in podatki | Preverjeni pričakovani rezultat |
| --- | --- | --- |
| TP-01 A | Neodvisno registriran R1; predhodno preverjeno pravilno geslo Prijava123!; nova neprijavljena seja. | Domača stran, ime Testni in povezava Naročila; veljaven žeton za isti račun; prijava ostane po osvežitvi. |
| TP-01 B | Lasten preverjen R1; pravilna e-pošta in napačno geslo Napacno123!. | Točno obvestilo Napačen email ali geslo; URL /login; neprijavljena glava, brez žetona; naročila brez prijave vrnejo 401. |
| TP-02 | Nova e-pošta s predpono test.registracija; Test Uporabnik; geslo Test123!. | Vnos vseh štirih polj, ustvarjen račun, samodejna prijava, pravilni podatki v bazi, delujoče geslo in prijava po osvežitvi. |
| TP-03 | 8 začetnih izdelkov; prisotni Low, Mid in High; pričakovani Low model Triple White. | Low Top vsebuje samo Triple White in nobenega High/Mid modela. Vsi izdelki obnovi enak seznam imen in število kot na začetku. |
| TP-04 | Chicago 42 na zalogi, cena 180 EUR. Prazen začetek in dodatno q0 = 1, S0 = 305 EUR s Smoke Grey. | Najprej 1 kos in 180 EUR; nato 2 kosa in 485 EUR. Velikost 42 in druga postavka ostaneta pravilni; naročilo še ni ustvarjeno. |
| TP-05 | Lasten prijavljen račun; samo Chicago 42, 1 kos, 180 EUR; Testna ulica 10, Maribor, 2000. | Pravilen povzetek in obvestilo; nov ID, pravilna vsebina, dostava, znesek in stanje V čakanju. Zapis ostane po osvežitvi; košarica je prazna. |

### Pregled robustnosti

Vsak scenarij ima nov brskalniški kontekst in lastno lokalno shrambo. Računi dobijo enolično e-pošto; R1 se pripravi neodvisno od TP-02. Za oba scenarija prijave je pravilno geslo preverjeno že v pripravi. TP-05 sam vzpostavi prijavo in košarico.

Elementi se izbirajo z getByRole, getByLabel in stabilnimi testnimi oznakami za postavke ter zneske. Oznake obrazcev so povezane s polji. Čakanje uporablja preverjanja stanja, odziv API-ja in dogodek dialoga; fiksnih pavz ni. API in baza sta resnična; nadomeščene so samo zunanje fotografije Unsplash.

## Rezultati izvedbe

Končni zagon se je začel 08. 11. 2026 ob 21:02:58 po času Europe/Ljubljana. Playwright je zabeležil celotno trajanje 11,4 s. Rezultat je 6 uspešnih, 0 neuspešnih, 0 preskočenih in 0 nestabilnih scenarijev. Nastavitev retries je 0.

| Scenarij | Rezultat | Trajanje |
| --- | --- | --- |
| TP-01A | Uspešen | 1244 ms |
| TP-01B | Uspešen | 747 ms |
| TP-02 | Uspešen | 835 ms |
| TP-03 | Uspešen | 487 ms |
| TP-04 | Uspešen | 921 ms |
| TP-05 | Uspešen | 1451 ms |

### Neodvisnost in čiščenje podatkov

TP-01B in TP-05 sta bila dodatno izvedena skupaj brez TP-01A, TP-02, TP-03 in TP-04. Oba sta uspela; zagon je trajal 7,9 s. To potrjuje, da napačna prijava in naročilo ne potrebujeta predhodne izvedbe drugih primerov.

Po končanih zagonih je baza vsebovala samo začetni demo račun, 0 naročil in vseh 64 zalog velikosti v začetnem stanju. Zaloga Chicago 42 je bila ponovno 8 kosov. Čiščenje odstrani samo račune posameznega testa in njihova naročila ter povrne porabljeno zalogo. Zaščita imena baze zahteva končnico _e2e.

### Ugotovitve med preverjanjem skript

| Ugotovitev | Popravek in presoja |
| --- | --- |
| Gradnja za CI | Obstoječa neuporabljena spremenljivka loading na DashboardPage je ustavila gradnjo. Zdaj je uporabljena v aria-busy; gradnja s CI=true uspe. |
| Prvi nabor 5/6 | TP-04 je napačno primerjal innerText s textContent. Po uskladitvi zajema besedila preverjanje ohranitve druge postavke uspe. To je bil popravek skripte, ne dokaz napake košarice. |

Dodatno je uspelo vseh 10 obstoječih backend in 20 frontend testov. V končnih šestih funkcionalnih scenarijih niso bila opažena odstopanja od pričakovanih rezultatov. Zapis prvotnega neuspešnega zagona in dokazila so ohranjeni v prvi-zagon-dokazila.zip.

## Vključitev v cevovod

V .github/workflows/test.yml je dodano opravilo functional-tests. Obstoječi push in pull_request sprožilci ga izvajajo za veje main, master, develop in production; dodan je tudi ročni workflow_dispatch. Opravilo uporablja Node.js 24, ločeno storitev MySQL 8.0 ter namestitev Chromiuma.

Po npm ci za teste, backend in frontend sledi npx playwright install --with-deps chromium ter npm run test:e2e. Gradnja aplikacije ima functional-tests med odvisnostmi needs. Neuspeh testov zato prepreči odvisne korake gradnje in objave. YAML in povezava odvisnosti sta lokalno preverjena.

Poročila in dokazila se z if: always() shranijo v artefakt functional-test-reports tudi pri neuspehu. Rok hrambe je 30 dni.

| Izhod | Vsebina |
| --- | --- |
| playwright-report/ | HTML pregled rezultatov, korakov in prilog; odpre se z npm run test:e2e:report. |
| results.json / junit.xml | Strojno berljivi rezultati JSON in JUnit XML v output/naloga-4. |
| test-results/ | Ob neuspehu: posnetek zaslona, video, sled izvajanja in opis napake. |
| Dodatna lokalna dokazila | independence.json in verification.json: neodvisni zagon, okolje, povrnitev zaloge ter kontrolne vsote izvornih datotek. |

### Ukazi za prikaz na zagovoru

```sh
npm run e2e:db
npm run test:e2e -- --headed
npm run test:e2e:report
```

Po uporabi se testna baza ustavi z npm run e2e:db:stop. Podrobnejša navodila, matrika povezav in samostojni zagon scenarija so v e2e/README.md.

### Obseg preverjanja

Izvedba je lokalna na macOS v Chromiumu. Javno okolje Vercel in drugi brskalniki niso bili preizkušeni. Oddaljeni zagon GitHub Actions še ni bil izveden, saj spremembe še niso poslane v repozitorij. Poročilo iz 3. naloge navaja lokalni popravek napake N-01 pri demo prijavi; ta nabor uporablja neodvisno preverjene registrirane račune R1.

### Viri

Podlaga: Oblikovanje testnih primerov za spletno trgovino Shoe Shop, različica 1.2; Gaja Gujt in Ida Rezo, Vzpostavitev in pregled testnih primerov, 2026. Uradna dokumentacija orodja, preverjena 8. 11. 2026:

- https://playwright.dev/docs/intro
- https://playwright.dev/docs/test-fixtures
- https://playwright.dev/docs/test-reporters
- https://playwright.dev/docs/ci-intro
