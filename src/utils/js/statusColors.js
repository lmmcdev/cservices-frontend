// utils/statusColors.js

const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00b8a3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
  Total: { bg: 'transparent', text: '#0947D7' },
};

// Optional: helper to get bg or text color safely
export const getStatusColor = (status, type = 'text') =>
  statusColors[status]?.[type] || '#00a1ff'; // default fallback

export default statusColors;
