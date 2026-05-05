export default class equipmentsheet extends foundry.appv1.sheets.ItemSheet {
    get template ()  {
        return "systems/atlara/templates/sheets/equipment.html";
    }
    activateListeners(html)
    {
        super.activateListeners(html);
        html.find(".addstat").on("click", this.addStat.bind(this));
        html.find(".removestat").on("click", this.removeStat.bind(this));
    }

    async addStat(event)
    {
        event.preventDefault();
        if (this.dialog) {
            console.log("Already opened")
            this.dialog.bringToTop();
            return;
        }
        const stats = this.item.system.stats;
        const html =  await renderTemplate(
            "systems/atlara/templates/partials/equip-add-stat.hbs",
            {
                stats
            }
        )
        this.dialog = new Dialog({
            title: "Add Stat",
            content: html,
            buttons: {
                submit: {
                    callback: async (html) => {
                        const selection = html.find(".selection").val();
                        stats[selection].selected = true
                        console.log(stats);
                        const allSelected = Object.values(stats).every(s => s.selected)
                        console.log(allSelected);
                        await this.item.update({
                            [`system.stats.${selection}.selected`]: true,
                            "system.allselected": allSelected
                        })
                    },
                    label: "Add"
                },
                cancel: {
                    label: "Cancel"
                }
            },
            default: "submit",
            close: () => {
                this.dialog = null;
            }
        }).render(true);
    }
    async removeStat(event)
    {
        event.preventDefault();
        const stat = event.currentTarget.dataset.key;
        await this.item.update({
            [`system.stats.${stat}.selected`]: false,
            [`system.stats.${stat}.tier`]: 0,
            "system.allselected": false
        })
    }
}