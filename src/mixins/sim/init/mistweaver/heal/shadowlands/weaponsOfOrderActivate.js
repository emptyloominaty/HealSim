/* eslint-disable */
export default {
    methods: {
        healFuncSlWooA() {
            return function(character,target,healMod,hots,targets) {
                if (this.cooldown>=this.maxCooldown && character.covenant==="kyrian" && this.manaCost < character.mana ) {
                    let stats = character.stats
                    //config
                    let duration = 30
                    let masteryIncrease = 41.999

                    //init
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: "Weapons of Order Activate"}

                    returnData.healingToTargets = [[{id: target[0], heal: 0}]]

                    character.buffs2.weaponsOfOrder = duration

                    character.temporaryBuffs.push({name:"weaponsOfOrder",statName:"mastery",amount:masteryIncrease,
                        duration: duration,act:0})

                    returnData.runAfter = ["resetCooldownHeal", "Essence Font"]


                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}