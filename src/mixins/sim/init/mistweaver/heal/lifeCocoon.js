/* eslint-disable */
export default {
    methods: {
        healFuncLifeCocoon() {

            return function(stats,target,healMod,hots,healer) {
                if (this.charges>0) {
                    //config
                    let absorb = 60 //60%
                    let duration = 12
                    //init
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [[]], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfterHeal: 0, hotData: 0, name: this.name}
                    let spellpower = (((healer.maxHealth*absorb)/100) * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------

                    let mainHeal = spellpower


                    returnData.healingToTargets[0].push({id: target[0], heal: 0})


                    returnData.runAfterHeal = function () {
                        return ["absorb",mainHeal,[target[0]],duration]
                    }

                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}