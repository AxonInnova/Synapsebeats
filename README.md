# Synapse Beats

Synapse Beats is a Vite + React project website with Supabase auth and a dedicated `/bot` route that shows the Discord bot promo page.

Live site: https://synapsebeats.is-a.software

## Stack

- Vite + React
- React Router
- Supabase Auth

## Auth model

Auth is powered by Supabase and supports:

- Email login (`signInWithOtp`)
- Discord login via Supabase OAuth (`signInWithOAuth`)

Discord OAuth is used only for website login.

## Routes

- `/` → Home (login UI)
- `/studio` → Main project page
- `/bot` → Static Discord bot promo page (migrated from old HTML)

## Environment variables

Create `.env` from `.env.example` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

No backend bot server is required.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Credits (README only)

- Organization: AxonInnova
- Founder: Atharv Singh Negi

Founder and org credits stay in repository metadata/docs only and are not shown in website UI.
