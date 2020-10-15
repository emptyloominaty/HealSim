/* eslint-disable */
export default {
    methods: {
        healFuncSM() {
            return function(stats,target,healMod,hots) {
                if (this.cooldown>=this.maxCooldown) {
                    //config
                    let smHeal = 0.55

                    let statueHeal = 0.275
                    let statueDuration = 8

                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfterHeal: 0, hotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------
                    crit = this.critChance(stats.crit)
                    let mainHeal = (spellpower * smHeal)
                    let masteryHeal = (((spellpower * (stats.mastery / 100)) * (+(hots["Essence Font"].includes(target[0])) + 1)) * crit)

                    returnData.healingToTargets = [[{id: target[0], heal: mainHeal}]]


                    //TODO: (DECK)
                    let masteryRng = Math.floor(Math.random()*7)
                    if (masteryRng===0) {
                        returnData.runAfterHeal = function () {
                            return ["heal",masteryHeal,[target[0]],"Gust of Mists"]
                        }
                    }

                    if (this.talents.jadeStatue===1) {
                        returnData.hotData = {heal: (spellpower * statueHeal), canJump:0, scaleWithHaste: 1, duration: statueDuration / (1 + (stats.haste / 100)), maxDuration: statueDuration / (1 + (stats.haste / 100)), name: "Soothing Mist - Statue"}
                    }

                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}