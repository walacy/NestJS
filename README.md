# NestJS Archetype

Functional NestJS starter with:

- Health check endpoint
- Notes use case with in-memory storage
- Request validation
- Unit tests and e2e tests

## Requirements

- Node.js 18+
- npm 9+

## Install

```bash
npm install
```

## Run

```bash
npm run start:dev
```

## Test

```bash
npm test
npm run test:e2e
```

## Endpoints

- `GET /health`
- `GET /notes`
- `GET /notes/:id`
- `POST /notes`

Example body for `POST /notes`:

```json
{
  "title": "First note",
  "content": "Useful note content"
}
```
