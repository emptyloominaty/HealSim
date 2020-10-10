/* eslint-disable */

export default {
    methods: {
        useAbility() {
            if (this.usedAbility!==0) {
                this.db.push("Casted: <b style=\"color:#4fff61\">"+this.usedAbility.name +"</b>")
                if (this.usedAbility.type === "heal") {
                    // hot
                    if (this.usedAbility.hotData !== 0) {
                        let ripHot =  this.targets[this.usedAbility.healingToTargets[0][0].id].applyHot(this.usedAbility.hotData)
                        if (ripHot!==0) {
                            if (this.injuredTargets.length>0) {
                                let canHot = []
                                for(let t=0 ; t<this.injuredTargets.length; t++) {
                                    for(let h=0 ; h<this.targets[this.injuredTargets[t]].hots.length; h++) {
                                        if (this.targets[this.injuredTargets[t]].hots[h].name !== this.usedAbility.hotData.name) {
                                            canHot.push(this.injuredTargets[t])
                                        }
                                    }
                                    if (this.targets[this.injuredTargets[t]].hots.length===0) {
                                        canHot.push(this.injuredTargets[t])
                                    }
                                }
                                this.targets[canHot[0]].applyHot(ripHot)
                            }
                        }
                    }
                    for (let i = 0; i < this.usedAbility.healingToTargets.length; i++) {
                        for (let j = 0; j < this.usedAbility.healingToTargets[i].length; j++) {
                            let healing = this.usedAbility.healingToTargets[i][j].heal
                            this.overhealingDone += this.targets[this.usedAbility.healingToTargets[i][j].id].heal(healing)
                            this.healingDone += healing
                        }
                    }
                } else if (this.usedAbility.type === "damage") {

                } else if (this.usedAbility.type === "ability") {

                }

            //buffs + dispell
            if(this.usedAbility.runAfterHeal!==0) {
                let runAfterHeal = this.usedAbility.runAfterHeal()
                for (let i=0; i<runAfterHeal.length; i++) {
                    if (runAfterHeal[i] === "absorb") { //TODO: FIX? length?
                        for (let t=0; t<runAfterHeal[i+2].length; t++) {
                                this.targets[runAfterHeal[i+2][t]].applyBuff({type:"absorb",maxAmount:runAfterHeal[i+1] , amount:runAfterHeal[i+1], duration:runAfterHeal[i+3] })
                        }
                    }
                }




            }

                this.manaUsed += this.usedAbility.manaUsed
                this.character.mana -= this.usedAbility.manaUsed
            } else {
                console.log("Rip") //TODO
            }


        }
    }
}