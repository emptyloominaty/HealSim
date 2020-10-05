/* eslint-disable */
export default {
    data() {
        return {
        }
    },
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
                    let returnData = {manaUsed: 0, healingToTargets: [], gcd: 0, runAfterHeal: function () {return 0}, hotData: 0, name: ""}
                    stats.int = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //return data
                    returnData.name = this.name
                    returnData.manaUsed = this.manaCost
                    returnData.gcd = this.timeCast / (1 + (stats.haste / 100))
                    //-------heal-------
                    crit1 = this.critChance(stats.crit)
                    crit2 = this.critChance(stats.crit)

                    let mainHeal = ((stats.int * vivMain) * crit1) + (((stats.int * (stats.mastery / 100)) * (+(hots.efTargets.includes(target[0])) + 1)) * crit2)
                    let cleaveHeal = (stats.int * vivCleave)
                    let tomHeal = (stats.int * vivTearofMorning)

                    //rem loop
                    let cleaveTargets = []
                    for (let i = 0; i < hots.remTargets.length; i++) {
                        crit1 = this.critChance(stats.crit)
                        cleaveTargets.push({id: hots.remTargets[i], heal: (cleaveHeal * crit1)})
                    }

                    //tom loop
                    let tomTargets = []
                    for (let i = 0; i < hots.tomTargets.length; i++) {
                        crit1 = this.critChance(stats.crit)
                        tomTargets.push({id: hots.tomTargets[i], heal: (tomHeal * crit1)})
                    }

                    returnData.healingToTargets = [{id: target[0], heal: mainHeal}, cleaveTargets, tomTargets]

                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}