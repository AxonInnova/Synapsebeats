const inviteUrl =
  'https://discord.com/api/oauth2/authorize?client_id=1186998884111765534&permissions=8&scope=bot%20applications.commands';

export default function BotDocs() {
  return (
    <section>
      <h1>Synapse Beats Bot Docs</h1>
      <p>
        The bot sidekick handles music utility + project embeds. Use this page as the quick command and setup
        reference.
      </p>

      <div className="card">
        <h3>Invite</h3>
        <p>
          Add the bot to Discord:{' '}
          <a href={inviteUrl} target="_blank" rel="noreferrer">
            Invite Link
          </a>
        </p>
      </div>

      <div className="card">
        <h3>Features</h3>
        <ul>
          <li>High-fidelity playback with multi-source support</li>
          <li>Queue tools and quality-of-life commands</li>
          <li>Filter stack (bassboost, nightcore, 8d)</li>
          <li>Project embed sidekick for Synapse Beats links</li>
        </ul>
      </div>

      <div className="card">
        <h3>Commands</h3>
        <ul>
          <li>`s.play [song]` — play a song or playlist</li>
          <li>`s.queue` — check the queue</li>
          <li>`s.skip` — skip current track</li>
          <li>`s.nowplaying` — current track details</li>
          <li>`s.bassboost` / `s.nightcore` / `s.8d` — quick filters</li>
          <li>`/postproject url` — post project embed</li>
          <li>`/preview id` — fetch and post short project summary</li>
        </ul>
      </div>

      <div className="card">
        <h3>Quick Setup</h3>
        <ol>
          <li>Create app env vars (`DISCORD_TOKEN`, `SUPABASE_URL`, optional service key).</li>
          <li>Run `npm install` then `node bot/index.js`.</li>
          <li>Register slash commands and test `/preview` in a test server.</li>
        </ol>
      </div>
    </section>
  );
}
