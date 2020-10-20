/* eslint-disable */

export default {
    methods: {
        healAi(healList,damageList) {
            let usedAbility = 0
            //TEST TEST TEST TEST
            let randomTarget = Math.floor(Math.random()*this.friendlyTargets.length)
            let manaTarget = 0
            let rems = this.hotsData["Renewing Mist"].length


            //Renewing Mist
            usedAbility = this.heals[healList["Renewing Mist"]].healFunc(this.character, [randomTarget], 0, this.hotsData, this.injuredTargets)

            if (usedAbility===0) { //Life Cocoon
                usedAbility = this.heals[healList["Life Cocoon"]].healFunc(this.character, [1], 0, this.hotsData, this.injuredTargets, this.targets[this.character.target])
            }

            if (usedAbility===0) { //Revival
                usedAbility = this.heals[healList["Revival"]].healFunc(this.character, this.friendlyTargets, 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0) { //Mana Tea
                usedAbility = this.heals[healList["Mana Tea"]].healFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,)
            }

            if (usedAbility===0) { //Refreshing Jade Wind
                usedAbility = this.heals[healList["Refreshing Jade Wind"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0) { //Yu'Lon
                usedAbility = this.heals[healList["Yu'lon"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0) { //Chi Ji
                usedAbility = this.heals[healList["Chi-Ji Activate"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (usedAbility===0) { //Thunder Focus Tea
                usedAbility = this.heals[healList["Thunder Focus Tea"]].healFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,)
            }

            if (usedAbility===0) { //Rising Sun Kick
                usedAbility = this.damages[damageList["Rising Sun Kick"]].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData, this.enemyTargets, this.targets)
            }

            if (usedAbility===0) { //Chi Burst
                usedAbility = this.damages[damageList["Chi Burst"]].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData, this.enemyTargets,this.friendlyTargets)
            }


            /*if (usedAbility===0) { //Soothing Mist
                usedAbility = this.heals[ healList["Soothing Mist"] ].healFunc(this.character.stats, [randomTarget], 0, this.hotsData, this.injuredTargets)
            }*/


            if (usedAbility===0) { //Essence Font
                usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            /*
                            if (usedAbility===0) { //Blackout Kick
                                usedAbility = this.damages[ damageList["Blackout Kick"] ].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,this.enemyTargets)
                            }


                            if (usedAbility===0) { //Tiger Palm
                                usedAbility = this.damages[ damageList["Tiger Palm"] ].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,this.enemyTargets)
                            }

            if (usedAbility===0) { //Enveloping Mist
                usedAbility = this.heals[ healList["Enveloping Mist"] ].healFunc(this.character, [1], 0, this.hotsData, this.injuredTargets)
            }
            */
            if (usedAbility===0) { //Vivify
                usedAbility = this.heals[ healList["Vivify"] ].healFunc(this.character, [1], 0, this.hotsData, this.injuredTargets)
            }
            //TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST
















            return usedAbility
        }
    }
}