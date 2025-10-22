/**
 * Helper functions for the Digimon: Digital World Adventures system
 */

/**
 * Roll a dice pool and count successes
 * Success = 4, 5, or 6 on a d6
 * @param {number} poolSize Number of dice to roll
 * @param {number} autoSuccesses Number of automatic successes to add
 * @returns {Object} Object containing results, successes, and details
 */
export async function rollDicePool(poolSize, autoSuccesses = 0) {
  if (poolSize < 0) poolSize = 0;

  const roll = new Roll(`${poolSize}d6`);
  await roll.evaluate();

  let successes = autoSuccesses;
  const results = [];

  for (let die of roll.dice[0].results) {
    const value = die.result;
    const isSuccess = value >= 4;
    if (isSuccess) successes++;
    results.push({
      value: value,
      success: isSuccess
    });
  }

  return {
    roll: roll,
    results: results,
    successes: successes,
    autoSuccesses: autoSuccesses,
    poolSize: poolSize
  };
}

/**
 * Check if a roll is a critical success or failure
 * @param {number} successes Number of successes rolled
 * @param {number} difficulty Target difficulty
 * @returns {string} 'critical-success', 'critical-failure', 'success', or 'failure'
 */
export function checkCritical(successes, difficulty) {
  const difference = successes - difficulty;

  if (difference >= 3) return 'critical-success';
  if (difference <= -3) return 'critical-failure';
  if (successes >= difficulty) return 'success';
  return 'failure';
}

/**
 * Get difficulty rank label
 * @param {number} difficulty The difficulty number
 * @returns {string} The difficulty label
 */
export function getDifficultyLabel(difficulty) {
  const labels = {
    1: 'Simple (Baby I/II)',
    2: 'Moderate (Child)',
    3: 'Demanding (Adult)',
    4: 'Extreme (Perfect)',
    5: 'Impossible (Ultimate)',
    6: 'Legendary (Super Ultimate)'
  };
  return labels[difficulty] || `Difficulty ${difficulty}`;
}

/**
 * Calculate damage with attribute and element modifiers
 * @param {number} baseDamage Base damage amount
 * @param {string} attackAttribute Attacker's attribute (vaccine, virus, data, free)
 * @param {string} defenseAttribute Defender's attribute
 * @param {string} attackElement Attacker's element
 * @param {string} defenseElement Defender's element
 * @returns {Object} Modified damage and modifiers applied
 */
export function calculateDamage(baseDamage, attackAttribute, defenseAttribute, attackElement, defenseElement) {
  let damage = baseDamage;
  let attributeMod = 0;
  let elementMod = 0;

  // Attribute Triangle: Vaccine > Virus > Data > Vaccine
  if (attackAttribute !== 'free' && defenseAttribute !== 'free') {
    if (
      (attackAttribute === 'vaccine' && defenseAttribute === 'virus') ||
      (attackAttribute === 'virus' && defenseAttribute === 'data') ||
      (attackAttribute === 'data' && defenseAttribute === 'vaccine')
    ) {
      attributeMod = 1;
      damage += 1;
    } else if (
      (attackAttribute === 'virus' && defenseAttribute === 'vaccine') ||
      (attackAttribute === 'data' && defenseAttribute === 'virus') ||
      (attackAttribute === 'vaccine' && defenseAttribute === 'data')
    ) {
      attributeMod = -1;
      damage -= 1;
    }
  }

  // Element Triangles
  if (attackElement !== 'neutral' && defenseElement !== 'neutral') {
    // Fire > Plant > Water > Fire
    if (
      (attackElement === 'fire' && defenseElement === 'plant') ||
      (attackElement === 'plant' && defenseElement === 'water') ||
      (attackElement === 'water' && defenseElement === 'fire')
    ) {
      elementMod = 1;
      damage += 1;
    } else if (
      (attackElement === 'plant' && defenseElement === 'fire') ||
      (attackElement === 'water' && defenseElement === 'plant') ||
      (attackElement === 'fire' && defenseElement === 'water')
    ) {
      elementMod = -1;
      damage -= 1;
    }
    // Electric > Wind > Earth > Electric
    else if (
      (attackElement === 'electric' && defenseElement === 'wind') ||
      (attackElement === 'wind' && defenseElement === 'earth') ||
      (attackElement === 'earth' && defenseElement === 'electric')
    ) {
      elementMod = 1;
      damage += 1;
    } else if (
      (attackElement === 'wind' && defenseElement === 'electric') ||
      (attackElement === 'earth' && defenseElement === 'wind') ||
      (attackElement === 'electric' && defenseElement === 'earth')
    ) {
      elementMod = -1;
      damage -= 1;
    }
    // Light <> Dark
    else if (
      (attackElement === 'light' && defenseElement === 'dark') ||
      (attackElement === 'dark' && defenseElement === 'light')
    ) {
      elementMod = 1;
      damage += 1;
    }
  }

  // Minimum damage of 0
  if (damage < 0) damage = 0;

  return {
    damage: damage,
    attributeMod: attributeMod,
    elementMod: elementMod
  };
}

