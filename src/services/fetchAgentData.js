// src/services/fetchAgentsFromAAD.js

/**
 * Descarga miembros (solo usuarios) desde uno o varios grupos de AAD usando Microsoft Graph.
 * Devuelve agentes deduplicados con la forma:
 * {
 *   id, name, email, agent_name, agent_email, source: 'aad',
 *   group_id, group_display_name, group_name, agent_department, is_disabled
 * }
 *
 * Requisitos:
 *  - token de Graph con permisos (delegados) al menos: Group.Read.All
 */

/** Normaliza el nombre del grupo a “nombre de departamento” */
function normalizeDeptName(name = "") {
  const n = String(name);
  // quita roles/sufijos comunes
  return n
    .replace(/\b(agents?|supervisors?|group|security group)\b/gi, "")
    .replace(/[-_/()]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Carga displayName de un grupo (se usa 1 vez por grupo) */
async function fetchGroupMeta(graphToken, groupId) {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/groups/${groupId}?$select=id,displayName`,
    { headers: { Authorization: `Bearer ${graphToken}` } }
  );
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Graph ${res.status} (group meta): ${txt || res.statusText}`);
  }
  return res.json(); // { id, displayName }
}

/** Lista miembros de tipo user de un grupo (paginado) */
async function fetchGroupUsers(graphToken, groupId, groupLabel, groupDisplayName) {
  if (!graphToken) throw new Error("No Graph token provided");
  if (!groupId) throw new Error("No groupId provided");

  const results = [];
  let url =
    `https://graph.microsoft.com/v1.0/groups/${groupId}/members/microsoft.graph.user` +
    `?$select=id,displayName,mail,userPrincipalName,department,accountEnabled,city,businessPhone,officeLocation`;

  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${graphToken}` } });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Graph ${res.status}: ${txt || res.statusText}`);
    }

    const json = await res.json();

    // ⬇️ Excluir explícitamente a los que vienen con accountEnabled === false
    const batch = (json.value || [])
      .filter(u => u.accountEnabled !== false)
      .map(u => {
        const name  = u.displayName || "";
        const email = u.mail || u.userPrincipalName || "";
        return {
          id: u.id,
          name,
          email,
          agent_name: name,
          agent_email: email,
          source: "aad",
          group_id: groupId,
          group_display_name: groupDisplayName || "",
          group_name: groupLabel || "",
          agent_department: u.department || "",
          accountEnabled: u.accountEnabled, // puede ser true o undefined si Graph no lo devuelve
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
 * @param {{ groupIds: string[], groupNames?: Record<string,string> }} options
 *        - groupIds: lista de grupos a consultar
 *        - groupNames: mapa opcional { groupId: "Customer Service" } para forzar el nombre de departamento
 * @returns {Promise<Array>}
 */
export async function fetchAgentsFromAAD(
  graphToken,
  { groupIds = [], groupNames = {} } = {}
) {
  if (!Array.isArray(groupIds) || groupIds.length === 0) {
    throw new Error("fetchAgentsFromAAD: 'groupIds' must be a non-empty array");
  }

  // 1) Traer metadata de grupos (displayName) una sola vez
  const metaList = await Promise.all(
    groupIds.map(async (gid) => {
      try {
        const meta = await fetchGroupMeta(graphToken, gid);
        // label (dept) preferente: override -> normalizado(displayName)
        const deptLabel = groupNames[gid] || normalizeDeptName(meta.displayName || "");
        return { id: gid, displayName: meta.displayName || "", deptLabel };
      } catch (e) {
        // Si falla meta, seguimos usando overrides o el propio gid como fallback
        const fallback = groupNames[gid] || gid;
        return { id: gid, displayName: "", deptLabel: fallback };
      }
    })
  );

  const groupMetaMap = new Map(metaList.map(m => [m.id, m]));

  // 2) Para cada grupo, obtener sus usuarios con su etiqueta dept
  const lists = await Promise.all(
    groupIds.map(async (gid) => {
      const meta = groupMetaMap.get(gid);
      return fetchGroupUsers(
        graphToken,
        gid,
        meta?.deptLabel || groupNames[gid] || gid,
        meta?.displayName || ""
      );
    })
  );

  // 3) Deduplicar por id (si un usuario está en varios grupos nos quedamos con el primero en el orden dado)
  const byId = new Map();
  for (const list of lists) {
    for (const u of list) {
      if (!byId.has(u.id)) byId.set(u.id, u);
    }
  }

  return Array.from(byId.values());
}
