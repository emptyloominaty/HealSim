/* eslint-disable */
export default {
    methods: {
        healFuncViv() {
            return function(character,target,healMod,hots,targets) {
                if (this.cooldown>=this.maxCooldown && targets.length > 0) {
                    let stats = character.stats
                    //config
                    let vivMain = 1.04 //104% sp
                    let vivCleave = 0.74 //74% sp
                    let vivTearofMorning = vivMain / 4  //25%

                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------
                    crit = this.critChance(stats.crit)
                    let masteryHeal = (((spellpower * (stats.mastery / 100)) * (+(hots["Essence Font"].includes(target[0])) + 1)) * crit)
                    crit = this.critChance(stats.crit)
                    let mainHeal = ((spellpower * vivMain) * crit)
                    let cleaveHeal = (spellpower * vivCleave)
                    let tomHeal = (spellpower * vivTearofMorning)

                    //rem loop
                    let cleaveTargets = []
                    for (let i = 0; i < hots["Renewing Mist"].length; i++) {
                        crit = this.critChance(stats.crit)
                        cleaveTargets.push({id: hots["Renewing Mist"][i], heal: (cleaveHeal * crit)})
                    }

                    //tom loop
                    let tomTargets = []
                    for (let i = 0; i < hots["Tear of Morning"].length; i++) {
                        crit = this.critChance(stats.crit)
                        tomTargets.push({id: hots["Tear of Morning"][i], heal: (tomHeal * crit)})
                    }

                    returnData.healingToTargets = [[{id: target[0], heal: mainHeal}], cleaveTargets, tomTargets]

                    returnData.runAfter = function () {
                        return ["heal",masteryHeal,[target[0]],"Gust of Mists"]
                    }


                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}