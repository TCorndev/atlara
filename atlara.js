//import mysystem from "./modules/config.js";
import charactersheet from "./modules/sheets/charactersheet.js";
import equipmentsheet from "./modules/sheets/equipment.js";
import lineagesheet from "./modules/sheets/lineage.js";
import altaraactor from "./modules/altaraactor.js"
import { PRESET_DECKS } from "./modules/decks.js"

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once("init", function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  // Add custom constants for configuration.
  CONFIG.INIT = true;
  const Items =  foundry.documents.collections.Items; //check if necessary
  const Actors = foundry.documents.collections.Actors;
  const ItemSheet = foundry.appv1.sheets.ItemSheet;
  
  //setup cards
  // Object.entries(PRESET_DECKS).forEach(([key, deck]) => {
  //   console.log(deck)
  //   CONFIG.Cards.presets[key] = {
  //     label: deck.name,
  //     type: deck.type,
  //     cards: deck.cards
  //   };
  // })

  // Define custom Document classes
  CONFIG.Actor.documentClass = altaraactor
  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.


  // Register sheet application classes
  Actors.unregisterSheet("core", Actors);
  Actors.registerSheet("atlara", charactersheet, { 
    types: ["character", "monster"], 
    makeDefault: true
  });
  // Actors.registerSheet("atlara", mymonstersheet, { 
  //   types: ["monster"], 
  //   makeDefault: true
  // });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("atlara", equipmentsheet, { 
    types: ["equipment"], 
    makeDefault: true
  })
  Items.registerSheet("atlara", lineagesheet), {
    types: ["lineage", "archetype"],
    makeDefault: true
  }
  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

function preloadHandlebarsTemplates() {

  const templePaths = [

  ]
}
Hooks.once("ready", function() {
  console.log("Ready");
  CONFIG.INIT = false;
});