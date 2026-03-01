import { useEffect, useMemo, useRef, useState } from 'react';
import * as Tone from 'tone';

const STEPS = 8;
const SAMPLE_MAP = {
  kick: 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3',
  snare: 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3',
  hat: 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3'
};

export default function Sequencer({ onChange }) {
  const [pattern, setPattern] = useState(Array(STEPS).fill(false));
  const [bpm, setBpm] = useState(110);
  const [sampleKey, setSampleKey] = useState('kick');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const sequenceRef = useRef(null);

  const player = useMemo(
    () =>
      new Tone.Player({
        url: SAMPLE_MAP[sampleKey],
        autostart: false
      }).toDestination(),
    [sampleKey]
  );

  useEffect(() => {
    // ok lol keep parent synced so save is easy
    onChange?.({ pattern, bpm, sampleRefs: [sampleKey] });
  }, [pattern, bpm, sampleKey, onChange]);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    return () => {
      // ▫️ cleanup so hot reload doesn't stack weird audio loops
      if (sequenceRef.current) sequenceRef.current.dispose();
      player.dispose();
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, [player]);

  const toggleStep = (index) => {
    setPattern((prev) => prev.map((step, stepIndex) => (stepIndex === index ? !step : step)));
  };

  const start = async () => {
    await Tone.start();
    if (sequenceRef.current) {
      sequenceRef.current.dispose();
    }

    sequenceRef.current = new Tone.Sequence(
      (time, step) => {
        setActiveStep(step);
        if (pattern[step]) {
          player.start(time);
        }
      },
      Array.from({ length: STEPS }, (_, index) => index),
      '8n'
    );

    sequenceRef.current.start(0);
    Tone.Transport.start();
    setIsPlaying(true);
  };

  const stop = () => {
    Tone.Transport.stop();
    if (sequenceRef.current) {
      sequenceRef.current.dispose();
      sequenceRef.current = null;
    }
    setActiveStep(-1);
    setIsPlaying(false);
  };

  return (
    <section>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <label>
          Sample
          <select
            style={{ marginLeft: 8 }}
            value={sampleKey}
            onChange={(event) => setSampleKey(event.target.value)}
          >
            {Object.keys(SAMPLE_MAP).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>

        <label>
          BPM
          <input
            style={{ marginLeft: 8, width: 72 }}
            type="number"
            min="70"
            max="180"
            value={bpm}
            onChange={(event) => setBpm(Number(event.target.value))}
          />
        </label>

        {!isPlaying ? (
          <button onClick={start}>Play</button>
        ) : (
          <button onClick={stop}>Stop</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
        {pattern.map((step, index) => (
          <button
            key={index}
            onClick={() => toggleStep(index)}
            style={{
              padding: '12px 0',
              border: '1px solid #334155',
              borderRadius: 8,
              background: step ? '#334155' : '#0f172a',
              color: '#fff',
              opacity: activeStep === index ? 1 : 0.8
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
