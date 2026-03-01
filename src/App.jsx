import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Studio from './pages/Studio';
import Bot from './pages/Bot';

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          Synapse Beats
        </Link>
        <nav className="topnav">
          <Link to="/studio">Studio</Link>
          <Link to="/bot">Bot Docs</Link>
        </nav>
      </header>

      <main className="main-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/bot" element={<Bot />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
