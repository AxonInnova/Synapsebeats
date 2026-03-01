import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Studio from './pages/Studio';
import ProjectPage from './pages/ProjectPage';
import BotDocs from './pages/BotDocs';

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
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/bot" element={<BotDocs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
