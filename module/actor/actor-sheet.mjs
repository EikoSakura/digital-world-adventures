/**
 * Extend the basic ActorSheet
 */
export class DigitalWorldActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["digital-world-adventures", "sheet", "actor"],
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }]
    });
  }

  /** @override */
  get template() {
    return `systems/digital-world-adventures/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /** @override */
  async getData() {
    // Retrieve the data structure from the base sheet
    const context = super.getData();

    // Use a safe clone of the actor data for further operations
    const actorData = context.data;

    // Add the actor's data to context for easier access
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare character data and items
    if (actorData.type === 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items
    if (actorData.type === 'npc') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = this._prepareActiveEffects();

    return context;
  }

  /**
   * Organize and classify Items for Character sheets
   */
  _prepareCharacterData(context) {
    // Handle attribute modifiers
    for (let [k, v] of Object.entries(context.system.attributes)) {
      v.label = k.charAt(0).toUpperCase() + k.slice(1);
    }
  }

  /**
   * Organize and classify Items for all sheets
   */
  _prepareItems(context) {
    // Initialize containers
    const items = [];
    const abilities = [];
    const equipment = [];
    const skills = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;

      // Append to items
      if (i.type === 'item') {
        items.push(i);
      }
      // Append to abilities
      else if (i.type === 'ability') {
        abilities.push(i);
      }
      // Append to equipment
      else if (i.type === 'equipment') {
        equipment.push(i);
      }
      // Append to skills
      else if (i.type === 'skill') {
        skills.push(i);
      }
    }

    // Assign and return
    context.items = items;
    context.abilities = abilities;
    context.equipment = equipment;
    context.skills = skills;
  }

  /**
   * Prepare active effects for display
   */
  _prepareActiveEffects() {
    const effects = [];

    for (let effect of this.actor.allApplicableEffects()) {
      effects.push({
        id: effect.id,
        name: effect.name,
        img: effect.img,
        duration: effect.duration,
        disabled: effect.disabled
      });
    }

    return effects;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check
    html.on('click', '.item-edit', ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on('click', '.item-delete', ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on('click', '.effect-control', ev => {
      const row = ev.currentTarget.closest('li');
      const document = row.dataset.parentId === this.actor.id
        ? this.actor
        : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities
    html.on('click', '.rollable', this._onRoll.bind(this));

    // Drag events for macros
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;
    const data = duplicate(header.dataset);
    const name = `New ${type.capitalize()}`;
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    delete itemData.system["type"];

    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle clickable rolls
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls
    if (dataset.rollType) {
      if (dataset.rollType === 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle attribute rolls
    if (dataset.roll) {
      let label = dataset.label ? `[${dataset.label}]` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }
}

/**
 * Manage Active Effect documents belonging to the Actor document, or one of its owned Items
 */
function onManageActiveEffect(event, owner) {
  event.preventDefault();
  const a = event.currentTarget;
  const li = a.closest("li");
  const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;

  switch (a.dataset.action) {
    case "create":
      return owner.createEmbeddedDocuments("ActiveEffect", [{
        name: "New Effect",
        icon: "icons/svg/aura.svg",
        origin: owner.uuid,
        "duration.rounds": li.dataset.effectType === "temporary" ? 1 : undefined,
        disabled: li.dataset.effectType === "inactive"
      }]);
    case "edit":
      return effect.sheet.render(true);
    case "delete":
      return effect.delete();
    case "toggle":
      return effect.update({disabled: !effect.disabled});
  }
}
