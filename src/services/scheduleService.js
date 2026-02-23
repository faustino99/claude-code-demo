import * as espnApi from './espnApi';
import { CURRENT_SEASON } from '../utils/constants';

/**
 * Schedule service – normalizes ESPN schedule and scoreboard data into a flat,
 * consistent event model for the UI.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalize a single ESPN event (competition) into a flat game object.
 *
 * ESPN events have a `competitions` array; we always look at the first entry.
 * Each competition has a `competitors` array with exactly two items marked
 * with `homeAway` of "home" or "away".
 *
 * @param {object} event - Raw ESPN event object
 * @returns {object} Normalized game object
 */
function normalizeEvent(event) {
  if (!event) return null;

  const competition = (event.competitions || [])[0] || {};
  const competitors = competition.competitors || [];

  const home = competitors.find((c) => c.homeAway === 'home') || {};
  const away = competitors.find((c) => c.homeAway === 'away') || {};

  const homeTeam = home.team || {};
  const awayTeam = away.team || {};
  const homeLogos = homeTeam.logos || homeTeam.logo;
  const awayLogos = awayTeam.logos || awayTeam.logo;

  const status = competition.status || event.status || {};
  const venue = competition.venue || {};
  const broadcasts = competition.broadcasts || competition.broadcast || [];
  const broadcastName = Array.isArray(broadcasts)
    ? (broadcasts[0]?.names?.[0] ||
       broadcasts[0]?.name ||
       broadcasts[0]?.market || '')
    : '';

  // Week info – may be on the event directly or inside the competition.
  const week = event.week?.number || event.week || '';

  return {
    id: event.id || '',
    week,
    date: event.date || competition.date || '',
    time: event.date || competition.date || '',
    homeTeamId: homeTeam.id || home.id || '',
    homeTeamName: homeTeam.displayName || homeTeam.name || '',
    homeTeamAbbrev: homeTeam.abbreviation || '',
    homeTeamLogo:
      (Array.isArray(homeLogos) ? homeLogos[0]?.href : homeLogos) || '',
    awayTeamId: awayTeam.id || away.id || '',
    awayTeamName: awayTeam.displayName || awayTeam.name || '',
    awayTeamAbbrev: awayTeam.abbreviation || '',
    awayTeamLogo:
      (Array.isArray(awayLogos) ? awayLogos[0]?.href : awayLogos) || '',
    homeScore: home.score ?? '',
    awayScore: away.score ?? '',
    status: status.type?.description || status.type?.name || status.displayClock || '',
    venue: venue.fullName || venue.name || '',
    broadcast: broadcastName,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch and normalize a team's schedule for a given season.
 *
 * @param {string|number} teamId - ESPN team ID
 * @param {number} [season=CURRENT_SEASON] - Season year
 * @returns {Promise<Array<object>>} Array of normalized game objects
 */
export async function getTeamSchedule(teamId, season = CURRENT_SEASON) {
  const data = await espnApi.fetchTeamSchedule(teamId, season);

  const events = data.events || [];

  return events.map(normalizeEvent).filter(Boolean);
}

/**
 * Fetch and normalize the current NFL scoreboard.
 *
 * @returns {Promise<Array<object>>} Array of normalized game objects
 */
export async function getScoreboard() {
  const data = await espnApi.fetchScoreboard();

  const events = data.events || [];

  return events.map(normalizeEvent).filter(Boolean);
}
