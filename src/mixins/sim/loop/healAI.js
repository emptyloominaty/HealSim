/* eslint-disable */

export default {
    methods: {
        healAi(healList,damageList,fightLength,fl,infiniteHp,storeClassData) {
            let usedAbility = 0
            let randomTarget = Math.floor(Math.random()*this.friendlyTargets.length)

            let manaTarget = 100-((fightLength/100)*(fl/(fightLength/100)))/(fightLength/100)
            let bHealth = this.targets[this.enemyTargets[0]].health
            let bMaxHealth = this.targets[this.enemyTargets[0]].maxHealth
            let mHealth = bMaxHealth-bHealth

            if (infiniteHp===0 && ((fl/fightLength)*100)<(mHealth/bMaxHealth)*100) {
                manaTarget = 100-((bMaxHealth/100)*(mHealth/(bMaxHealth/100)))/(bMaxHealth/100)
            }

            let mana = this.character.mana
            let rems = this.hotsData["Renewing Mist"].length
            if (this.character.buffs2.manaTea>0) {
                manaTarget = manaTarget/1.65
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
                    if (missingHealth > mostInjuredTarget.healthMissing && this.targets[i].health!==0) {
                        mostInjuredTarget.id = i
                        mostInjuredTarget.healthMissing = missingHealth
                    }
                }
            }
            let raidMissingHealthPercent = raidMissingHealth/totalRaidHealth
            this.raidHealth = totalRaidHealth - raidMissingHealth

            if (infiniteHp===0) {
                if (raidMissingHealthPercent> 0.5) {
                    manaTarget = manaTarget/1.1
                }
                if (raidMissingHealthPercent> 0.2) {
                    manaTarget = manaTarget/1.1
                }
                if (raidMissingHealthPercent> 0.4) {
                    manaTarget = manaTarget/1.2
                }
            }


            //get lowest hp (+ not dead) Enemy Target
            let fistThisTarget = this.enemyTargets[0]

            let enemyCount = this.enemyTargets.length
            if (enemyCount>1) {
                let enemyHealthArr = []
                for (let i = 0; i<enemyCount; i++) {
                    let enemyHealth = this.targets[this.enemyTargets[i]].health
                    enemyHealthArr.push(enemyHealth)
                }

                let minHealth = Math.min.apply(null, enemyHealthArr.filter(Boolean))
                let targetID = enemyHealthArr.indexOf(minHealth)

                fistThisTarget = this.enemyTargets[targetID]
            }



            /* if (usedAbility===0) { //Life Cocoon
                usedAbility = this.heals[healList["Life Cocoon"]].healFunc(this.character, [1], 0, this.hotsData, this.injuredTargets, this.targets[this.character.target])
            }*/


            if (usedAbility===0) { //Thunder Focus Tea
                if (storeClassData.useTftOn==="random") {
                    usedAbility = this.heals[healList["Thunder Focus Tea"]].healFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,this.targets,this.friendlyTargets)
                } else if (storeClassData.useTftOn==="rem" && this.heals[healList["Renewing Mist"]].charges > 0) {
                    usedAbility = this.heals[healList["Thunder Focus Tea"]].healFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,this.targets,this.friendlyTargets)
                } else if (storeClassData.useTftOn==="rsk" && this.damages[damageList["Rising Sun Kick"]].cooldown>=this.damages[damageList["Rising Sun Kick"]].maxCooldown) {
                    usedAbility = this.heals[healList["Thunder Focus Tea"]].healFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,this.targets,this.friendlyTargets)
                }
            }

            if (usedAbility===0 && this.heals[healList["Renewing Mist"]].charges > 1) { //Renewing Mist (2 Charges)
                usedAbility = this.heals[healList["Renewing Mist"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && this.character.talents.risingMist===1) { //Rising Sun Kick
                usedAbility = this.damages[damageList["Rising Sun Kick"]].dmgFunc(this.character, [fistThisTarget], 0, this.hotsData, this.enemyTargets, this.targets,mostInjuredTarget.id)
            }

            if (usedAbility===0) { //Renewing Mist (1 Charge)
                usedAbility = this.heals[healList["Renewing Mist"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && this.character.talents.risingMist===0 && this.character.buffs2.ancientTeachingOfTheMonastery>0) { //Rising Sun Kick
                usedAbility = this.damages[damageList["Rising Sun Kick"]].dmgFunc(this.character, [fistThisTarget], 0, this.hotsData, this.enemyTargets, this.targets,mostInjuredTarget.id)
            }

            if (usedAbility===0) { //Kyrian Covenant
                usedAbility = this.heals[healList["Weapons of Order Activate"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0) { //Night Fae Covenant
                usedAbility = this.damages[damageList["Faeline Stomp"]].dmgFunc(this.character, [0], 0, this.hotsData, this.enemyTargets,this.friendlyTargets)
            }

            if (usedAbility===0) { //Necrolord Covenant
                usedAbility = this.heals[healList["Bonedust Brew"]].healFunc(this.character, [0], 0, this.hotsData, this.friendlyTargets,this.enemyTargets)
            }

            if (usedAbility===0) { //Venthyr Covenant
                usedAbility = this.damages[damageList["Fallen Order"]].dmgFunc(this.character, [0], 0, this.hotsData, this.enemyTargets, this.friendlyTargets)
            }

            if (usedAbility===0) { //Mana Potion
                usedAbility = this.heals[healList["Mana Potion"]].healFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget/1.35 < mana && rems > 5 && raidMissingHealthPercent > 0.02) { //Vivify
                usedAbility = this.heals[healList["Vivify"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets,this.targets)
            }

            if (usedAbility===0 && storeClassData.useCds===1 && canHeal > 0 && raidMissingHealthPercent > 0.05) { //Revival
                usedAbility = this.heals[healList["Revival"]].healFunc(this.character, this.friendlyTargets, 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0  && canHeal > 0 && this.character.buffs2.chiJiEnveloping>2) { //Enveloping Mist
                usedAbility = this.heals[healList["Enveloping Mist"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets,this.targets)
            }

            if (usedAbility===0 && storeClassData.useManaTea===1 && canHeal > 0 && this.time>25 && raidMissingHealthPercent > 0.15) { //Mana Tea
                usedAbility = this.heals[healList["Mana Tea"]].healFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,)
            }

            if (usedAbility===0 && storeClassData.useCds===1  && canHeal > 0 && raidMissingHealthPercent > 0.02) { //Yu'Lon
                usedAbility = this.heals[healList["Yu'lon"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && storeClassData.useCds===1  && canHeal > 0 && raidMissingHealthPercent > 0.02) { //Chi Ji
                usedAbility = this.heals[healList["Chi-Ji Activate"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0  && manaTarget/1.05 < mana && this.character.buffs2.chiJi===0) { //Refreshing Jade Wind
                usedAbility = this.heals[healList["Refreshing Jade Wind"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && this.character.legendaries.ancientTeachingOfTheMonastery===1 && this.character.buffs2.ancientTeachingOfTheMonastery<1 && this.character.talents.upwelling===0 && manaTarget/1.5 < mana && this.hotsData["Essence Font"].length===0 && raidMissingHealthPercent > 0.05 && this.character.buffs2.chiJi===0  ) {
                usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && this.character.talents.upwelling===0 && manaTarget/1.05 < mana && this.hotsData["Essence Font"].length===0 && raidMissingHealthPercent > 0.05 && this.character.buffs2.chiJi===0  ) {
                usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget/1.2 < mana && this.heals[healList["Essence Font"]].spec.upwellingStacks > 17  && raidMissingHealthPercent > 0.02) { //Essence Font
                usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }


            if (usedAbility===0 && canHeal > 0 && manaTarget/1.1 < mana && this.heals[healList["Essence Font"]].spec.upwellingStacks > 16  && raidMissingHealthPercent > 0.02) { //Essence Font
                usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget/1.1 < mana && this.character.legendaries.tearOfMorning===1 && this.character.talents.upwelling===0 && raidMissingHealthPercent > 0.02) { //Enveloping Mist
                usedAbility = this.heals[healList["Enveloping Mist"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets,this.targets)
            }

            if (usedAbility===0 && canHeal > 0 && this.character.talents.jadeStatue===1) { //Soothing Mist
                usedAbility = this.heals[healList["Soothing Mist"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget < mana && rems > 4 && raidMissingHealthPercent > 0.03 && this.character.buffs2.chiJi===0) { //Vivify
                usedAbility = this.heals[healList["Vivify"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets,this.targets)
            }

            if (usedAbility===0 && canHeal > 0 && raidMissingHealthPercent > 0.01 && this.character.buffs2.chiJi===0) { //Chi Burst
                usedAbility = this.damages[damageList["Chi Burst"]].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData, this.enemyTargets,this.friendlyTargets)
            }

            if (usedAbility===0 && canHeal > 0  && this.character.buffs2.chiJiEnveloping>1 && manaTarget*1.05 < mana && raidMissingHealthPercent > 0.03) { //Enveloping Mist
                usedAbility = this.heals[healList["Enveloping Mist"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets,this.targets)
            }

            if (usedAbility===0 && canHeal > 0 && this.character.buffs2.yuLon>0 && this.hotsData["Enveloping Breath"].length===0 && raidMissingHealthPercent > 0.02) { //Enveloping Mist
                usedAbility = this.heals[healList["Enveloping Mist"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets,this.targets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget/1.05 < mana && this.heals[healList["Essence Font"]].spec.upwellingStacks > 12  && raidMissingHealthPercent > 0.02 && this.character.buffs2.chiJi===0) { //Essence Font
                usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget*1.2 < mana && this.heals[healList["Essence Font"]].spec.upwellingStacks > 6  && raidMissingHealthPercent > 0.04 && this.character.buffs2.chiJi===0) { //Essence Font
                usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets)
            }


            if (usedAbility===0 && canHeal > 0 && manaTarget*1.6 < mana && raidMissingHealthPercent > 0.05 && this.character.buffs2.chiJi===0) { //Essence Font
                usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget*1.15 < mana && rems > 3 && raidMissingHealthPercent > 0.04 && this.character.buffs2.chiJi===0) { //Vivify
                usedAbility = this.heals[ healList["Vivify"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets,this.targets)
            }

            if (usedAbility===0 && canHeal > 0 && manaTarget*1.4 < mana && rems > 2 && raidMissingHealthPercent > 0.02 && this.character.buffs2.chiJi===0) { //Vivify
                usedAbility = this.heals[ healList["Vivify"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets,this.targets)
            }

            if (usedAbility===0 && this.character.talents.risingMist===0 && manaTarget*1.3 < mana) { //Rising Sun Kick
                usedAbility = this.damages[damageList["Rising Sun Kick"]].dmgFunc(this.character, [fistThisTarget], 0, this.hotsData, this.enemyTargets, this.targets,mostInjuredTarget.id)
            }

            if (usedAbility===0 && (this.damages[damageList["Rising Sun Kick"]].cooldown<10 || this.damages[damageList["Rising Sun Kick"]].cooldown>=12)) { //Blackout Kick
                usedAbility = this.damages[damageList["Blackout Kick"]].dmgFunc(this.character, [fistThisTarget], 0, this.hotsData,this.enemyTargets,mostInjuredTarget.id)
            }

            if (usedAbility===0 && this.character.talents.risingMist===0) { //Blackout Kick
                usedAbility = this.damages[damageList["Blackout Kick"]].dmgFunc(this.character, [fistThisTarget], 0, this.hotsData,this.enemyTargets,mostInjuredTarget.id)
            }

          /*  if (usedAbility===0 && canHeal > 0 && manaTarget*1.6 < mana && rems > 1 && raidMissingHealthPercent > 0.2 && this.character.buffs2.chiJi===0) { //Vivify
                usedAbility = this.heals[healList["Vivify"]].healFunc(this.character, [mostInjuredTarget.id], 0, this.hotsData, this.injuredTargets,this.targets)
            }*/

            if (usedAbility===0) { //Tiger Palm
                usedAbility = this.damages[damageList["Tiger Palm"]].dmgFunc(this.character, [fistThisTarget], 0, this.hotsData,this.enemyTargets,mostInjuredTarget.id)
            }

            return usedAbility
        }
    }
}