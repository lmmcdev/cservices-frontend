import { GROUP_IDS } from '../../utils/js/constants.js';

export function findGroupKeyById(id) {
  for (const [group, roles] of Object.entries(GROUP_IDS)) {
    for (const [role, value] of Object.entries(roles)) {
      if (value === id) return { group, role }; // p.ej. { group: 'CUSTOMER_SERVICE', role: 'AGENTS' }
    }
  }
  return null; // no encontrado
}
