//Should this merge with lineage.js for a base itemsheet class? Who knows
export default class featsheet extends foundry.appv1.sheets.ItemSheet {
    get template(){
         return "systems/atlara/templates/sheets/feat.html"
    }
}