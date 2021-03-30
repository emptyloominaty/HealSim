/* eslint-disable */

export default {
    methods: {
        useAbility(healList,damageList) {
            if (this.usedAbility!==0) {
                //ManaTea
                if (this.character.buffs2.manaTea>0) {
                    this.usedAbility.manaUsed=this.usedAbility.manaUsed/2
                }
                this.manaUsed += this.usedAbility.manaUsed
                this.character.mana -= this.usedAbility.manaUsed

                //------------------------------------------------
                let targets = [];
                if (this.usedAbility.type === "heal") {
                    for (let i = 0; i < this.usedAbility.healingToTargets[0].length; i++) {
                        targets.push(this.usedAbility.healingToTargets[0][i].id)
                    }
                } else if (this.usedAbility.type === "damage") {
                    targets.push(this.usedAbility.damageToTargets[0][0].id)
                    //targets=["Enemy"]
                }
                this.db.push("Casted: <b style=\"color:#4fff61\">"+this.usedAbility.name +"</b> ----- Target: <b style=\"color:#ff000f\">"+ targets +"</b>")
                //------------------------------------------------
                if (this.usedAbility.type === "heal") {//----------------------------------------------------------------------------------------------------------Heal
                    // hot
                    if (this.usedAbility.hotData !== 0) {
                            for (let hots = 0; hots<this.usedAbility.hotData.length; hots++) {
                            if (this.usedAbility.hotData[hots].targetID===undefined) { this.usedAbility.hotData[hots].targetID = Math.floor(Math.random()*this.friendlyTargets.length) }
                                //apply hot
                                let ripHot = this.targets[this.usedAbility.hotData[hots].targetID].applyHot(this.usedAbility.hotData[hots].data)
                                //ONLY IF CAN JUMP(not rem jump!)
                                if (this.usedAbility.hotData[hots].canJump===1) {
                                    let loops = 0
                                    while (ripHot !== 0 && loops<50) {
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
                                            ripHot = this.targets[canHot[Math.floor(Math.random()*canHot.length)]].applyHot(ripHot)
                                        }
                                        loops++
                                    }
                                }
                            }
                    }
                    //heal
                    for (let i = 0; i < this.usedAbility.healingToTargets.length; i++) {
                        for (let j = 0; j < this.usedAbility.healingToTargets[i].length; j++) {

                            if (this.usedAbility.healingToTargets[i][j].id===undefined || isNaN(this.usedAbility.healingToTargets[i][j].id)) {
                                this.usedAbility.healingToTargets[i][j].id = Math.floor(Math.random()*this.friendlyTargets.length)
                            }

                            let healing = this.usedAbility.healingToTargets[i][j].heal * (1 + this.targets[this.usedAbility.healingToTargets[i][j].id].healingBonus)

                            this.doHealing(healing,this.usedAbility.name,this.usedAbility.healingToTargets[i][j].id,"healer",0)
                        }
                    }
                } else if (this.usedAbility.type === "damage") { //----------------------------------------------------------------------------------------------------------Damage
                    //deal damage
                    for (let i = 0; i < this.usedAbility.damageToTargets.length; i++) {
                        for (let j = 0; j < this.usedAbility.damageToTargets[i].length; j++) {
                            let damage = Math.floor(this.usedAbility.damageToTargets[i][j].damage)
                            let targetx=this.usedAbility.damageToTargets[i][j].id
                            this.doDamage(damage,this.usedAbility.name,targetx,"healer")
                        }
                    } //TODO: DOT


                } else if (this.usedAbility.type === "other") {//----------------------------------------------------------------------------------------------------------Other
                        if (this.usedAbility.type2 !== "other") {
                        } else {
                            //DONT DO ANYTHING
                        }
                }




            //buffs + dispell + mw mastery
            if(this.usedAbility.runAfter!==0) {
                let runAfter = this.usedAbility.runAfter
                for (let i=0; i<runAfter.length; i++) {
                    if (runAfter[i] === "absorb") {
                        for (let t=0; t<runAfter[i+2].length; t++) {
                                this.targets[runAfter[i+2][t]].applyBuff({type:"absorb",maxAmount:runAfter[i+1] , amount:runAfter[i+1], duration:runAfter[i+3] })
                        }
                    } else if (runAfter[i] === "heal") {
                        for (let t=0; t<runAfter[i+2].length; t++) {
                            this.doHealing(runAfter[i+1],runAfter[i+3],runAfter[i+2][t],"healer",0)
                        }
                    } else if (runAfter[i] === "resetCooldown") { //TODO:FIX THIS PLS
                        for (let t=0; t<this.damages.length; t++) {
                            if (runAfter[i+1]===this.damages[t].name) {
                                this.damages[t].cooldown=this.damages[t].maxCooldown
                            }
                        }
                    } else if (runAfter[i] === "resetCooldownHeal") { //TODO:FIX THIS PLS
                        for (let t=0; t<this.heals.length; t++) {
                            if (runAfter[i+1]===this.heals[t].name) {
                                this.heals[t].cooldown=this.heals[t].maxCooldown
                            }
                        }
                    } else if (runAfter[i] === "reduceCooldown") { //TODO:FIX THIS PLS
                        for (let t=0; t<this.heals.length; t++) {
                            if (runAfter[i+1]===this.heals[t].name) {
                                this.heals[t].cooldown+=runAfter[i+2]
                            }
                        }
                    }

                    else if (runAfter[i] === "castHeal") {
                        let castedHeal = this.heals[healList[runAfter[i+1]]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
                        //heal
                        for (let k = 0; k < castedHeal.healingToTargets.length; k++) {
                            for (let j = 0; j < castedHeal.healingToTargets[k].length; j++) {
                                let healing = castedHeal.healingToTargets[k][j].heal  * (1+this.targets[castedHeal.healingToTargets[k][j].id].healingBonus)

                                this.doHealing(healing,castedHeal.name,castedHeal.healingToTargets[k][j].id,"healer",0)
                            }
                        }
                    }

                }
            }
            }


        }
    }
}