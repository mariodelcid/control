# Elotes Locos LLC - Cost Manager

A web app for managing product costs, recipes/BOM, daily sales, and profitability reports.

## Deploy to Railway

1. Push this folder to GitHub
2. Go to [railway.app](https://railway.app) and create a new project
3. Add a **PostgreSQL** database service
4. Add a new service from your GitHub repo
5. Railway will auto-detect Node.js and set `DATABASE_URL`
6. After first deploy, run the seed script in Railway's terminal:
   ```
   node seed.js
   ```

## Local Development

```bash
npm install
DATABASE_URL=postgres://user:pass@localhost:5432/elotes node server.js
```

## Seed Data

```bash
DATABASE_URL=your_connection_string node seed.js
```
