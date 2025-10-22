/**
 * Digimon: Digital World Adventures System
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
  console.log('Digimon: Digital World Adventures | Initializing System');

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
    label: "Digital World Adventures Actor Sheet"
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("digital-world-adventures", DigitalWorldItemSheet, {
    makeDefault: true,
    label: "Digital World Adventures Item Sheet"
  });

  // Preload Handlebars templates
  await preloadHandlebarsTemplates();

  // Register Handlebars helpers
  registerHandlebarsHelpers();

  console.log('Digimon: Digital World Adventures | System Initialized');
});

/**
 * Ready hook - runs when the game is fully loaded
 */
Hooks.once('ready', async function() {
  console.log('Digimon: Digital World Adventures | System Ready');
});

/**
 * Preload Handlebars templates
 */
async function preloadHandlebarsTemplates() {
  const templatePaths = [
    // Chat templates
    "systems/digital-world-adventures/templates/chat/dice-pool-roll.hbs",
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
    return str ? str.toLowerCase() : '';
  });

  Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });

  Handlebars.registerHelper('gt', function(a, b) {
    return a > b;
  });

  Handlebars.registerHelper('capitalize', function(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  Handlebars.registerHelper('checked', function(value) {
    return value ? 'checked' : '';
  });
}
