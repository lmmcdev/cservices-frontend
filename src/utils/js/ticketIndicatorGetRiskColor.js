export const getRiskColor = (risk) => {
  switch ((risk || '').toLowerCase()) {
    case 'none': return '#4caf50';
    case 'legal': return '#ff9800';
    case 'disenrollment': return '#f44336';
    default: return '#bdbdbd';
  }
};
