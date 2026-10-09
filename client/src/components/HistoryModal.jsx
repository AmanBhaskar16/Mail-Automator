import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function HistoryModal({ onClose }) {
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.getHistory().then(setLogs).catch((e) => setError(e.message));
  }, []);

  const q = query.toLowerCase();
  const filtered = (logs || []).filter((l) =>
    [l.companyName, l.hrName, l.email, l.templateName].some((v) => v?.toLowerCase().includes(q))
  );

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Sent History</h2>
          <button className="close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <input
          className="search"
          placeholder="Search company, HR, email or template…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {error && <div className="alert error">{error}</div>}
        {!logs && !error && <p className="muted">Loading…</p>}
        {logs && filtered.length === 0 && <p className="muted">No mails yet.</p>}
        {filtered.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Company</th>
                  <th>HR</th>
                  <th>Email</th>
                  <th>Template</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l._id}>
                    <td>{new Date(l.createdAt).toLocaleString()}</td>
                    <td>{l.companyName}</td>
                    <td>{l.hrName}</td>
                    <td>{l.email}</td>
                    <td>{l.templateName}</td>
                    <td>
                      <span className={`badge ${l.status}`} title={l.error || ''}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
