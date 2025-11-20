# Backend (Node + Express + MySQL)
## Quickstart
1) Copy `.env.example` to `.env` and fill DB credentials.
2) Create the database and tables: run `schema.sql` in your MySQL.
3) Install deps: `npm install`
4) Start dev server: `npm run dev` (or `npm start`)

## Routes
- `GET /api/health` DB health check
- `POST /api/auth/register` {name,email,password}
- `POST /api/auth/login` {email,password} -> {token}
- `GET /api/auth/me` (Bearer token)
- `GET /api/products` query: q, sort=price_asc|price_desc, min, max
- `GET /api/products/:id`
- `POST /api/products` (admin) -> create
- `PUT /api/products/:id` (admin) -> update
- `DELETE /api/products/:id` (admin) -> delete
- `POST /api/upload` (admin) multipart/form-data: image
