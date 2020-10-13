/* eslint-disable */

export default {
    methods: {
        useAbility() {
            if (this.usedAbility!==0) {

                let targets = [];
                for(let i = 0; i<this.usedAbility.healingToTargets[0].length; i++) {
                    targets.push(this.usedAbility.healingToTargets[0][i].id)
                }
                this.db.push("Casted: <b style=\"color:#4fff61\">"+this.usedAbility.name +"</b> ----- Target: <b style=\"color:#ff000f\">"+ targets +"</b>")


                if (this.usedAbility.type === "heal") {
                    // hot
                    if (this.usedAbility.hotData !== 0) {                    //ALWAYS MULTI TARGET???????
                        //MULTI TARGET HOT
                        if (Array.isArray(this.usedAbility.hotData)) {
                            for (let hots = 0; hots<this.usedAbility.hotData.length; hots++) {
                                let ripHot = this.targets[this.usedAbility.hotData[hots].targetID].applyHot(this.usedAbility.hotData[hots].data)

                                //ONLY IF CAN JUMP(not rem jump!)
                                if (this.usedAbility.hotData[hots].canJump) {
                                    if (ripHot !== 0) {
                                        if (this.injuredTargets.length > 0) {
                                            let canHot = []
                                            for (let t = 0; t < this.injuredTargets.length; t++) {
                                                for (let h = 0; h < this.targets[this.injuredTargets[t]].hots.length; h++) {
                                                    if (this.targets[this.injuredTargets[t]].hots[h].name !== this.usedAbility.hotData.name) {
                                                        canHot.push(this.injuredTargets[t])
                                                    }
                                                }
                                                if (this.targets[this.injuredTargets[t]].hots.length === 0) {
                                                    canHot.push(this.injuredTargets[t])
                                                }
                                            }
                                            this.targets[canHot[0]].applyHot(ripHot)
                                        }
                                    }
                                }
                            }

                        } else {
                            // SINGLE TARGET HOT
                            let ripHot = this.targets[this.usedAbility.healingToTargets[0][0].id].applyHot(this.usedAbility.hotData)
                            if (ripHot !== 0) {
                                if (this.injuredTargets.length > 0) {
                                    let canHot = []
                                    for (let t = 0; t < this.injuredTargets.length; t++) {
                                        for (let h = 0; h < this.targets[this.injuredTargets[t]].hots.length; h++) {
                                            if (this.targets[this.injuredTargets[t]].hots[h].name !== this.usedAbility.hotData.name) {
                                                canHot.push(this.injuredTargets[t])
                                            }
                                        }
                                        if (this.targets[this.injuredTargets[t]].hots.length === 0) {
                                            canHot.push(this.injuredTargets[t])
                                        }
                                    }
                                    this.targets[canHot[0]].applyHot(ripHot)
                                }
                            }
                        }
                    }
                    //heal
                    for (let i = 0; i < this.usedAbility.healingToTargets.length; i++) {
                        for (let j = 0; j < this.usedAbility.healingToTargets[i].length; j++) {
                            let healing = this.usedAbility.healingToTargets[i][j].heal
                            this.overhealingDone += this.targets[this.usedAbility.healingToTargets[i][j].id].heal(healing)
                            this.healingDone += healing
                            this.healingDoneArr[this.usedAbility.name].push( {time: this.time, heal: Math.floor(this.usedAbility.healingToTargets[i][j].heal)})
                        }
                    }
                } else if (this.usedAbility.type === "damage") {

                } else if (this.usedAbility.type === "ability") {

                }

            //buffs + dispell + mw mastery
            if(this.usedAbility.runAfterHeal!==0) {
                let runAfterHeal = this.usedAbility.runAfterHeal()
                for (let i=0; i<runAfterHeal.length; i++) {
                    if (runAfterHeal[i] === "absorb") { //TODO: FIX? length?
                        for (let t=0; t<runAfterHeal[i+2].length; t++) {
                                this.targets[runAfterHeal[i+2][t]].applyBuff({type:"absorb",maxAmount:runAfterHeal[i+1] , amount:runAfterHeal[i+1], duration:runAfterHeal[i+3] })
                        }
                    } else if (runAfterHeal[i] === "heal") {
                        for (let t=0; t<runAfterHeal[i+2].length; t++) {
                            this.overhealingDone +=  this.targets[runAfterHeal[i+2][t]].heal(runAfterHeal[i+1])
                            this.healingDone += runAfterHeal[i+1]
                            this.healingDoneArr[runAfterHeal[i+3]].push( {time: this.time, heal:Math.floor(runAfterHeal[i+1]) } )
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