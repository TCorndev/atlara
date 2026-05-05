//import mysystem from "./modules/config.js";
import myactorsheet from "./modules/sheets/myactorsheet.js";
import equipmentsheet from "./modules/sheets/equipment.js";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once("init", function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  // Add custom constants for configuration.
  //CONFIG.MYSYSTEM = mysystem;
  CONFIG.INIT = true;
  const Items =  foundry.documents.collections.Items; //check if necessary
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("mysystem", myactorsheet, { 
    types: ["character"], 
    makeDefault: true
  });
  // Actors.registerSheet("mysystem", mymonstersheet, { 
  //   types: ["monster"], 
  //   makeDefault: true
  // });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("mysystem", equipmentsheet, { 
    types: ["equipment"], 
    makeDefault: true
  })


  // Define custom Document classes

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.

  // Register sheet application classes

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