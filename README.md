# Synapse Beats

Synapse Beats is a collaborative beat projects platform: browser studio + public project pages + Supabase auth + Discord sidekick bot.

## Quick start

1) Install deps

```bash
npm install
```

2) Create env file

```bash
cp .env.example .env
```

3) Set frontend env vars (local + Vercel)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE` (optional, default local URL)

4) Run frontend

```bash
npm run dev
```

## Supabase SQL reminder

Run the schema from [infra/create_tables.sql](infra/create_tables.sql) in your Supabase SQL editor.

This creates:
- `projects`
- `samples`
- RLS policies for public project reads + owner writes

## Auth + backend env vars

Frontend-safe:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE` (optional)

Server/bot only:
- `DISCORD_TOKEN`
- `SUPABASE_SERVICE_KEY`
- `BOT_WEBHOOK_SECRET` (optional)

Important:
- Never expose `SUPABASE_SERVICE_KEY` in frontend code or browser env.

## Deploy to Vercel

1) Push repo to GitHub.
2) Import project in Vercel.
3) Set env vars:
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_ANON_KEY`
	- `VITE_API_BASE` (set to your deployed domain)
	- optional serverless vars: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `BOT_WEBHOOK_SECRET`
4) Deploy.
5) Test:
	- `/studio`
	- `/projects/:id`
	- `/bot`
	- `/api/projects/:id`

## Run bot locally

The sidekick bot lives in [bot/index.js](bot/index.js).

```bash
DISCORD_TOKEN=your_token \
DISCORD_CLIENT_ID=your_client_id \
DISCORD_GUILD_ID=your_dev_guild_id \
SUPABASE_URL=https://nfirgzmfuuvyirduunjy.supabase.co \
SUPABASE_SERVICE_KEY=your_service_key \
node bot/index.js
```

Slash commands:
- `/postproject url`
- `/preview id`

If `SUPABASE_SERVICE_KEY` is missing, bot falls back to your public API route (`/api/projects/:id`).

Recommended free hosts for bot:
- Replit
- Railway

## Flavortown checklist (screenshots)

- Sequencer in `/studio` with pattern toggled
- New row in `projects` table in Supabase
- Bot embed from `/postproject`
- Deployed site working on Vercel
- Bonus cookie: include one screenshot with the copied project link pop state

## Repo credits (not shown on website)

- Organization: AxonInnova
- Founder: Atharv Singh Negi
- Community Discord: https://dsc.gg/axoninnova

## Suggested commit plan

Use these messages in order:

1. `chore: bootstrap vite react app and project structure`
2. `feat(auth): add supabase client and auth wrappers`
3. `feat(studio): add Sequencer component and save/load to Supabase`
4. `feat(bot): add discord.js bot with /postproject and /preview`
5. `docs: update README and deploy instructions`

## PR-ready description (short)

"Refactors static landing into Synapse Beats product MVP (studio, public projects, auth, bot sidekick). Ships free-tier friendly stack and Flavortown-ready verification flow 🍪."

## Manual test steps

1) `npm install`
2) `npm run dev`
3) Open `http://localhost:5173` and test Discord + Email login
4) Create project in `/studio`, save, verify row in Supabase `projects`
5) Open `/projects/:id` for a public project
6) Run bot with `DISCORD_TOKEN` and test `/postproject <url>`
7) Verify embed posts and link works
