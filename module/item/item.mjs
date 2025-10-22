/**
 * Extend the base Item document
 */
export class DigitalWorldItem extends Item {

  /**
   * Augment the item source data with additional dynamic data
   */
  prepareData() {
    super.prepareData();
  }

  /**
   * Prepare base item data
   */
  prepareBaseData() {
    // Data modifications in this step occur before processing derived data
  }

  /**
   * Prepare derived item data
   */
  prepareDerivedData() {
    const itemData = this;
    const systemData = itemData.system;
    const flags = itemData.flags.digitalworld || {};

    // Make separate methods for each Item type to keep things organized
    this._prepareAbilityData(itemData);
    this._prepareEquipmentData(itemData);
  }

  /**
   * Prepare Ability type specific data
   */
  _prepareAbilityData(itemData) {
    if (itemData.type !== 'ability') return;

    const systemData = itemData.system;

    // Ensure damage value exists
    if (!systemData.damage) {
      systemData.damage = {
        value: "",
        type: "physical"
      };
    }
  }

  /**
   * Prepare Equipment type specific data
   */
  _prepareEquipmentData(itemData) {
    if (itemData.type !== 'equipment') return;

    const systemData = itemData.system;

    // Calculate total armor value if equipped
    systemData.totalArmor = systemData.equipped ? systemData.armor : 0;
  }

  /**
   * Override getRollData() to provide data for rolls
   */
  getRollData() {
    if (!this.actor) return null;

    const rollData = this.actor.getRollData();
    rollData.item = { ...this.system };

    return rollData;
  }

  /**
   * Handle clickable rolls
   */
  async roll() {
    const item = this;

    // Initialize chat data
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? ''
      });
    }
    // Otherwise, create a roll
    else {
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat
      const roll = new Roll(this.system.formula, rollData);
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }
}
