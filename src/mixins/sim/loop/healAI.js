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
            this.usedAbility = this.heals[healList["Renewing Mist"]].healFunc(this.character, [randomTarget], 0, this.hotsData, this.injuredTargets)
            
            if (this.usedAbility===0) { //Life Cocoon
                this.usedAbility = this.heals[healList["Life Cocoon"]].healFunc(this.character, [1], 0, this.hotsData, this.injuredTargets, this.targets[this.character.target])
            }

            if (this.usedAbility===0) { //Revival
                this.usedAbility = this.heals[healList["Revival"]].healFunc(this.character, this.friendlyTargets, 0, this.hotsData, this.injuredTargets)
            }

            if (this.usedAbility===0) { //Mana Tea
                this.usedAbility = this.heals[healList["Mana Tea"]].healFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,)
            }

            if (this.usedAbility===0) { //Refreshing Jade Wind
                this.usedAbility = this.heals[healList["Refreshing Jade Wind"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (this.usedAbility===0) { //Yu'Lon
                this.usedAbility = this.heals[healList["Yu'lon"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (this.usedAbility===0) { //Chi Ji
                this.usedAbility = this.heals[healList["Chi-Ji Activate"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            if (this.usedAbility===0) { //Thunder Focus Tea
                this.usedAbility = this.heals[healList["Thunder Focus Tea"]].healFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,)
            }

            if (this.usedAbility===0) { //Rising Sun Kick
                this.usedAbility = this.damages[damageList["Rising Sun Kick"]].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData, this.enemyTargets, this.targets)
            }

            if (this.usedAbility===0) { //Chi Burst
                this.usedAbility = this.damages[damageList["Chi Burst"]].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData, this.enemyTargets,this.friendlyTargets)
            }


            /*if (this.usedAbility===0) { //Soothing Mist
                this.usedAbility = this.heals[ healList["Soothing Mist"] ].healFunc(this.character.stats, [randomTarget], 0, this.hotsData, this.injuredTargets)
            }*/


            if (this.usedAbility===0) { //Essence Font
                this.usedAbility = this.heals[healList["Essence Font"]].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
            }

            /*
                            if (this.usedAbility===0) { //Blackout Kick
                                this.usedAbility = this.damages[ damageList["Blackout Kick"] ].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,this.enemyTargets)
                            }


                            if (this.usedAbility===0) { //Tiger Palm
                                this.usedAbility = this.damages[ damageList["Tiger Palm"] ].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,this.enemyTargets)
                            }

            if (this.usedAbility===0) { //Enveloping Mist
                this.usedAbility = this.heals[ healList["Enveloping Mist"] ].healFunc(this.character, [1], 0, this.hotsData, this.injuredTargets)
            }
            */
            if (this.usedAbility===0) { //Vivify
                this.usedAbility = this.heals[ healList["Vivify"] ].healFunc(this.character, [1], 0, this.hotsData, this.injuredTargets)
            }
            //TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST
















            return usedAbility
        }
    }
}