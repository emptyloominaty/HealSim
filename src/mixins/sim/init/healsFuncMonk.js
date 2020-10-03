/* eslint-disable */
export default {
    data() {
        return {
            //vars
            vivMain: 1.04,
            vivCleave: 0.74,
            vivTearofMorning: this.vivMain/4,


            //functions
            healFuncViv: function(stats,healMod,manaCost,timeCast,rems,toms,efHot) {
                let returnData = {manaUsed:0, healingDone:0, gcd:0, runAfterHeal:function(){return 0}, hotData:{}}
                stats.int = stats.int * (1+(stats.vers/100))

                //crit
                let crit = this.critChance(stats.crit)
                stats.int = stats.int * crit

                //return data
                returnData.manaUsed = manaCost
                returnData.healingDone = (stats.int*this.vivMain) + ((stats.int*(stats.statMastery/100))*(efHot+1)) + ((stats.int*this.vivCleave)*rems)+((stats.int*this.vivTearofMorning)*toms)
                returnData.gcd = timeCast / (1 + (stats.haste / 100))

                return  returnData
            },
        }
    }
}