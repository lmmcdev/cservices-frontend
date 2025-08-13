// src/services/fetchAgentsFromAAD.js

/**
 * Descarga miembros (solo usuarios) desde uno o varios grupos de AAD usando Microsoft Graph.
 * Devuelve agentes deduplicados con la forma:
 * { id, name, email, agent_name, agent_email, source: 'aad' }
 *
 * Requisitos:
 *  - token de Graph con permisos (delegados) como mínimo: Group.Read.All
 */

async function fetchGroupUsers(graphToken, groupId) {
  if (!graphToken) throw new Error("No Graph token provided");
  if (!groupId) throw new Error("No groupId provided");

  const results = [];
  let url = `https://graph.microsoft.com/v1.0/groups/${groupId}/members/microsoft.graph.user?$select=id,displayName,mail,userPrincipalName`;

  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${graphToken}` },
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Graph ${res.status}: ${txt || res.statusText}`);
    }
    const json = await res.json();

    const batch = (json.value || []).map(u => {
      const name = u.displayName || "";
      const email = u.mail || u.userPrincipalName || "";
      return {
        id: u.id,
        name,
        email,
        // Campos "compat" con tu estado previo
        agent_name: name,
        agent_email: email,
        source: "aad",
        group: groupId
      };
    });

    results.push(...batch);
    url = json["@odata.nextLink"] || null;
  }

  return results;
}

/**
 * Combina miembros de varios grupos (deduplicados por id).
 * @param {string} graphToken
 * @param {{ groupIds: string[] }} options
 * @returns {Promise<Array<{id,name,email,agent_name,agent_email,source}>>}
 */
export async function fetchAgentsFromAAD(graphToken, { groupIds = [] } = {}) {
  if (!Array.isArray(groupIds) || groupIds.length === 0) {
    throw new Error("fetchAgentsFromAAD: 'groupIds' must be a non-empty array");
  }

  const lists = await Promise.all(groupIds.map(gid => fetchGroupUsers(graphToken, gid)));

  const byId = new Map();
  for (const list of lists) {
    for (const m of list) byId.set(m.id, m);
  }

  return Array.from(byId.values());
}
