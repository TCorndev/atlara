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
        html.find(".showitem").on("click", this.showItem.bind(this));
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
    //This is disgusting implementation there has to be a better way to do this
    async setPath(event){
        event.preventDefault()
        const step = "step" + event.currentTarget.dataset.num;
        const path = event.currentTarget.value
        const currentPath = this.item.system.path.step
        //this should remove the currently selected pathtype from any part of the path it may be on
        for (const [key, value] of Object.entries(currentPath)) {
            if (value === path) {
                await this.item.update({
                    [`system.path.step.${key}`]: ""
                })
            }
        }
        await this.item.update({
            [`system.path.step.${step}`]: path,
        })
    }
    async showItem(event){
        event.preventDefault()
        console.log(this.item.system)
    }
}