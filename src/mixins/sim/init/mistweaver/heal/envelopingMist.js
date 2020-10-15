/* eslint-disable */
export default {
    methods: {
        healFuncEm() {
            return function(character,target,healMod,hots,targets) {
                if (this.cooldown>=this.maxCooldown && targets.length > 0) {
                    let stats = character.stats
                    //config
                    let emHeal = 3.60 //360% sp
                    let emDuration = 6

                    if (this.talents.mistwrap===1) {
                        emDuration = 7
                    }

                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------
                    crit = this.critChance(stats.crit)
                    let mainHeal = (((spellpower * (stats.mastery / 100)) * (+(hots["Essence Font"].includes(target[0])) + 1)) * crit)

                    returnData.healingToTargets = [[{id: target[0], heal: 0}]]

                    returnData.hotData = [{targetID:target[0], canJump:1, scaleWithHaste: 1,data: {heal: (spellpower * emHeal) , duration: emDuration, maxDuration: emDuration, name: "Enveloping Mist"}}]

                    returnData.runAfter = function () {
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