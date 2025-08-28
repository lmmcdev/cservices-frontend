//utility function to find a group and role name by its ID from a constants object.
/**
 * Finds the group and role names by their ID.
 * @param {string} id - The ID to search for.
 * @returns {{ group: string, role: string } | null} - The group and role names or null if not found.
 */
import { GROUP_IDS } from '../../utils/js/constants.js';

export function findGroupKeyById(id) {
  for (const [group, roles] of Object.entries(GROUP_IDS)) {
    for (const [role, value] of Object.entries(roles)) {
      if (value === id) return { group, role }; // p.ej. { group: 'CUSTOMER_SERVICE', role: 'AGENTS' }
    }
  }
  return null; // no encontrado
}
