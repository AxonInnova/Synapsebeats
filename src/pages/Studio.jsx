import { useState } from 'react';
import Sequencer from '../components/Sequencer';
import { supabase } from '../lib/supabaseClient';
import { getUser } from '../lib/auth';

export default function Studio() {
  const [projectState, setProjectState] = useState({
    title: '',
    description: '',
    isPublic: true,
    pattern: Array(8).fill(false),
    bpm: 110,
    sampleRefs: ['kick']
  });
  const [status, setStatus] = useState('');
  const [savedId, setSavedId] = useState('');

  const saveProject = async () => {
    setStatus('Saving...');

    const {
      data: { user },
      error: userError
    } = await getUser();

    if (userError || !user) {
      setStatus('Please sign in first.');
      return;
    }

    const payload = {
      owner_id: user.id,
      title: projectState.title || 'Untitled beat',
      description: projectState.description || '',
      data: {
        pattern: projectState.pattern,
        bpm: projectState.bpm,
        sampleRefs: projectState.sampleRefs
      },
      is_public: projectState.isPublic
    };

    const { data, error } = await supabase.from('projects').insert(payload).select('id').single();

    if (error) {
      setStatus(error.message);
      return;
    }

    setSavedId(data.id);
    setStatus('Saved 🎉');
  };

  const copyLink = async () => {
    if (!savedId) return;
    const link = `${window.location.origin}/projects/${savedId}`;
    await navigator.clipboard.writeText(link);
    setStatus('Link copied.');
  };

  const pingPreview = async () => {
    if (!savedId) {
      setStatus('Save first, then preview.');
      return;
    }

    // lol this pings server endpoint so bot can post embed in staging
    const response = await fetch('/api/bot/postproject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: savedId })
    });

    if (!response.ok) {
      setStatus('Preview request failed.');
      return;
    }

    setStatus('Preview requested for bot.');
  };

  return (
    <section>
      <h1>Studio</h1>
      <p>Create a quick groove, save it, and share the project link.</p>

      <div className="card" style={{ marginBottom: 16 }}>
        <label>
          Title
          <input
            value={projectState.title}
            onChange={(event) => setProjectState((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Late-night bounce"
          />
        </label>

        <label>
          Description
          <textarea
            value={projectState.description}
            onChange={(event) =>
              setProjectState((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Short idea note"
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={projectState.isPublic}
            onChange={(event) =>
              setProjectState((prev) => ({ ...prev, isPublic: event.target.checked }))
            }
          />
          Public project
        </label>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <Sequencer
          onChange={({ pattern, bpm, sampleRefs }) =>
            setProjectState((prev) => ({ ...prev, pattern, bpm, sampleRefs }))
          }
        />
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={saveProject}>Save Project</button>
        <button onClick={copyLink} disabled={!savedId}>
          Copy Link
        </button>
        <button onClick={pingPreview} disabled={!savedId}>
          Preview
        </button>
      </div>

      {savedId ? <p>Project id: {savedId}</p> : null}
      {status ? <p>{status}</p> : null}
      <p style={{ opacity: 0.8 }}>
        Keep uploaded samples tiny (3-5MB max) so free-tier storage stays chill.
      </p>
    </section>
  );
}
