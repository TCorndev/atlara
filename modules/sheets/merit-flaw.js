export default class merit_flawsheet extends foundry.appv1.sheets.ItemSheet{
    get template(){
        if(this.item.type == "merit"){
            return "systems/atlara/templates/sheets/merit.html"
        }
        if(this.item.type == "flaw"){
            return "systems/atlara/templates/sheets/flaw.html"
        }
    }
    activateListeners(html)
    {
        super.activateListeners(html);
        html.find(".trait-selection").on("change", this.chooseTrait.bind(this))
        console.log(this.item.system.traits)
    }
    async chooseTrait(event){
        event.preventDefault()
        const chosenTrait = event.target.value
        const traits = this.item.system.traits
        for (const [key, trait] of Object.entries(traits)){
            traits[key] = (key === chosenTrait)
            await this.item.update({
                [`system.traits.${key}`] : (key === chosenTrait)
            })
        }
        console.log(traits)
    }

}