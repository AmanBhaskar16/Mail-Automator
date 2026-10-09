async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  getConfig: () => request('/api/config'),
  getTemplates: () => request('/api/templates'),
  createTemplate: (t) => request('/api/templates', { method: 'POST', body: JSON.stringify(t) }),
  updateTemplate: (id, t) => request(`/api/templates/${id}`, { method: 'PUT', body: JSON.stringify(t) }),
  deleteTemplate: (id) => request(`/api/templates/${id}`, { method: 'DELETE' }),
  sendMail: (payload) => request('/api/send', { method: 'POST', body: JSON.stringify(payload) }),
  getHistory: () => request('/api/history'),
};

// Same placeholder logic as the server, used for the live preview.
export const fill = (text, vars) =>
  text.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, key) => (vars[key] ? vars[key] : m));
