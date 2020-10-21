/* eslint-disable */

export default {
    methods: {
        healAi(healList,damageList,fightLength,fl) {
            let usedAbility = 0
            //TEST TEST TEST TEST
            let randomTarget = Math.floor(Math.random()*this.friendlyTargets.length)
            let manaTarget = 100-((fightLength/100)*(fl/(fightLength/100)))/(fightLength/100)
            let mana = this.character.mana
            let rems = this.hotsData["Renewing Mist"].length
            if (this.character.buffs2.manaTea>0) {
                manaTarget = manaTarget/2
            }
            let canHeal = this.injuredTargets.length
                 let raidMissingHealth = 0
            let totalRaidHealth = 0
            let mostInjuredTarget = {id:0, healthMissing:0}

            for (let i = 0; i<this.targets.length; i++) {
                if (this.targets[i].type==="friendly") {
                    let missingHealth = this.targets[i].maxHealth - this.targets[i].health
                    raidMissingHealth += missingHealth
                    totalRaidHealth += this.targets[i].maxHealth
                    if (missingHealth > mostInjuredTarget.healthMissing) {
                        mostInjuredTarget.id = i
                        mostInjuredTarget.healthMissing = missingHealth
                    }
                }
            }



            /* if (usedAbility===0) { //Life Cocoon
                usedAbility = this.heals[healList["Life Cocoon"]].healFunc(this.character, [1], 0, this.hotsData, this.injuredTargets, this.targets[this.character.target])
            }*/


            if (usedAbility===0) { //Thunder Focus Tea
                usedAbility = this.heals[healList["Thunder Focus Tea"]].healFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,)
            }


            if (usedAbility===0) { //Renewing Mist
                usedAbility = this.heals[healList["Renewing Mist"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }


            if (usedAbility===0 && this.character.talents.upwelling===0) { //Rising Sun Kick
                usedAbility = this.damages[damageList["Rising Sun Kick"]].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData, this.enemyTargets, this.targets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget/1.35 < mana && rems > 5 ) { //Vivify
                usedAbility = this.heals[healList["Vivify"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 ) { //Revival
                usedAbility = this.heals[healList["Revival"]].healFunc(this.character, this.friendlyTargets, 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0  && canHeal > 0 && this.character.buffs2.chiJiEnveloping>2) { //Enveloping Mist
                usedAbility = this.heals[healList["Enveloping Mist"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && this.time>25) { //Mana Tea
                usedAbility = this.heals[healList["Mana Tea"]].healFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,)
            }

            if (usedAbility===0 && canHeal > 0 ) { //Yu'Lon
                usedAbility = this.heals[healList["Yu'lon"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 ) { //Chi Ji
                usedAbility = this.heals[healList["Chi-Ji Activate"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0  && manaTarget/1.05 < mana ) { //Refreshing Jade Wind
                usedAbility = this.heals[healList["Refreshing Jade Wind"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget/1.2 < mana && this.heals[healList["Essence Font"]].spec.upwellingStacks > 17  ) { //Essence Font
                usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget/1.1 < mana && this.heals[healList["Essence Font"]].spec.upwellingStacks > 16  ) { //Essence Font
                usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && this.character.talents.jadeStatue===1) { //Soothing Mist
                usedAbility = this.heals[healList["Soothing Mist"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }


            if (usedAbility===0 && canHeal > 0 && manaTarget < mana && rems > 4) { //Vivify
                usedAbility = this.heals[healList["Vivify"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 ) { //Chi Burst
                usedAbility = this.damages[damageList["Chi Burst"]].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData, this.enemyTargets,this.friendlyTargets)
            }

            if (usedAbility===0 && canHeal > 0  && this.character.buffs2.chiJiEnveloping>1 && manaTarget*1.05 < mana ) { //Enveloping Mist
                usedAbility = this.heals[healList["Enveloping Mist"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && this.character.buffs2.yuLon>0 && this.hotsData["Enveloping Breath"].length===0 ) { //Enveloping Mist
                usedAbility = this.heals[healList["Enveloping Mist"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget/1.05 < mana && this.heals[healList["Essence Font"]].spec.upwellingStacks > 12  ) { //Essence Font
                usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget*1.02 < mana && this.heals[healList["Essence Font"]].spec.upwellingStacks > 6  ) { //Essence Font
                usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget*1.05 < mana && rems > 3) { //Vivify
                usedAbility = this.heals[ healList["Vivify"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget*1.075 < mana ) { //Essence Font
                usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }


            if (usedAbility===0 && canHeal > 0 && manaTarget*1.3 < mana && rems > 2) { //Vivify
                usedAbility = this.heals[ healList["Vivify"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }


            if (usedAbility===0 && this.character.talents.upwelling===1) { //Rising Sun Kick
                usedAbility = this.damages[damageList["Rising Sun Kick"]].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData, this.enemyTargets, this.targets)
            }


            if (usedAbility===0 && this.damages[damageList["Rising Sun Kick"]].cooldown<9.5) { //Blackout Kick
                usedAbility = this.damages[damageList["Blackout Kick"]].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,this.enemyTargets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget*1.3 < mana && rems > 1) { //Vivify
                usedAbility = this.heals[healList["Vivify"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0) { //Tiger Palm
                usedAbility = this.damages[damageList["Tiger Palm"]].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,this.enemyTargets)
            }


            //TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST
















            return usedAbility
        }
    }
}