/* eslint-disable */
export default {
    methods: {
        damageFuncRisingSunKick() {
            return function(character,target,dmgMod,hots,enemyTargets) {
                if (this.cooldown>=this.maxCooldown && enemyTargets.length > 0) {
                    let stats = character.stats

                    //config
                    let rskDamage = 1.438

                    //init
                    let crit
                    let returnData = {type:"damage",manaUsed: this.manaCost, damageToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, dotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (dmgMod / 100))) * (1 + (stats.vers / 100))

                    //-------damage-------
                    let mainDmg = (spellpower * rskDamage)
                    crit = this.critChance(stats.crit)
                    returnData.damageToTargets.push([{id: target[0], damage: mainDmg*crit}])

                    //TODO: RISING MIST (get all hots and delete duplicates)


                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}