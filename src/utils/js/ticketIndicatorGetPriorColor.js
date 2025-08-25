// --- helpers de estilo
export const getPriorityColor = (priority) => {
  switch ((priority || '').toLowerCase()) {
    case 'high': return '#d32f2f';
    case 'medium': return '#fbc02d';
    case 'low': return '#388e3c';
    default: return '#bdbdbd';
  }
};
