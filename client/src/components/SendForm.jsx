import { useEffect, useState } from 'react';
import { api, fill } from '../api.js';

const empty = { hrName: '', companyName: '', email: '' };

export default function SendForm({ templates, config, onOpenHistory }) {
  const [form, setForm] = useState(empty);
  const [templateId, setTemplateId] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!templateId && templates.length) setTemplateId(templates[0]._id);
  }, [templates, templateId]);

  const template = templates.find((t) => t._id === templateId);
  const vars = { ...form, senderName: config?.senderName };

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const res = await api.sendMail({ ...form, templateId });
      setStatus({ type: 'success', text: res.message });
      setForm(empty);
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <div className="card-head">
        <h2>Job Application Mail</h2>
        <p>Fill HR details, pick a template, and send from your Gmail</p>
      </div>

      <div className="card-body">
        <h3 className="section">Recipient Information</h3>
        <div className="grid">
          <label>
            HR Name <span className="req">*</span>
            <input name="hrName" value={form.hrName} onChange={update} placeholder="Priya Sharma" required />
          </label>
          <label>
            Company Name <span className="req">*</span>
            <input name="companyName" value={form.companyName} onChange={update} placeholder="Acme Corporation" required />
          </label>
        </div>
        <label>
          HR Email Address <span className="req">*</span>
          <input type="email" name="email" value={form.email} onChange={update} placeholder="hr@company.com" required />
        </label>

        <h3 className="section">Email Template</h3>
        <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} required>
          {templates.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        {template && (
          <div className="preview">
            <div className="preview-row">
              <span className="muted">Subject:</span> <strong>{fill(template.subject, vars)}</strong>
            </div>
            <pre>{fill(template.body, vars)}</pre>
            {config?.resumeAttached && <div className="attach">📎 Resume will be attached</div>}
          </div>
        )}

        {status && <div className={`alert ${status.type}`}>{status.text}</div>}

        <div className="actions">
          <button type="button" className="btn ghost" onClick={() => { setForm(empty); setStatus(null); }}>
            Reset Form
          </button>
          <button type="button" className="btn outline" onClick={onOpenHistory}>
            Open History
          </button>
          <button type="submit" className="btn primary" disabled={sending || !templateId}>
            {sending ? 'Sending…' : '✉ Send Mail'}
          </button>
        </div>
        <p className="note">Email delivery may take a few moments. Kindly wait for confirmation.</p>
      </div>
    </form>
  );
}
