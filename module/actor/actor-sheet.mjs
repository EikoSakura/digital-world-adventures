/**
 * Extend the basic ActorSheet for Digimon: Digital World Adventures
 */
export class DigitalWorldActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["digital-world-adventures", "sheet", "actor"],
      width: 600,
      height: 700,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }]
    });
  }

  /** @override */
  get template() {
    return `systems/digital-world-adventures/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /** @override */
  async getData() {
    const context = super.getData();
    const actorData = context.data;

    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare items
    this._prepareItems(context);

    // Add roll data
    context.rollData = context.actor.getRollData();

    return context;
  }

  /**
   * Organize and classify Items
   */
  _prepareItems(context) {
    const talents = [];
    const attacks = [];
    const abilities = [];
    const equipment = [];
    const consumables = [];
    const assets = [];

    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;

      if (i.type === 'talent') talents.push(i);
      else if (i.type === 'attack') attacks.push(i);
      else if (i.type === 'ability') abilities.push(i);
      else if (i.type === 'equipment') equipment.push(i);
      else if (i.type === 'consumable') consumables.push(i);
      else if (i.type === 'asset') assets.push(i);
    }

    context.talents = talents;
    context.attacks = attacks;
    context.abilities = abilities;
    context.equipment = equipment;
    context.consumables = consumables;
    context.assets = assets;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Item editing
    html.on('click', '.item-edit', ev => {
      const li = $(ev.currentTarget).closest(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    if (!this.isEditable) return;

    // Add item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete item
    html.on('click', '.item-delete', ev => {
      const li = $(ev.currentTarget).closest(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Rollable elements
    html.on('click', '.rollable', this._onRoll.bind(this));

    // Drag events
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Create new item
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;
    const name = `New ${type.capitalize()}`;
    const itemData = {
      name: name,
      type: type,
      system: {}
    };

    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle rolls
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle attack rolls
    if (dataset.rollType === 'attack') {
      const itemId = element.closest('.item').dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) return item.roll();
    }
  }
}
