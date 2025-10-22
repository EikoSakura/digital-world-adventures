/**
 * Extend the basic ActorSheet for Digimon: Digital World Adventures
 */
export class DigitalWorldActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["digital-world-adventures", "sheet", "actor"],
      width: 700,
      height: 800,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "tamer" }]
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

    // Prepare partner data for Tamers
    if (this.actor.type === 'tamer') {
      await this._preparePartnerData(context);
    }

    // Add roll data
    context.rollData = context.actor.getRollData();

    return context;
  }

  /**
   * Prepare partner Digimon data for Tamer sheets
   */
  async _preparePartnerData(context) {
    const partnerId = context.system.partnerId;

    if (partnerId) {
      const partner = game.actors.get(partnerId);

      if (partner && partner.type === 'digimon') {
        context.partner = partner;

        // Prepare partner's items
        const partnerAbilities = [];
        const partnerAttacks = [];

        for (let item of partner.items) {
          if (item.type === 'ability') partnerAbilities.push(item);
          else if (item.type === 'attack') partnerAttacks.push(item);
        }

        context.partnerAbilities = partnerAbilities;
        context.partnerAttacks = partnerAttacks;
      }
    }
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
    const crests = [];

    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;

      if (i.type === 'talent') talents.push(i);
      else if (i.type === 'attack') attacks.push(i);
      else if (i.type === 'ability') abilities.push(i);
      else if (i.type === 'equipment') equipment.push(i);
      else if (i.type === 'consumable') consumables.push(i);
      else if (i.type === 'asset') assets.push(i);
      else if (i.type === 'crest') crests.push(i);
    }

    context.talents = talents;
    context.attacks = attacks;
    context.abilities = abilities;
    context.equipment = equipment;
    context.consumables = consumables;
    context.assets = assets;
    context.crests = crests;
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

    // Partner sheet controls
    html.on('click', '.open-partner-sheet', this._onOpenPartnerSheet.bind(this));
    html.on('click', '.select-partner', this._onSelectPartner.bind(this));

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

    // Partner attack rolls
    html.on('click', '.partner-attack', this._onPartnerAttackRoll.bind(this));

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
   * Open partner Digimon sheet
   */
  _onOpenPartnerSheet(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const partnerId = button.dataset.actorId;
    const partner = game.actors.get(partnerId);

    if (partner) {
      partner.sheet.render(true);
    }
  }

  /**
   * Select a partner Digimon
   */
  async _onSelectPartner(event) {
    event.preventDefault();

    // Get all Digimon actors
    const digimonActors = game.actors.filter(a => a.type === 'digimon');

    // Create selection dialog
    const content = `
      <form>
        <div class="form-group">
          <label>Select Partner Digimon:</label>
          <select id="partner-select" name="partnerId">
            <option value="">-- None --</option>
            ${digimonActors.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
          </select>
        </div>
      </form>
    `;

    new Dialog({
      title: "Select Partner Digimon",
      content: content,
      buttons: {
        select: {
          icon: '<i class="fas fa-check"></i>',
          label: "Select",
          callback: async (html) => {
            const partnerId = html.find('#partner-select').val();
            await this.actor.update({"system.partnerId": partnerId});

            // Also update the partner's tamerId
            if (partnerId) {
              const partner = game.actors.get(partnerId);
              if (partner) {
                await partner.update({"system.tamerId": this.actor.id});
              }
            }
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel"
        }
      },
      default: "select"
    }).render(true);
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

  /**
   * Handle partner attack rolls
   */
  _onPartnerAttackRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.rollType === 'attack') {
      const partnerId = dataset.actorId;
      const itemId = dataset.itemId;

      const partner = game.actors.get(partnerId);
      if (partner) {
        const item = partner.items.get(itemId);
        if (item) return item.roll();
      }
    }
  }
}
