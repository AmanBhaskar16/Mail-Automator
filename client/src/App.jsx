import { useEffect, useState } from 'react';
import { api } from './api.js';
import SendForm from './components/SendForm.jsx';
import HistoryModal from './components/HistoryModal.jsx';
import TemplateManager from './components/TemplateManager.jsx';

export default function App() {
  const [config, setConfig] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [view, setView] = useState('send');
  const [showHistory, setShowHistory] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadTemplates = () =>
    api.getTemplates().then(setTemplates).catch((e) => setLoadError(e.message));

  useEffect(() => {
    api.getConfig().then(setConfig).catch((e) => setLoadError(e.message));
    loadTemplates();
  }, []);

  return (
    <div className="page">
      <header className="hero">
        <div className="logo">✉️</div>
        <h1>Cold Mail Sender</h1>
        <p className="muted">
          {config?.senderEmail ? `Sending from ${config.senderEmail}` : 'Send job applications to HRs in one click'}
        </p>
        <div className="divider" />
      </header>

      {loadError && (
        <div className="alert error">
          Could not reach the server: {loadError}. Is the backend running on port 5001?
        </div>
      )}

      <div className="tabs">
        <button className={view === 'send' ? 'tab active' : 'tab'} onClick={() => setView('send')}>
          Send Mail
        </button>
        <button className={view === 'templates' ? 'tab active' : 'tab'} onClick={() => setView('templates')}>
          Manage Templates
        </button>
      </div>

      {view === 'send' ? (
        <SendForm templates={templates} config={config} onOpenHistory={() => setShowHistory(true)} />
      ) : (
        <TemplateManager templates={templates} onChange={loadTemplates} />
      )}

      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
    </div>
  );
}
