export default class altaraactor extends Actor {
    prepareDerivedData() {
    
        super.prepareDerivedData();
        const system = this.system;
        const lineage = this.items.find(i => i.type === "lineage")
        const archetype = this.items.find(i => i.type === "archetype")
        console.log(lineage)
        for (const [key, trait] of Object.entries(system.traits)){
            console.log(trait)
            trait.max = 5 + Number(system.details.tier)
            trait.lineage = lineage?.system?.traits[key]
            trait.archetype = archetype?.system?.traits[key]? 1 : 0
            trait.total = Math.min(trait.max, trait.lineage + trait.archetype + trait.feat + trait.level)
            console.log(trait)
        }
    }
}