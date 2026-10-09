const API_BASE_URL = (import.meta.env.BACKEND_URI || '').replace(/\/+$/, '');

async function request(url, options = {}) {
  if (import.meta.env.PROD && !API_BASE_URL) {
    throw new Error('VITE_API_URL is not set for this deployment.');
  }

  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      `API returned a non-JSON response (${res.status}). Check that VITE_API_URL points to the deployed backend.`
    );
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  getConfig: () => request('/api/config'),
  getTemplates: async () => {
    const templates = await request('/api/templates');
    if (!Array.isArray(templates)) {
      throw new Error('Backend returned an invalid templates response.');
    }
    return templates;
  },
  createTemplate: (t) => request('/api/templates', { method: 'POST', body: JSON.stringify(t) }),
  updateTemplate: (id, t) => request(`/api/templates/${id}`, { method: 'PUT', body: JSON.stringify(t) }),
  deleteTemplate: (id) => request(`/api/templates/${id}`, { method: 'DELETE' }),
  sendMail: (payload) => request('/api/send', { method: 'POST', body: JSON.stringify(payload) }),
  getHistory: () => request('/api/history'),
};

// Same placeholder logic as the server, used for the live preview.
export const fill = (text, vars) =>
  text.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, key) => (vars[key] ? vars[key] : m));
