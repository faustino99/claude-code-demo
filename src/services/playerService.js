import * as espnApi from './espnApi';
import { getTradeStatus } from './tradeService';

/**
 * Player service – normalizes raw ESPN data into consistent, app-friendly
 * models so that UI components never need to worry about ESPN response shapes.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Safely extract a nested value from an object without throwing.
 * @param {object} obj   - Source object
 * @param {string} path  - Dot-separated path (e.g. "athlete.displayName")
 * @param {*} fallback   - Value returned when the path does not resolve
 * @returns {*}
 */
function get(obj, path, fallback = undefined) {
  if (!obj) return fallback;
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return fallback;
    current = current[key];
  }
  return current === undefined ? fallback : current;
}

/**
 * Normalize a single athlete object returned by the ESPN search endpoint into
 * a slim player summary.
 */
function normalizeSearchResult(athlete) {
  if (!athlete) return null;

  const team = athlete.team || {};

  return {
    id: athlete.id || athlete.uid,
    fullName: athlete.fullName || athlete.displayName || '',
    firstName: athlete.firstName || '',
    lastName: athlete.lastName || '',
    position: get(athlete, 'position.abbreviation', '') ||
              get(athlete, 'position.name', ''),
    jersey: athlete.jersey || '',
    teamId: team.id || '',
    teamName: team.displayName || team.name || '',
    teamAbbrev: team.abbreviation || '',
    headshot: get(athlete, 'headshot.href', '') ||
              get(athlete, 'headshot', ''),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Search for players by name.
 *
 * ESPN's search endpoint can return results under a variety of keys depending
 * on the response version. We try the most common locations and fall back to
 * an empty array.
 *
 * @param {string} query - Search query (player name)
 * @returns {Promise<Array<object>>} Normalized player summaries
 */
export async function searchPlayers(query) {
  try {
    const data = await espnApi.searchPlayers(query);

    // ESPN may place athletes in different locations depending on the version.
    const athletes =
      data.athletes ||
      data.items ||
      get(data, 'results.athletes', null) ||
      get(data, 'search.athletes', null) ||
      (Array.isArray(data) ? data : null) ||
      [];

    // The response may also be an object with a nested `items` array.
    const list = Array.isArray(athletes)
      ? athletes
      : athletes.items || [];

    return list.map(normalizeSearchResult).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Get a full player profile including bio, stats summary, and trade status.
 *
 * @param {string|number} playerId - ESPN athlete ID
 * @returns {Promise<object>} Normalized player profile
 */
export async function getPlayerProfile(playerId) {
  const data = await espnApi.fetchPlayerOverview(playerId);

  const athlete = data.athlete || {};
  const position = athlete.position || {};
  const team = athlete.team || {};
  const headshot = athlete.headshot || {};
  const draft = athlete.draft || {};

  // Trade status from local mock data.
  const tradeStatus = getTradeStatus(playerId);

  // Statistics – ESPN may provide them under `stats` or `statistics`.
  const stats = data.stats || data.statistics || [];

  return {
    id: athlete.id || playerId,
    fullName: athlete.fullName || athlete.displayName || '',
    firstName: athlete.firstName || '',
    lastName: athlete.lastName || '',
    position: position.abbreviation || position.name || '',
    positionName: position.displayName || position.name || '',
    jersey: athlete.jersey || '',

    // Team
    teamId: team.id || '',
    teamName: team.displayName || team.name || '',
    teamAbbrev: team.abbreviation || '',
    teamColor: team.color || '',
    teamLogo: get(team, 'logos[0].href', '') || get(team, 'logo', ''),

    // Bio / physical
    headshot: headshot.href || headshot.url || '',
    birthDate: athlete.dateOfBirth || athlete.birthDate || '',
    height: athlete.height || '',
    weight: athlete.weight || '',
    experience: athlete.experience?.years ?? athlete.experience ?? '',
    college: get(athlete, 'college.name', '') || athlete.college || '',

    // Draft info
    draft: {
      year: draft.year || '',
      round: draft.round || '',
      pick: draft.selection || draft.pick || '',
      team: get(draft, 'team.abbreviation', '') ||
            get(draft, 'team.name', ''),
    },

    // Trade status
    tradeStatus,

    // Raw stats (for overview cards)
    stats,
  };
}

/**
 * Get detailed player statistics normalised into a table-friendly format.
 *
 * ESPN returns stats as `splits.categories`, each category containing a
 * `displayName`, `labels` (column headers), and `stats` (rows with
 * `displayValue`).
 *
 * @param {string|number} playerId - ESPN athlete ID
 * @returns {Promise<object>} { categories: [{ name, headers, rows }] }
 */
export async function getPlayerStats(playerId) {
  const data = await espnApi.fetchPlayerStats(playerId);

  const categories = get(data, 'splits.categories', []);

  const normalized = categories.map((cat) => ({
    name: cat.displayName || cat.name || '',
    headers: cat.labels || [],
    rows: (cat.stats || []).map((row) => ({
      displayValue: row.displayValue || '',
      value: row.value ?? row.displayValue ?? '',
      ...row,
    })),
  }));

  return { categories: normalized };
}
