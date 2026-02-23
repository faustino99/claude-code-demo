import tradeRumors from '../data/tradeRumors';

/**
 * Trade-rumor service backed by local mock data.
 *
 * Provides helpers to query the trade-rumor dataset by player, team, or
 * status.  All functions are synchronous since they operate on in-memory data.
 */

/**
 * Return every trade rumor in the dataset.
 * @returns {Array<object>} Full list of trade rumors
 */
export function getTradeRumors() {
  return tradeRumors;
}

/**
 * Look up the trade status for a specific player.
 * @param {string|number} playerId - ESPN athlete ID
 * @returns {string} Trade status string (e.g. "rumored", "confirmed") or
 *                   "none" when no rumor exists for the player.
 */
export function getTradeStatus(playerId) {
  const id = String(playerId);
  const rumor = tradeRumors.find((r) => String(r.playerId) === id);
  return rumor ? rumor.status : 'none';
}

/**
 * Return all trade rumors involving a given team.
 * @param {string} teamAbbrev - Team abbreviation (e.g. "KC", "SF")
 * @returns {Array<object>} Matching trade rumors
 */
export function getTradeRumorsByTeam(teamAbbrev) {
  const abbrev = (teamAbbrev || '').toUpperCase();
  return tradeRumors.filter(
    (r) => (r.currentTeamAbbrev || '').toUpperCase() === abbrev,
  );
}

/**
 * Return all trade rumors with a specific status.
 * @param {string} status - Status to filter by (e.g. "rumored", "confirmed",
 *                          "denied")
 * @returns {Array<object>} Matching trade rumors
 */
export function getTradeRumorsByStatus(status) {
  const target = (status || '').toLowerCase();
  return tradeRumors.filter(
    (r) => (r.status || '').toLowerCase() === target,
  );
}

/**
 * Return the full trade-rumor object for a specific player, or null if no
 * rumor exists.
 * @param {string|number} playerId - ESPN athlete ID
 * @returns {object|null} Trade rumor object or null
 */
export function getTradeRumorForPlayer(playerId) {
  const id = String(playerId);
  return tradeRumors.find((r) => String(r.playerId) === id) || null;
}
