/* eslint-disable */
export default {
    data() {
        return {
        }
    },
    methods: {
        healFuncViv() {
            return function(stats,healMod,manaCost,timeCast,rems,toms,efHot) {
                let vivMain = 1.04 //104% sp
                let vivCleave = 0.74 //74% sp
                let vivTearofMorning = vivMain/4  //25%
                let returnData = {manaUsed:0, healingDone:0, gcd:0, runAfterHeal:function(){return 0}, hotData:{}}
                stats.int = (stats.int*(1+(healMod/100))) * (1+(stats.vers/100))
                //crit
                let crit = this.critChance(stats.crit)
                stats.int = stats.int * crit
                //return data
                returnData.manaUsed = manaCost
                returnData.healingDone = (stats.int*vivMain) + ((stats.int*(stats.mastery/100))*(+efHot+1)) + ((stats.int*vivCleave)*rems) + ((stats.int*vivTearofMorning)*toms)
                returnData.gcd = timeCast / (1 + (stats.haste / 100))

                return  returnData
            }
        },

    }
}