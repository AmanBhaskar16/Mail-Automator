// Replaces {{hrName}}, {{companyName}}, {{senderName}} etc. in a template string.
export function fill(text, vars) {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) =>
    vars[key] !== undefined ? vars[key] : match
  );
}

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Plain-text body -> simple HTML that keeps line breaks.
export function toHtml(text) {
  return `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#222">${escapeHtml(
    text
  ).replace(/\n/g, '<br>')}</div>`;
}
