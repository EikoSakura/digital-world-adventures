/**
 * Digital World Adventures System
 * Main entry point for the Foundry VTT system
 */

// Import document classes
import { DigitalWorldActor } from "./actor/actor.mjs";
import { DigitalWorldItem } from "./item/item.mjs";

// Import sheet classes
import { DigitalWorldActorSheet } from "./actor/actor-sheet.mjs";
import { DigitalWorldItemSheet } from "./item/item-sheet.mjs";

// Import helper utilities
import * as helpers from "./helpers/helpers.mjs";

/**
 * Initialize the system
 */
Hooks.once('init', async function() {
  console.log('Digital World Adventures | Initializing System');

  // Add custom constants
  game.digitalworld = {
    DigitalWorldActor,
    DigitalWorldItem,
    helpers
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = DigitalWorldActor;
  CONFIG.Item.documentClass = DigitalWorldItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("digital-world-adventures", DigitalWorldActorSheet, {
    makeDefault: true,
    label: "DIGITALWORLD.SheetLabels.Actor"
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("digital-world-adventures", DigitalWorldItemSheet, {
    makeDefault: true,
    label: "DIGITALWORLD.SheetLabels.Item"
  });

  // Preload Handlebars templates
  await preloadHandlebarsTemplates();

  // Register Handlebars helpers
  registerHandlebarsHelpers();
});

/**
 * Ready hook - runs when the game is fully loaded
 */
Hooks.once('ready', async function() {
  console.log('Digital World Adventures | System Ready');
});

/**
 * Preload Handlebars templates
 */
async function preloadHandlebarsTemplates() {
  const templatePaths = [
    // Actor sheet partials
    "systems/digital-world-adventures/templates/actor/parts/actor-attributes.hbs",
    "systems/digital-world-adventures/templates/actor/parts/actor-items.hbs",
    "systems/digital-world-adventures/templates/actor/parts/actor-effects.hbs",

    // Item sheet partials
    "systems/digital-world-adventures/templates/item/parts/item-effects.hbs"
  ];

  return loadTemplates(templatePaths);
}

/**
 * Register Handlebars helpers
 */
function registerHandlebarsHelpers() {
  Handlebars.registerHelper('concat', function() {
    let outStr = '';
    for (let arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper('times', function(n, block) {
    let accum = '';
    for (let i = 0; i < n; ++i) {
      accum += block.fn(i);
    }
    return accum;
  });
}
