/* eslint-disable */
export default {
    methods: {
        healFuncSlWoo() {
            return function(character,target,healMod,hots,targets) {
                if (targets.length > 0) {
                    let stats = character.stats
                    //config
                    let heal = 0.4
                    let healTargets = 6
                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [[]], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------

                    let mainHeal = (spellpower * heal)*2 //2 because start and end

                    for (let i = 0; i<targets.length; i++) {
                        if (i >= healTargets) {
                            break
                        }
                        crit = this.critChance(stats.crit)
                        returnData.healingToTargets[0].push({id: i, heal: mainHeal*crit})
                    }

                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}