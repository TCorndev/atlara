export default class altaraactor extends Actor {
    prepareDerivedData() {
    
        super.prepareDerivedData();
        const system = this.system;
        //set tier
        system.details.tier = Math.ceil(system.details.level/3)
        this.setTraitsAndSkills(system)
        this.setLevelBonus(system)
        this.setThresholds(system)
    }
    setTraitsAndSkills(system) {
        const lineage = this.items.find(i => i.type === "lineage")
        const archetype = this.items.find(i => i.type === "archetype")
        for (const [key, trait] of Object.entries(system.traits)){
            trait.max = 5 + Number(system.details.tier)
            trait.lineage = lineage?.system?.traits[key] ?? 1
            trait.archetype = archetype?.system?.traits[key]? 1 : 0
            trait.total = Math.min(trait.max, trait.lineage + trait.archetype + trait.feat + trait.level + trait.bonus)
        }
        for (const [key, skill] of Object.entries(system.skills)){
            if (archetype?.system?.skills[key] || lineage?.system?.skills[key]){
                skill.base = 2 //If both are true, is an extra skillup given?
            }
            else{
                skill.base = 1
            }
            skill.total = Math.min(skill.max, skill.base + skill.feat + skill.bonus + skill.level)
            skill.die = 2 + (skill.total * 2)
        }
    }
    //update feats and talents in the future
    setLevelBonus(system){
        const level = system.details.level
        const skillpoints = system.levelup.skillpoints
        const traitpoints = system.levelup.traitpoints
        const featpoints = system.levelup.featpoints //may update
        const talentpoints = system.levelup.talentpoints //may update
        const traits = system.traits
        //set tier

        //set points based on level
        skillpoints.points = Number(level)
        traitpoints.points = Math.floor(level/2)
        featpoints.points = Math.ceil(level/2)
        talentpoints.points = Number(level)

        //set if can be leveled
        for(const [key, type] of Object.entries(system.levelup)){
            if (type.invested < type.points){
                type.ready = true;
            }
        }
    }
    //There's probably a better way to do this, but should dynamically update thresholds based on stats
    setThresholds(system){
        const physique = system.thresholds.physique
        const avoidance = system.thresholds.avoidance
        const discipline = system.thresholds.discipline
        const traits = system.traits
        
        physique.body = traits.body.total
        physique.grace = traits.grace.total
        physique.total = physique.body + physique.grace + physique.bonus
        physique.difficulty = Math.ceil(physique.total / 3)

        avoidance.wits = traits.wits.total
        avoidance.luck = traits.luck.total
        avoidance.total = avoidance.wits + avoidance.luck + avoidance.bonus
        avoidance.difficulty = Math.ceil(avoidance.total / 3)

        discipline.mind = traits.mind.total
        discipline.soul = traits.soul.total
        discipline.total = discipline.mind + discipline.soul + discipline.bonus
        discipline.difficulty = Math.ceil(discipline.total / 3)
    }
}