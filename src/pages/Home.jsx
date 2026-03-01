import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Home() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleDiscordLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: window.location.origin }
    });

    if (error) {
      setMessage(error.message);
    }
  };

  const handleEmailLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage('Magic link sent. Check your inbox.');
  };

  return (
    <section>
      <h1>Build and ship beats together</h1>
      <p>
        Synapse Beats is a collaborative beat projects platform with a lightweight browser studio,
        shareable project pages, and a Discord sidekick bot.
      </p>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Auth</h3>
        <p>Sign in with Discord or email to save projects.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleDiscordLogin}>Continue with Discord</button>
          <input
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(event) => setEmail(event.target.value)}
          />
          <button onClick={handleEmailLogin}>Email magic link</button>
        </div>
        {message ? <p>{message}</p> : null}
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
        <Link to="/studio" className="btn-link">
          Open Studio
        </Link>
        <Link to="/bot" className="btn-link btn-outline">
          Bot Docs
        </Link>
      </div>
    </section>
  );
}
