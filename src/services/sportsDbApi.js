import axios from 'axios';
import { SPORTSDB_API, NFL_LEAGUE_ID_SPORTSDB } from '../utils/constants';

/**
 * TheSportsDB fallback API client.
 *
 * Used as a secondary data source when ESPN endpoints are unavailable or
 * when additional data (images, alternate IDs, etc.) is needed.
 *
 * NFL league ID on TheSportsDB: 4391
 */

const LEAGUE_ID = NFL_LEAGUE_ID_SPORTSDB ?? 4391;

/**
 * Fetch all NFL teams.
 * @returns {Promise<object>} TheSportsDB teams response data
 */
export async function fetchTeams() {
  try {
    const response = await axios.get(
      `${SPORTSDB_API}/lookup_all_teams.php?id=${LEAGUE_ID}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `[SportsDB] Failed to fetch teams: ${error.response?.status ?? error.message}`,
    );
  }
}

/**
 * Fetch all players for a given team.
 * @param {string|number} teamId - TheSportsDB team ID
 * @returns {Promise<object>} TheSportsDB players response data
 */
export async function fetchTeamPlayers(teamId) {
  try {
    const response = await axios.get(
      `${SPORTSDB_API}/lookup_all_players.php?id=${teamId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `[SportsDB] Failed to fetch players for team ${teamId}: ${error.response?.status ?? error.message}`,
    );
  }
}

/**
 * Fetch the next upcoming NFL events / games.
 * @returns {Promise<object>} TheSportsDB next-events response data
 */
export async function fetchNextEvents() {
  try {
    const response = await axios.get(
      `${SPORTSDB_API}/eventsnextleague.php?id=${LEAGUE_ID}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `[SportsDB] Failed to fetch next events: ${error.response?.status ?? error.message}`,
    );
  }
}

/**
 * Fetch all events for a given NFL season.
 * @param {number|string} season - Season year (e.g. 2026)
 * @returns {Promise<object>} TheSportsDB season-events response data
 */
export async function fetchSeasonEvents(season) {
  try {
    const response = await axios.get(
      `${SPORTSDB_API}/eventsseason.php?id=${LEAGUE_ID}&s=${season}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `[SportsDB] Failed to fetch events for season ${season}: ${error.response?.status ?? error.message}`,
    );
  }
}

/**
 * Search for players by name.
 * @param {string} query - Player name to search for
 * @returns {Promise<object>} TheSportsDB search response data
 */
export async function searchPlayers(query) {
  try {
    const response = await axios.get(
      `${SPORTSDB_API}/searchplayers.php?p=${encodeURIComponent(query)}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `[SportsDB] Failed to search players for "${query}": ${error.response?.status ?? error.message}`,
    );
  }
}
