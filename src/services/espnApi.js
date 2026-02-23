import axios from 'axios';
import { ESPN_SITE_API, ESPN_WEB_API } from '../utils/constants';

/**
 * ESPN API client.
 *
 * Site API  -> proxied through /espn-api  -> https://site.api.espn.com
 * Web API   -> proxied through /espn-web-api -> https://site.web.api.espn.com
 */

/**
 * Fetch the list of all NFL teams.
 * @returns {Promise<object>} ESPN teams response data
 */
export async function fetchTeams() {
  try {
    const response = await axios.get(`${ESPN_SITE_API}/teams`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch NFL teams: ${error.response?.status ?? error.message}`,
    );
  }
}

/**
 * Fetch the roster for a specific team.
 * @param {string|number} teamId - ESPN team ID
 * @returns {Promise<object>} ESPN roster response data
 */
export async function fetchTeamRoster(teamId) {
  try {
    const response = await axios.get(`${ESPN_SITE_API}/teams/${teamId}/roster`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch roster for team ${teamId}: ${error.response?.status ?? error.message}`,
    );
  }
}

/**
 * Fetch the schedule for a specific team and season.
 * @param {string|number} teamId - ESPN team ID
 * @param {number} season - Season year
 * @returns {Promise<object>} ESPN schedule response data
 */
export async function fetchTeamSchedule(teamId, season) {
  try {
    const response = await axios.get(
      `${ESPN_SITE_API}/teams/${teamId}/schedule?season=${season}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch schedule for team ${teamId} (${season}): ${error.response?.status ?? error.message}`,
    );
  }
}

/**
 * Search for players by name / query string.
 *
 * ESPN may return results in different structures depending on the query and
 * endpoint version, so callers should handle various shapes.
 *
 * @param {string} query - Search query (player name, etc.)
 * @returns {Promise<object>} ESPN search response data
 */
export async function searchPlayers(query) {
  try {
    const response = await axios.get(
      `${ESPN_SITE_API}/athletes?search=${encodeURIComponent(query)}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to search players for "${query}": ${error.response?.status ?? error.message}`,
    );
  }
}

/**
 * Fetch a full player overview (profile + stats + news) from the web API.
 * @param {string|number} playerId - ESPN athlete ID
 * @returns {Promise<object>} ESPN player overview response data
 */
export async function fetchPlayerOverview(playerId) {
  try {
    const response = await axios.get(
      `${ESPN_WEB_API}/athletes/${playerId}/overview`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch overview for player ${playerId}: ${error.response?.status ?? error.message}`,
    );
  }
}

/**
 * Fetch detailed player statistics from the web API.
 * @param {string|number} playerId - ESPN athlete ID
 * @returns {Promise<object>} ESPN player stats response data
 */
export async function fetchPlayerStats(playerId) {
  try {
    const response = await axios.get(
      `${ESPN_WEB_API}/athletes/${playerId}/stats`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch stats for player ${playerId}: ${error.response?.status ?? error.message}`,
    );
  }
}

/**
 * Fetch the current NFL scoreboard (live / upcoming games).
 * @returns {Promise<object>} ESPN scoreboard response data
 */
export async function fetchScoreboard() {
  try {
    const response = await axios.get(`${ESPN_SITE_API}/scoreboard`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch scoreboard: ${error.response?.status ?? error.message}`,
    );
  }
}

/**
 * Fetch latest NFL news headlines.
 * @returns {Promise<object>} ESPN news response data
 */
export async function fetchNews() {
  try {
    const response = await axios.get(`${ESPN_SITE_API}/news`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch news: ${error.response?.status ?? error.message}`,
    );
  }
}
