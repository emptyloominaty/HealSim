/* eslint-disable */
export default {
    methods: {
        healFuncRJW() {
            return function(stats,target,healMod,hots,targets) {
                if (this.cooldown>=this.maxCooldown && this.talents.refreshingJadeWind===1) {

                    //config
                    let rjwHeal = 0.116
                    let rjwtargets = 6
                    let rjwDuration = 9 / (1 + (stats.haste/100))


                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [[]], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfterHeal: 0, hotData: [], name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------
                    let mainHeal = (spellpower * rjwHeal)*13


                    returnData.healingToTargets[0].push({id: targets[0], heal: 0})

                    for (let h = 0; h<rjwtargets; h++) {
                            let healed = (Math.floor(Math.random()*targets.length))
                            if (healed<0) {healed=Math.floor(Math.random()*4)}
                            //heal
                            crit = this.critChance(stats.crit)
                            //hot
                            returnData.hotData.push({targetID:targets[healed],canJump:1,data:{heal: mainHeal, duration: rjwDuration, maxDuration: rjwDuration, name: "Refreshing Jade Wind"}})
                    }

                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}