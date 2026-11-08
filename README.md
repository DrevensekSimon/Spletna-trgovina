# Shoe Shop

React trgovina z Express API-jem in MySQL bazo.

## Zagon z Dockerjem

```sh
docker compose up -d --build
```

- Trgovina: http://localhost:3001
- API: http://localhost:5001/api
- MySQL: localhost:3307
- Demo prijava: `demo@example.com` / `demo123`

Frontend port lahko spremeniš z `FRONTEND_PORT=3002 docker compose up -d`.
Backend ob zagonu pripravi tabele ter uvozi 8 testnih izdelkov, 64 velikosti
in demo uporabnika. Ponoven uvoz ne podvoji podatkov in ne ponastavi zaloge.
Geslo demo uporabnika se nastavi na `demo123`. Imena modelov Air Jordan ostajajo
imena izdelkov v trgovini Shoe Shop.

Ročen ponoven uvoz:

```sh
docker compose exec backend npm run db:setup
```

Zaustavitev (podatki ostanejo shranjeni): `docker compose stop`.

## Lokalni razvoj

Zaženi bazo z `docker compose up -d mysql`. V mapi `backend` kopiraj
`.env.example` v `.env`, nato zaženi `npm ci`, `npm run db:setup` in `npm run dev`.
V drugem terminalu v mapi `frontend` zaženi `npm ci` in `PORT=3001 npm start`.
Če Docker frontend ali backend že tečeta, ju najprej ustavi z
`docker compose stop frontend backend`.

Statistična nadzorna plošča trenutno prikazuje obstoječe simulirane podatke.

## Naloga 4 - funkcionalni testi

Navodila za namestitev, zagon šestih scenarijev, pregled rezultatov in
vključitev v GitHub Actions so v [e2e/README.md](e2e/README.md).
Hiter zagon po namestitvi odvisnosti in Chromiuma:

```sh
npm run e2e:db
npm run test:e2e
npm run test:e2e:report
```

Testi uporabljajo svojo začasno bazo in aplikacijo na priključku 3101.
