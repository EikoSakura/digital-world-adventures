/**
 * Helper functions for the Digital World Adventures system
 */

/**
 * Calculate the modifier for an attribute value
 * @param {number} value The attribute value
 * @returns {number} The calculated modifier
 */
export function calculateModifier(value) {
  return Math.floor((value - 10) / 2);
}

/**
 * Format a modifier value with + or - sign
 * @param {number} mod The modifier value
 * @returns {string} The formatted modifier string
 */
export function formatModifier(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

/**
 * Capitalize the first letter of a string
 * @param {string} str The string to capitalize
 * @returns {string} The capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get the label for an attribute
 * @param {string} key The attribute key
 * @returns {string} The formatted label
 */
export function getAttributeLabel(key) {
  const labels = {
    'strength': 'Strength',
    'agility': 'Agility',
    'intellect': 'Intellect',
    'willpower': 'Willpower',
    'charisma': 'Charisma'
  };
  return labels[key] || capitalize(key);
}
