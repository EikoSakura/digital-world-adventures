/**
 * Extend the base Item document for Digimon: Digital World Adventures
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
    // Data modifications occur before processing derived data
  }

  /**
   * Prepare derived item data
   */
  prepareDerivedData() {
    const itemData = this;
    const systemData = itemData.system;

    // Type-specific preparation
    this._prepareAttackData(itemData);
  }

  /**
   * Prepare Attack type specific data
   */
  _prepareAttackData(itemData) {
    if (itemData.type !== 'attack') return;

    const systemData = itemData.system;

    // Ensure accuracy data exists
    if (!systemData.accuracy) {
      systemData.accuracy = {
        parameter: 'power',
        skill: 'melee'
      };
    }
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
   * Handle clickable rolls for attacks
   */
  async roll() {
    const item = this;

    // Initialize chat data
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `${item.name}`;

    // For attacks, create a simple display message
    ChatMessage.create({
      speaker: speaker,
      rollMode: rollMode,
      flavor: label,
      content: `<div class="attack-card">
        <h3>${item.name}</h3>
        <p><strong>Type:</strong> ${item.system.attackType}</p>
        <p><strong>Damage Type:</strong> ${item.system.damageType}</p>
        <p><strong>Range:</strong> ${item.system.range}</p>
        <p><strong>Intensity:</strong> ${item.system.intensity}</p>
        <p>${item.system.description || ''}</p>
      </div>`
    });
  }
}
