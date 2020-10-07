/* eslint-disable */
export default {
    methods: {
        healFuncViv() {
            return function(stats,target,healMod,hots) {
                if (this.cooldown>=this.maxCooldown) {
                    //config
                    let vivMain = 1.04 //104% sp
                    let vivCleave = 0.74 //74% sp
                    let vivTearofMorning = vivMain / 4  //25%

                    //init
                    let crit1;
                    let crit2;
                    let returnData = {type:"heal",manaUsed: 0, healingToTargets: [], gcd: 0, runAfterHeal: function () {return 0}, hotData: 0, name: ""}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //return data
                    returnData.name = this.name
                    returnData.manaUsed = this.manaCost
                    returnData.gcd = this.timeCast / (1 + (stats.haste / 100))
                    //-------heal-------
                    crit1 = this.critChance(stats.crit)
                    crit2 = this.critChance(stats.crit)

                    let mainHeal = ((spellpower * vivMain) * crit1) + (((spellpower * (stats.mastery / 100)) * (+(hots["Essence Font"].includes(target[0])) + 1)) * crit2)
                    let cleaveHeal = (spellpower * vivCleave)
                    let tomHeal = (spellpower * vivTearofMorning)

                    //rem loop
                    let cleaveTargets = []
                    for (let i = 0; i < hots["Renewing Mist"].length; i++) {
                        crit1 = this.critChance(stats.crit)
                        cleaveTargets.push({id: hots["Renewing Mist"][i], heal: (cleaveHeal * crit1)})
                    }

                    //tom loop
                    let tomTargets = []
                    for (let i = 0; i < hots["Tear of Morning"].length; i++) {
                        crit1 = this.critChance(stats.crit)
                        tomTargets.push({id: hots["Tear of Morning"][i], heal: (tomHeal * crit1)})
                    }

                    returnData.healingToTargets = [[{id: target[0], heal: mainHeal}], cleaveTargets, tomTargets]

                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}