export default class charactersheet extends foundry.appv1.sheets.ActorSheet {
    get template ()  {
        return "systems/atlara/templates/sheets/character-sheet.html";
    }
    activateListeners(html)
    {
        super.activateListeners(html);
        html.find(".inventory").on("drop", this.drop.bind(this))
        html.find(".skillroll").on("click", this.skillroll.bind(this))
        html.find(".equip-toggle").on("click", this.equipToggle.bind(this))
        html.find(".display-item").on("click", this.displayItem.bind(this))
    }
    getBonus(skill)
    {
        let bonus = 0
        for( const item of this.actor.items){
            if(item.system.equipped){
                bonus = bonus + Number(item.system.stats[skill].tier)
            }
        }
        console.log(bonus)
        return(bonus)
    }
    async drop(event)
    {
        event.preventDefault();

    }
    async skillroll(event)
    {
        event.preventDefault();
        const skill = event.currentTarget.dataset.skill;
        const trait = this.actor.system.skills[skill].trait;
        if(this.actor.system.skills[skill].difficulty < 1) {
            this.actor.system.skills[skill].difficulty = 1;
        };
        const die = this.actor.system.skills[skill].die;
        let bonus = this.getBonus(skill);
        const difficulty = this.actor.system.skills[skill].difficulty;
        const calc = this.actor.system.traits[trait].base + "d" + die + "x";
        const roll = await new Roll(calc).evaluate();
        const result = roll.dice[0].results;
        let successes = 0;
        for (const r of result){
            if(r.result >= 4){
                successes++;
            }
        };
        if (bonus < -3){
            bonus = -3
        }
        if (bonus > 3){
            bonus = 3
        }
        let degrees = Math.floor(successes/Math.max(difficulty - bonus, 1));
        const html = await renderTemplate(
            "systems/atlara/templates/chat/skill-roll.hbs",
            {
                skill,
                results: result.map(r => ({
                    result: r.result,
                    success: r.result >= 4,
                    exploded: r.exploded
                })),
                successes,
                degrees,
                difficulty,
                bonus: Math.abs(bonus),
                bonuspos: bonus > 0,
                bonusneg: bonus < 0,
                calc: calc.slice(0, -1),
                explosions: result.filter(r => r.exploded).length
            }
        );
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: this.actor}),
            content: html,
            sound: CONFIG.sounds.dice
        });
    }
    async equipToggle(event)
    {
        event.preventDefault();
        console.log(event.currentTarget.dataset.item);
        const item = this.actor.items.get(event.currentTarget.dataset.item);
        const toggle = !item.system.equipped
        console.log(toggle)
        await item.update({
            "system.equipped": toggle
        });
    }
    async displayItem(event)
    {
        event.preventDefault();
        this.actor.items.get(event.currentTarget.dataset.item).sheet.render(true);
    }
}