/**
 * Extend the basic ItemSheet for Digimon: Digital World Adventures
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
    // Use a universal item sheet for all types
    return `systems/digital-world-adventures/templates/item/item-sheet.hbs`;
  }

  /** @override */
  async getData() {
    const context = super.getData();
    const itemData = context.data;

    context.rollData = this.item.getRollData();
    context.system = itemData.system;
    context.flags = itemData.flags;

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    if (!this.isEditable) return;

    // Custom listeners can go here
  }
}
