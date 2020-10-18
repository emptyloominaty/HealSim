/* eslint-disable */
export default {
    methods: {
        damageFuncChiBurst() {
            return function(character,target,dmgMod,hots,enemyTargets,friendlyTargets) {
                if (this.cooldown>=this.maxCooldown && this.talents.chiBurst===1) {
                    let stats = character.stats

                    //config
                    let cbDamage = 1.438
                    let cbHeal = 0.28


                    //init
                    let crit
                    let returnData = {type:"damage",manaUsed: this.manaCost, damageToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, dotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (dmgMod / 100))) * (1 + (stats.vers / 100))

                    //-------damage-------
                    let mainDmg = (spellpower * cbDamage)
                    let mainHeal = (spellpower * cbHeal)

                    crit = this.critChance(stats.crit)

                    for (let i = 0; i<enemyTargets.length; i++) {
                        returnData.damageToTargets.push([{id: enemyTargets[i], damage: mainDmg*crit}])
                    }


                    returnData.runAfter = ["heal", mainHeal, friendlyTargets, "Chi Burst"]



                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}