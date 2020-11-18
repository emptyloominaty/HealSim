/* eslint-disable */
export default {
    methods: {
        damageFuncFaelineStomp() {
            return function(character,target,dmgMod,hots,enemyTargets,friendlyTargets) {
                if (this.cooldown>=this.maxCooldown && character.covenant==="nightFae"  && this.manaCost < character.mana) {
                    let stats = character.stats

                    //config
                    let damage = 0.46
                    let heal = 0.91 + 0.472 + 0.168


                    //init
                    let crit
                    let returnData = {type:"damage",manaUsed: this.manaCost, damageToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, dotData: 0, name: this.name}
                    let spellpower = (stats.int ) * (1 + (stats.vers / 100))

                    //-------damage-------
                    let mainDmg = (spellpower * damage) * (1 + (dmgMod / 100))
                    let mainHeal = (spellpower * heal)

                    crit = this.critChance(stats.crit)

                    for (let i = 0; i<enemyTargets.length; i++) {
                        if (i>4) {
                            break
                        }
                        returnData.damageToTargets.push([{id: enemyTargets[i], damage: mainDmg*crit}])
                    }


                    let healtheseTargets = []
                    for (let i = 0; i<friendlyTargets.length; i++) {
                        if (i>4) {
                            break
                        }
                        healtheseTargets.push(friendlyTargets[i])
                    }


                    returnData.runAfter = ["heal", mainHeal, healtheseTargets, "Faeline Stomp"]

                    this.setCd()
                    return returnData
                }
                return 0

            }
        },

    }
}