const inviteUrl =
  'https://discord.com/api/oauth2/authorize?client_id=1186998884111765534&permissions=8&scope=bot%20applications.commands';

const features = [
  {
    title: 'Dynamic Imaging',
    description: 'Real-time now-playing cards with clean visual styling.'
  },
  {
    title: 'High Fidelity',
    description: 'Crisp playback and reliable queue behavior for servers.'
  },
  {
    title: 'Multi-Source',
    description: 'Supports Spotify, SoundCloud, YouTube, and Deezer flows.'
  },
  {
    title: 'Smart Playlists',
    description: 'Save and reuse server playlist setups with less hassle.'
  }
];

const commands = [
  's.play [song] — plays a song or playlist',
  's.queue — view upcoming tracks',
  's.skip — skip to next track',
  's.nowplaying — show current track details',
  's.bassboost — boost low frequencies',
  's.nightcore — speed + pitch up effect',
  's.8d — spatial 8D effect',
  's.prefix — update bot prefix',
  's.setup — create request channel'
];

export default function Bot() {
  return (
    <section>
      <h1>Synapse Beats Discord Bot</h1>
      <p>
        Keep your community sessions smooth with powerful music commands, quick controls, and modern audio
        features.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
        <a href={inviteUrl} className="btn-link" target="_blank" rel="noreferrer">
          Add to Discord
        </a>
      </div>

      <div className="card">
        <h3>Features</h3>
        <ul>
          {features.map((feature) => (
            <li key={feature.title}>
              <strong>{feature.title}:</strong> {feature.description}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Commands</h3>
        <ul>
          {commands.map((command) => (
            <li key={command}>{command}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
