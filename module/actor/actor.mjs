/**
 * Extend the base Actor document
 */
export class DigitalWorldActor extends Actor {

  /**
   * Augment the actor source data with additional dynamic data
   */
  prepareData() {
    super.prepareData();
  }

  /**
   * Prepare base actor data
   */
  prepareBaseData() {
    // Data modifications in this step occur before processing derived data
  }

  /**
   * Prepare derived actor data
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.digitalworld || {};

    // Make separate methods for each Actor type to keep things organized
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    const systemData = actorData.system;

    // Calculate attribute modifiers
    for (let [key, attribute] of Object.entries(systemData.attributes)) {
      attribute.mod = Math.floor((attribute.value - 10) / 2);
    }

    // Calculate max health and energy based on attributes
    systemData.health.max = 10 + (systemData.attributes.willpower.value * 2);
    systemData.energy.max = 10 + systemData.attributes.intellect.value;
  }

  /**
   * Prepare NPC type specific data
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    const systemData = actorData.system;

    // Calculate attribute modifiers
    for (let [key, attribute] of Object.entries(systemData.attributes)) {
      attribute.mod = Math.floor((attribute.value - 10) / 2);
    }

    // Calculate health and energy based on challenge rating
    systemData.health.max = 10 + (systemData.challenge * 5);
    systemData.energy.max = 10 + (systemData.challenge * 3);
  }

  /**
   * Override getRollData() to provide data for rolls
   */
  getRollData() {
    const data = { ...super.getRollData() };

    // Prepare character roll data
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy attribute modifiers for easy access
    if (data.attributes) {
      for (let [k, v] of Object.entries(data.attributes)) {
        data[k] = v.value;
        data[`${k}Mod`] = v.mod;
      }
    }

    // Add level for convenience
    if (data.level) {
      data.lvl = data.level;
    }
  }

  /**
   * Prepare NPC roll data
   */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;

    // Copy attribute modifiers for easy access
    if (data.attributes) {
      for (let [k, v] of Object.entries(data.attributes)) {
        data[k] = v.value;
        data[`${k}Mod`] = v.mod;
      }
    }

    // Add challenge rating
    if (data.challenge) {
      data.cr = data.challenge;
    }
  }
}
