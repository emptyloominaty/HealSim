/* eslint-disable */
export default {
    methods: {
        healFuncRM() {
            return function(stats,target,healMod,hots) {
                if (this.charges>0) {
                    //config
                    let rmHeal = 2.25
                    let rmDuration = 20

                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfterHeal: 0, hotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------
                    crit = this.critChance(stats.crit)
                    let mainHeal = (((spellpower * (stats.mastery / 100)) * (+(hots["Essence Font"].includes(target[0])) + 1)) * crit)

                    returnData.healingToTargets = [[{id: target[0], heal: 0}]]

                    returnData.hotData = {heal: (spellpower * rmHeal), canJump:1, scaleWithHaste: 1, duration: rmDuration, maxDuration: rmDuration, name: "Renewing Mist"}

                    returnData.runAfterHeal = function () {
                        return ["heal",mainHeal,[target[0]],"Gust of Mists"]
                    }

                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}