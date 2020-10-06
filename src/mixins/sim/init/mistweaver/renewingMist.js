/* eslint-disable */
export default {
    data() {
        return {
        }
    },
    methods: {
        healFuncRM() {
            return function(stats,target,healMod,hots,mistwrap) {
                if (this.cooldown>=this.maxCooldown) {
                    //config
                    let rmHeal = 2.25
                    let rmDuration = 20

                    //init
                    let crit1;
                    let returnData = {type:"heal",manaUsed: 0, healingToTargets: [], gcd: 0, runAfterHeal: function () {return 0}, hotData: 0, name: ""}
                    stats.int = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //return data
                    returnData.name = this.name
                    returnData.manaUsed = this.manaCost
                    returnData.gcd = this.timeCast / (1 + (stats.haste / 100))

                    //-------heal-------
                    crit1 = this.critChance(stats.crit)
                    let mainHeal = (((stats.int * (stats.mastery / 100)) * (+(hots["Essence Font"].includes(target[0])) + 1)) * crit1)

                    returnData.healingToTargets = [{id: target[0], heal: mainHeal}]

                    returnData.hotData = {heal: (stats.int * rmHeal), duration: rmDuration, maxDuration: rmDuration, name: "Renewing Mist"}

                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}