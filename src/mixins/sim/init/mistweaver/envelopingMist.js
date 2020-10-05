/* eslint-disable */
export default {
    data() {
        return {
        }
    },
    methods: {
        healFuncEm() {
            return function(stats,target,healMod,hots,mistwrap) {
                if (this.cooldown>=this.maxCooldown) {
                    //config
                    let emHeal = 3.60 //360% sp
                    let emDuration = 6

                    if (mistwrap===1) {
                        emDuration = 7
                    }

                    //init
                    let crit1;
                    let returnData = {manaUsed: 0, healingToTargets: [], gcd: 0, runAfterHeal: function () {return 0}, hotData: 0, name: ""}
                    stats.int = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //return data
                    returnData.name = this.name
                    returnData.manaUsed = this.manaCost
                    returnData.gcd = this.timeCast / (1 + (stats.haste / 100))

                    //-------heal-------
                    crit1 = this.critChance(stats.crit)
                    let mainHeal = (((stats.int * (stats.mastery / 100)) * (+(hots["Essence Font"].includes(target[0])) + 1)) * crit1)

                    returnData.healingToTargets = [{id: target[0], heal: mainHeal}]

                    returnData.hotData = {heal: (stats.int * emHeal), duration: emDuration, maxDuration: emDuration, name: "Enveloping Mist"}

                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}