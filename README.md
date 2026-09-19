# Abdul Rahman — Portfolio (Full Stack)

Modern + Minimal portfolio for **Abdul Rahman** — Digital Marketer | Meta Ads Lead Generation
Specialist.

## Two versions, one project

| Folder | What it is |
|---|---|
| `react-app/` | **React (Vite)** version — the recommended one |
| `html/ + css/ + js/` | Original static HTML/CSS/JS version |
| `server/` | **Backend** — stores contact form submissions + sends email notifications |

## Quickstart (React + backend)

Double-click **`start-all.bat`** at the project root. It opens two windows:

1. **Backend** → http://localhost:5000
2. **React app** → http://localhost:5173 (open this)

Or manually:

```bash
# Terminal 1
cd server && npm install && npm run dev

# Terminal 2
cd react-app && npm install && npm run dev
```

## Contact form — storage + email

- Messages are **stored** in `server/data/submissions.json` automatically
- A **notification email** is sent to your inbox via Gmail SMTP (Nodemailer)

To enable emails, add your **Gmail App Password** to `server/.env` (see `server/README.md`
for step-by-step instructions). Without it, messages still get stored.

- View stored submissions: `http://localhost:5000/api/submissions`

## Editing your content

All text/content lives in **`react-app/src/data/content.js`** (name, skills, projects, email,
phone, Instagram — everything in one file). The static `html/` version has the same content
hard-coded.

## Profile photo

Place `react-app/public/assets/profile.jpg` (4:5 portrait, ~800x1000px). Until it exists, the
site auto-shows an "AR" initials placeholder.

## Deployment

```bash
cd react-app && npm run build   # creates react-app/dist/
```

The backend serves the built app automatically, so deploy the **`server/`** folder (with
`react-app/dist` alongside it) to Render / Railway / any Node host, or keep them separate
(Vercel for frontend + something like Render for backend).

## Project structure

```
Rahman portflio/
├── start-all.bat          ← one-click dev launcher
├── react-app/             ← React frontend (Vite)
│   ├── src/
│   │   ├── components/    ← one component per section
│   │   ├── data/content.js ← all your content
│   │   └── hooks/
│   └── public/assets/     ← profile image
├── server/                ← Express backend
│   ├── server.js          ← API + email + serves built app
│   ├── store.js           ← JSON submission storage
│   ├── .env               ← Gmail SMTP settings (App Password)
│   └── data/              ← stored submissions
├── html/ + css/ + js/     ← original static version
└── assets/                ← static version's photo folder
```