/**
 * Calculate defense value
 * @param {number} vigor Vigor parameter
 * @param {number} agility Agility parameter
 * @returns {number} Defense value (minimum 1)
 */
export function calculateDefense(vigor, agility) {
  const defense = Math.ceil((vigor + agility) / 4);
  return Math.max(defense, 1);
}

/**
 * Calculate magic defense value
 * @param {number} spirit Spirit parameter
 * @param {number} agility Agility parameter
 * @returns {number} Magic defense value (minimum 1)
 */
export function calculateMagicDefense(spirit, agility) {
  const magicDefense = Math.ceil((spirit + agility) / 4);
  return Math.max(magicDefense, 1);
}

/**
 * Get crest data
 * @param {string} crestType The crest type
 * @returns {Object} Crest information
 */
export function getCrestData(crestType) {
  const crests = {
    courage: { label: 'Courage', description: 'Grants success when acting bravely' },
    friendship: { label: 'Friendship', description: 'Grants success when supporting allies' },
    love: { label: 'Love', description: 'Grants success when protecting others' },
    knowledge: { label: 'Knowledge', description: 'Grants success when using intellect' },
    sincerity: { label: 'Sincerity', description: 'Grants success when being honest' },
    reliability: { label: 'Reliability', description: 'Grants success when being dependable' },
    hope: { label: 'Hope', description: 'Grants success when inspiring others' },
    light: { label: 'Light', description: 'Grants success when bringing clarity' },
    kindness: { label: 'Kindness', description: 'Grants success when showing compassion' }
  };
  return crests[crestType] || { label: 'Unknown', description: '' };
}

/**
 * Get stage label
 * @param {string} stage The stage key
 * @returns {string} The formatted stage label
 */
export function getStageLabel(stage) {
  const labels = {
    baby1: 'Baby I',
    baby2: 'Baby II',
    child: 'Child',
    adult: 'Adult',
    perfect: 'Perfect',
    ultimate: 'Ultimate',
    superUltimate: 'Super Ultimate'
  };
  return labels[stage] || stage;
}

/**
 * Calculate evolution cost in Digisoul
 * @param {string} currentStage Current evolution stage
 * @param {string} targetStage Target evolution stage
 * @returns {number} Digisoul cost
 */
export function calculateEvolutionCost(currentStage, targetStage) {
  const stages = ['baby1', 'baby2', 'child', 'adult', 'perfect', 'ultimate', 'superUltimate'];
  const currentIndex = stages.indexOf(currentStage);
  const targetIndex = stages.indexOf(targetStage);

  if (currentIndex === -1 || targetIndex === -1) return 0;
  return Math.abs(targetIndex - currentIndex);
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
