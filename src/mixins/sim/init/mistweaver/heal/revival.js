/* eslint-disable */
export default {
    methods: {
        healFuncRevival() {

            return function(character,target,healMod,hots,targets) {
                if (this.cooldown>=this.maxCooldown && targets.length > 0 && this.manaCost < character.mana) {
                    let stats = character.stats
                    //config
                    let revHeal = 3.15

                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [[]], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------

                    let mainHeal = spellpower * revHeal

                    for (let i = 0; i<target.length; i++) {
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