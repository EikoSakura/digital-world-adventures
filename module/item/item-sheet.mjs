/**
 * Extend the basic ItemSheet
 */
export class DigitalWorldItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["digital-world-adventures", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/digital-world-adventures/templates/item";
    return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  /** @override */
  async getData() {
    // Retrieve base data structure
    const context = super.getData();

    // Use a safe clone of the item data for further operations
    const itemData = context.data;

    // Retrieve the roll data for TinyMCE editors
    context.rollData = this.item.getRollData();

    // Add the item's data to context for easier access
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Prepare item type specific data
    this._prepareItemTypeData(context);

    return context;
  }

  /**
   * Prepare item type specific data
   */
  _prepareItemTypeData(context) {
    switch (context.item.type) {
      case 'ability':
        this._prepareAbilityData(context);
        break;
      case 'equipment':
        this._prepareEquipmentData(context);
        break;
      case 'skill':
        this._prepareSkillData(context);
        break;
    }
  }

  /**
   * Prepare ability specific data
   */
  _prepareAbilityData(context) {
    // Add damage types
    context.damageTypes = {
      'physical': 'Physical',
      'energy': 'Energy',
      'digital': 'Digital',
      'elemental': 'Elemental'
    };

    // Add cost types
    context.costTypes = {
      'energy': 'Energy',
      'health': 'Health',
      'none': 'None'
    };
  }

  /**
   * Prepare equipment specific data
   */
  _prepareEquipmentData(context) {
    // Add attribute names for bonuses
    context.attributeNames = {
      'strength': 'Strength',
      'agility': 'Agility',
      'intellect': 'Intellect',
      'willpower': 'Willpower',
      'charisma': 'Charisma'
    };
  }

  /**
   * Prepare skill specific data
   */
  _prepareSkillData(context) {
    // Add attribute names for skill association
    context.attributeNames = {
      'strength': 'Strength',
      'agility': 'Agility',
      'intellect': 'Intellect',
      'willpower': 'Willpower',
      'charisma': 'Charisma'
    };
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here
  }
}
