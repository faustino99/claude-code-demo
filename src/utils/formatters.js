/**
 * Format a date string into a short readable format like "Sun, Jan 5"
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  return `${dayName}, ${monthName} ${dayOfMonth}`;
}

/**
 * Format a date string into a game time like "1:00 PM ET"
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time in Eastern Time
 */
export function formatGameTime(dateString) {
  const date = new Date(dateString);
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York',
  };
  const timeStr = date.toLocaleString('en-US', options);
  return `${timeStr} ET`;
}

/**
 * Format height from total inches to feet and inches (e.g., 74 -> 6'2")
 * @param {number} inches - Height in inches
 * @returns {string} Formatted height
 */
export function formatHeight(inches) {
  if (inches == null || isNaN(inches)) return '--';
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
}

/**
 * Format weight with "lbs" suffix
 * @param {number} lbs - Weight in pounds
 * @returns {string} Formatted weight
 */
export function formatWeight(lbs) {
  if (lbs == null || isNaN(lbs)) return '--';
  return `${lbs} lbs`;
}

/**
 * Format a team record like "14-3" or "14-3-1" when ties exist
 * @param {number} wins
 * @param {number} losses
 * @param {number} [ties=0]
 * @returns {string} Formatted record
 */
export function formatRecord(wins, losses, ties) {
  if (wins == null || losses == null) return '--';
  if (ties && ties > 0) {
    return `${wins}-${losses}-${ties}`;
  }
  return `${wins}-${losses}`;
}

/**
 * Format a stat value: integers stay as-is, floats display to 1 decimal place
 * @param {number|string|null} value - The stat value
 * @returns {string} Formatted stat
 */
export function formatStat(value) {
  if (value == null || value === '') return '--';
  const num = Number(value);
  if (isNaN(num)) return String(value);
  if (Number.isInteger(num)) return String(num);
  return num.toFixed(1);
}
