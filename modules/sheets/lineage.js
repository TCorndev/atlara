export default class lineagesheet extends foundry.appv1.sheets.ItemSheet {
    get template(){
        if(this.item.type == "lineage"){
            return "systems/atlara/templates/sheets/lineage.html"
        }
        if(this.item.type == "archetype"){
            return "systems/atlara/templates/sheets/archetype.html"
        }
        return null //add error sheet??
    }
    activateListeners(html){
        super.activateListeners(html);
        html.find(".addskill").on("click", this.addSkill.bind(this));
        html.find(".removeskill").on("click", this.removeSkill.bind(this));
    }
    async addSkill(event){
        event.preventDefault()
        if (this.dialog) {
            console.log("Already opened")
            this.dialog.bringToTop();
            return;
        }
        const skills = this.item.system.skills;
        const html =  await renderTemplate(
            "systems/atlara/templates/partials/add-skillbonus.hbs",
            {
                skills
            }
        )
        this.dialog = new Dialog({
            title: "Add Skill",
            content: html,
            buttons: {
                submit: {
                    callback: async (html) => {
                        const selection = html.find(".selection").val();
                        skills[selection] = true
                        const allSelected = Object.values(skills).every(s => s)
                        await this.item.update({
                            [`system.skills.${selection}`]: true,
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
    async removeSkill(event){
        event.preventDefault()
        const skill = event.currentTarget.dataset.key;
        await this.item.update({
            [`system.skills.${skill}`]: false,
            "system.allselected": false
        })
    }
}