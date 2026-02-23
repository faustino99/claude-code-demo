const isDev = import.meta.env.DEV;

// In dev, use Vite proxy paths. In production, call ESPN directly (CORS-friendly endpoints).
export const ESPN_SITE_API = isDev
  ? '/espn-api/apis/site/v2/sports/football/nfl'
  : 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';

export const ESPN_WEB_API = isDev
  ? '/espn-web-api/apis/common/v3/sports/football/nfl'
  : 'https://site.web.api.espn.com/apis/common/v3/sports/football/nfl';

export const SPORTSDB_API = 'https://www.thesportsdb.com/api/v1/json/3';
export const CURRENT_SEASON = 2026;
export const NFL_LEAGUE_ID_SPORTSDB = 4391;
