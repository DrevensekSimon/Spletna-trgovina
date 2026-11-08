# Avtomatizacija funkcionalnega testiranja spletne trgovine Shoe Shop

4. naloga | Simon Drevenšek in Marko Kramer | 8. 11. 2026

## Izbira in namestitev orodja

Izbran je Playwright Test 1.65.0, ker projekt uporablja JavaScript, React in Express. Omogoča funkcionalno testiranje v brskalniku in vključitev v GitHub Actions. Rezultate vrne v obliki HTML, JSON in JUnit XML.

Orodje je nameščeno med razvojne odvisnosti projekta. Odvisnosti in brskalnik Chromium se namestijo z ukazoma:

```sh
npm ci
npx playwright install chromium
```

## Avtomatizirani testni primeri

Avtomatizirani so testni primeri iz 2. naloge z upoštevanimi dopolnitvami iz 3. naloge. TP-01 združuje uspešno in neuspešno prijavo, novi TP-02 pa preverja registracijo. Skripte je ustvaril agent UI OpenAI Codex in so shranjene v e2e/tests/shop.spec.js.

| Primer | Kaj skripta preverja | Rezultat |
| --- | --- | --- |
| TP-01 A | Uspešna prijava računa R1, domača stran, ime uporabnika, povezava Naročila in aktivna seja. | Uspešen |
| TP-01 B | Napačno geslo prikaže sporočilo Napačen email ali geslo. Uporabnik ostane na strani za prijavo in odjavljen. | Uspešen |
| TP-02 | Ustvarjanje novega računa, samodejna prijava in ohranitev prijave po osvežitvi. | Uspešen |
| TP-03 | Low Top prikaže samo ustrezne modele, Vsi izdelki pa obnovi začetni katalog. | Uspešen |
| TP-04 | Dodajanje Chicago velikosti 42, pravilna količina in znesek ter ohranitev drugih postavk v košarici. | Uspešen |
| TP-05 | Potrditev oddaje, shranjeno naročilo Chicago 42, količina 1, znesek 180 EUR, stanje V čakanju in prazna košarica. | Uspešen |

## Preverjanje skript

Koraki, predpogoji in podatki: skripte zajamejo zahtevane korake ter pripravijo registriran račun, novo e-pošto, izdelke na zalogi in znano začetno stanje košarice. Uporabljeni so podatki iz testnih primerov, vključno z napačnim geslom, modelom Chicago, velikostjo 42, ceno 180 EUR in naslovom Testna ulica 10, Maribor, 2000.

Pričakovani rezultati: preverjajo se konkretni rezultati iz tabele. Pri naročilu se poleg potrditve preverijo vsebina in znesek shranjenega naročila ter prazna košarica. Pri prijavi se preverijo tudi ime uporabnika, povezava Naročila oziroma sporočilo o napačnih podatkih.

Robustnost: elementi se izbirajo po vlogah, oznakah polj in stabilnih testnih oznakah. Skripte samodejno čakajo na ustrezno stanje elementov; fiksnih pavz ni. Vsak scenarij ima ločen brskalniški kontekst; potrebni uporabniški računi in košarica se pripravijo za posamezen test. Testi niso odvisni od vrstnega reda drugih testov.

## Vključitev v cevovod

V .github/workflows/test.yml je dodano opravilo functional-tests. Pripravi testno bazo in aplikacijo, namesti Chromium ter izvede npm run test:e2e. Rezultati HTML, JSON in JUnit XML se shranijo kot artefakti. Uspešna izvedba funkcionalnih testov je pogoj za nadaljnjo gradnjo aplikacije.

Konfiguracija je vključena v projekt. Oddaljeni zagon v GitHub Actions še ni preverjen.

## Rezultati testiranja

Testiranje je bilo 8. 11. 2026 izvedeno na lokalni aplikaciji v Chromiumu. Uspešnih je bilo vseh šest scenarijev petih testnih primerov; neuspešnih ni bilo.
