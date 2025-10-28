# kifur

## Inicialitzar projecte

npm install

## Configuració d'entorn

cp .env.template .env

Actualitzeu els valors segons el vostre entorn (URI de MongoDB, ports, orígens permesos, token de sockets).

## Desenvolupament

npm run dev

### Qualitat del codi

npm run lint
npm run lint:fix
npm run format
npm run format:fix

### Finalitzar una aula

> POST /v1/classroom/:roomId/end

Retorna el resum final (rànquing d'alumnes i estadístiques per pregunta) i marca l'aula com a finalitzada. També emet l'esdeveniment `classroom-finished` via WebSocket.

## Inicialitzar servidor test

npm run start:local

## Base de dades local amb Docker

docker compose up -d

Configureu la variable `MONGODB_URI` (per exemple a `.env`) amb `mongodb://127.0.0.1:27017/kifur` per utilitzar la base de dades local.

Per gestionar les dades via interfície gràfica, obriu `http://localhost:8081` (Mongo Express) i inicieu sessió amb les credencials definides a `.env`.

### Sembrar qüestionaris d'exemple

npm run seed:quizzes

Aquesta ordre crea o actualitza els qüestionaris del fitxer `data/quizzes.seed.json` a MongoDB.

## WebSockets

Els clients han d'enviar el token definit a `SOCKET_ACCESS_TOKEN` via `auth.token`, `query.token` o header `x-socket-token` en connectar-se.
Els clients de mostra (`client-test/html/*.html`) utilitzen `client-test/js/socket-config.js`, on podeu canviar URL/token desant-los a `localStorage` (feu doble clic sobre l'indicador d'estat per obrir el diàleg de configuració).


## Test documents

node test-student.js

node test-student-2.js

node test-teacher.js
