# Rahman Portfolio — Backend

Express + Nodemailer backend that **stores** contact form submissions and **emails** you a
notification. No third-party form services needed.

## How it works

1. The contact form POSTs to `POST /api/contact`
2. The server **validates** the data (name, email format, spam honeypot)
3. The submission is **saved** to `server/data/submissions.json` (the store)
4. A **notification email** is sent to your inbox via Nodemailer (Gmail SMTP)

## One-time setup — Gmail App Password (required for emails)

Your normal Gmail password won't work with SMTP. Use an **App Password**:

1. Go to https://myaccount.google.com/security
2. Turn **ON** "2-Step Verification" (required)
3. Go to **App passwords** (search it in the account menu)
4. App = "Mail" → Device = "Other" → **Generate**
5. Google shows a 16-character code like `abcd efgh ijkl mnop` — copy it

Then edit `server/.env`:

```
SMTP_PASS=abcd_efgh_ijkl_mnop
```

(remove any spaces). `SMTP_USER` and `TO_EMAIL` should already be your Gmail address.

The form still **stores** messages even if email isn't configured — you can view them at
`GET /api/submissions`.

## Run it

```bash
cd server
npm install
npm run dev        # starts on http://localhost:5000
```

## Endpoints

| Method | Path | What it does |
|---|---|---|
| POST | `/api/contact` | Accepts `{name, email, business, message, _honey}`. Validates, stores, emails. |
| GET | `/api/submissions` | Returns all stored submissions (JSON array). |

## Production (one command)

After `npm run build` in `react-app/`, this server also serves the built site, so a single
process runs everything:

```bash
npm run dev        # from server/ -> serves React app + API on http://localhost:5000
```

## Note on storing user data

Submissions are saved as a plain JSON file — fine for low traffic. For production scale,
swap `store.js` for a database (MongoDB/Postgres) without changing the API.