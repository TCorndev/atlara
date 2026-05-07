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
        html.find(".destinypath").on("change", this.setPath.bind(this));
    }
    async addSkill(event){
        event.preventDefault()
        if (this.dialog) {
            console.log("Already opened")
            this.dialog.bringToTop();
            return;
        }
        const type = event.currentTarget.dataset.type
        const skills = this.item.system[type];
        const allselected = type + "allselected"
        console.log(this.item.system[allselected])
        const html =  await renderTemplate(
            "systems/atlara/templates/partials/add-skillbonus.hbs",
            {
                skills
            }
        )
        this.dialog = new Dialog({
            title: "Add " + type,
            content: html,
            buttons: {
                submit: {
                    callback: async (html) => {
                        const selection = html.find(".selection").val();
                        skills[selection] = true
                        const selected = Object.values(skills).every(s => s)
                        await this.item.update({
                            [`system.${type}.${selection}`]: true,
                            [`system.${allselected}`]: selected
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
        console.log(event)
        const type = event.currentTarget.dataset.type;
        const skill = event.currentTarget.dataset.key;
        const allselected = type + "allselected"
        await this.item.update({
            [`system.${type}.${skill}`]: false,
            [`system.${allselected}`]: false
        })
    }
    async setPath(event){
        event.preventDefault()
        console.log(event.currentTarget.value)
        console.log(event.currentTarget.dataset.num)
    }
}