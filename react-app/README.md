# Rahman Portfolio — React App (Vite)

Modern + Minimal portfolio for Abdul Rahman (Meta Ads & Lead Generation Specialist).

## Run locally (full stack)

The contact form needs the backend. The easiest way is the launcher at the project root:

```bat
start-all.bat
```

This starts:
- **Backend** → http://localhost:5000 (stores submissions + sends email)
- **React frontend** → http://localhost:5173 (open this in your browser)

Or manually, in two terminals:

```bash
# Terminal 1 — backend
cd server
npm install
npm run dev

# Terminal 2 — frontend
cd react-app
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The build output goes to `react-app/dist/`. The backend (`server/`) serves that `dist` folder
automatically, so in production you only run the backend:

```bash
cd server
npm run dev     # serves React + API together on http://localhost:5000
```

## Structure

- `src/App.jsx` — assembles all sections
- `src/data/content.js` — all copy/content in one file (edit here first!)
- `src/components/` — one component per section
- `src/hooks/` — useTyping (hero typing effect), useReveal (scroll animations)

## Contact form (own backend)

The form POSTs to `/api/contact` (in dev, Vite proxies it to `http://localhost:5000`). The
backend stores the message in `server/data/submissions.json` and emails you a notification via
Gmail SMTP (Nodemailer).

**To enable email notifications:** set up a Gmail App Password in `server/.env` — full steps in
`server/README.md`. Messages are still stored even without email configured, and you can view
them at `http://localhost:5000/api/submissions`.

Your details live in `src/data/content.js` — change `EMAIL`, `WHATSAPP_LINK`, `INSTAGRAM` there.

## Profile photo

Place `react-app/public/assets/profile.jpg` (4:5 portrait, ~800x1000px).
Until then the site shows an "AR" initials placeholder automatically.