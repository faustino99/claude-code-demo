import * as espnApi from './espnApi';

/**
 * Team service – normalizes ESPN team data into a flat, consistent model that
 * UI components can consume without worrying about the deeply-nested ESPN
 * response structure.
 */

// ---------------------------------------------------------------------------
// Static conference / division fallback map
// ---------------------------------------------------------------------------

/**
 * When the ESPN response does not include group / conference information we
 * fall back to a static lookup keyed by team abbreviation.
 */
const TEAM_DIVISIONS = {
  // AFC East
  BUF: { conference: 'AFC', division: 'East' },
  MIA: { conference: 'AFC', division: 'East' },
  NE:  { conference: 'AFC', division: 'East' },
  NYJ: { conference: 'AFC', division: 'East' },
  // AFC North
  BAL: { conference: 'AFC', division: 'North' },
  CIN: { conference: 'AFC', division: 'North' },
  CLE: { conference: 'AFC', division: 'North' },
  PIT: { conference: 'AFC', division: 'North' },
  // AFC South
  HOU: { conference: 'AFC', division: 'South' },
  IND: { conference: 'AFC', division: 'South' },
  JAX: { conference: 'AFC', division: 'South' },
  TEN: { conference: 'AFC', division: 'South' },
  // AFC West
  DEN: { conference: 'AFC', division: 'West' },
  KC:  { conference: 'AFC', division: 'West' },
  LV:  { conference: 'AFC', division: 'West' },
  LAC: { conference: 'AFC', division: 'West' },
  // NFC East
  DAL: { conference: 'NFC', division: 'East' },
  NYG: { conference: 'NFC', division: 'East' },
  PHI: { conference: 'NFC', division: 'East' },
  WSH: { conference: 'NFC', division: 'East' },
  // NFC North
  CHI: { conference: 'NFC', division: 'North' },
  DET: { conference: 'NFC', division: 'North' },
  GB:  { conference: 'NFC', division: 'North' },
  MIN: { conference: 'NFC', division: 'North' },
  // NFC South
  ATL: { conference: 'NFC', division: 'South' },
  CAR: { conference: 'NFC', division: 'South' },
  NO:  { conference: 'NFC', division: 'South' },
  TB:  { conference: 'NFC', division: 'South' },
  // NFC West
  ARI: { conference: 'NFC', division: 'West' },
  LAR: { conference: 'NFC', division: 'West' },
  SF:  { conference: 'NFC', division: 'West' },
  SEA: { conference: 'NFC', division: 'West' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Attempt to extract conference and division from the ESPN team.groups object.
 * Falls back to the static TEAM_DIVISIONS map.
 */
function extractDivision(team) {
  // ESPN may provide group info under `groups` or `group`
  const groups = team.groups || team.group;

  if (groups) {
    // Groups can be a nested structure: groups.parent for conference,
    // groups itself for division.
    const divisionName =
      groups.name || groups.displayName || groups.shortName || '';
    const conferenceName =
      groups.parent?.name ||
      groups.parent?.abbreviation ||
      groups.parent?.displayName ||
      '';

    if (conferenceName || divisionName) {
      return {
        conference: conferenceName || '',
        division: divisionName || '',
      };
    }
  }

  // Fallback to static lookup.
  const abbrev = (team.abbreviation || '').toUpperCase();
  return TEAM_DIVISIONS[abbrev] || { conference: '', division: '' };
}

/**
 * Extract a human-readable record string from ESPN's record array.
 */
function extractRecord(team) {
  if (!team.record) return '';
  // `record` may be a string or an object / array.
  if (typeof team.record === 'string') return team.record;
  const items = team.record.items || team.record;
  if (Array.isArray(items) && items.length > 0) {
    // The first item is typically the overall record.
    const overall = items.find((r) => r.type === 'total') || items[0];
    return overall.summary || overall.displayValue || '';
  }
  return '';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch and normalize all 32 NFL teams.
 * @returns {Promise<Array<object>>} Array of normalized team objects
 */
export async function getAllTeams() {
  const data = await espnApi.fetchTeams();

  // ESPN wraps teams deeply: sports[0].leagues[0].teams[]
  const teamsRaw =
    data?.sports?.[0]?.leagues?.[0]?.teams || [];

  return teamsRaw.map((entry) => {
    const team = entry.team || entry;
    const { conference, division } = extractDivision(team);
    const logos = team.logos || [];

    return {
      id: team.id || '',
      abbreviation: team.abbreviation || '',
      displayName: team.displayName || team.name || '',
      shortName: team.shortDisplayName || team.shortName || '',
      location: team.location || '',
      color: team.color || '',
      alternateColor: team.alternateColor || '',
      logo: logos[0]?.href || team.logo || '',
      conference,
      division,
      record: extractRecord(team),
    };
  });
}

/**
 * Fetch and normalize a team's roster.
 *
 * ESPN returns the roster grouped by position categories (e.g. "Offense",
 * "Defense", "Special Teams").  Each category has an `items` array of athlete
 * objects.  We flatten them into a single array of normalized player objects,
 * preserving the position group for downstream grouping.
 *
 * @param {string|number} teamId - ESPN team ID
 * @returns {Promise<Array<object>>} Flat array of normalized roster entries
 */
export async function getTeamRoster(teamId) {
  const data = await espnApi.fetchTeamRoster(teamId);

  // ESPN: response.athletes[] -> position groups with items[]
  const positionGroups = data.athletes || [];
  const roster = [];

  for (const group of positionGroups) {
    const groupName = group.position || group.name || group.displayName || '';
    const athletes = group.items || [];

    for (const athlete of athletes) {
      const position = athlete.position || {};
      const headshot = athlete.headshot || {};

      roster.push({
        id: athlete.id || '',
        fullName: athlete.fullName || athlete.displayName || '',
        firstName: athlete.firstName || '',
        lastName: athlete.lastName || '',
        jersey: athlete.jersey || '',
        position: position.abbreviation || position.name || '',
        positionName: position.displayName || position.name || '',
        positionGroup: groupName,
        headshot: headshot.href || headshot.url || '',
        height: athlete.height || '',
        weight: athlete.weight || '',
        age: athlete.age || '',
        experience: athlete.experience?.years ?? athlete.experience ?? '',
        college: athlete.college?.name || athlete.college || '',
      });
    }
  }

  return roster;
}
