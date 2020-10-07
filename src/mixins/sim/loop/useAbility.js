/* eslint-disable */

export default {
    methods: {
        useAbility() {
            if (this.usedAbility.type === "heal") {
                // hot
                if (this.usedAbility.hotData !== 0) {
                    this.targets[this.usedAbility.healingToTargets[0][0].id].applyHot(this.usedAbility.hotData)
                }
                // heal
                for(let i = 0; i < this.usedAbility.healingToTargets.length; i++)  {
                    for(let j = 0; j < this.usedAbility.healingToTargets[i].length; j++) {
                        let healing = this.usedAbility.healingToTargets[i][j].heal
                        this.targets[this.usedAbility.healingToTargets[i][j].id].heal(healing)
                        this.healingDone += healing
                    }
                }
            } else if (this.usedAbility.type === "damage") {

            } else if (this.usedAbility.type === "ability") {

            }
            this.manaUsed+=this.usedAbility.manaUsed
            this.character.mana-=this.usedAbility.manaUsed
        }
    }
}