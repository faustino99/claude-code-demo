/**
 * Returns an inline style object with a background color derived from a team color hex string.
 * @param {string} color - Hex color string (with or without leading '#')
 * @returns {object} Style object with backgroundColor
 */
export function getTeamColorStyle(color) {
  if (!color) return { backgroundColor: '#333333' };
  const hex = color.startsWith('#') ? color : `#${color}`;
  return { backgroundColor: hex };
}

/**
 * Returns the position group ("Offense", "Defense", or "Special Teams")
 * for a given position abbreviation.
 * @param {string} position - Position abbreviation (e.g., "QB", "CB", "K")
 * @returns {string} Position group name
 */
export function getPositionGroup(position) {
  const offensePositions = [
    'QB', 'RB', 'FB', 'WR', 'TE', 'OT', 'OG', 'C', 'OL', 'G', 'T',
  ];
  const defensePositions = [
    'DE', 'DT', 'DL', 'NT', 'OLB', 'ILB', 'MLB', 'LB', 'CB', 'S', 'FS',
    'SS', 'DB', 'EDG',
  ];
  const specialTeamsPositions = ['K', 'P', 'LS'];

  const pos = (position || '').toUpperCase();

  if (offensePositions.includes(pos)) return 'Offense';
  if (defensePositions.includes(pos)) return 'Defense';
  if (specialTeamsPositions.includes(pos)) return 'Special Teams';
  return 'Other';
}

/**
 * Generic group-by utility. Groups an array of items by a key derived from
 * each item via the provided function.
 * @param {Array} array - Array of items to group
 * @param {Function} keyFn - Function that receives an item and returns the group key
 * @returns {Object} Object whose keys are group names and values are arrays of items
 */
export function groupBy(array, keyFn) {
  if (!Array.isArray(array)) return {};
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}
