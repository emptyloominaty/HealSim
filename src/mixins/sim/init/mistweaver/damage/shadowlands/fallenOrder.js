/* eslint-disable */
export default {
    methods: {
        damageFuncFallenOrder() {
            return function(character,target,dmgMod,hots,enemyTargets,friendlyTargets) {
                if (character.covenant==="venthyr" && this.cooldown>=this.maxCooldown) {
                    let stats = character.stats

                    //config
                    let damage = 5+(Math.random()*4)//TOTAL
                    let heal = 35+(Math.random()*10) //TOTAL

                    let numberOfheals = 5

                    //conduit
                    if (character.conduits.includes("imbuedReflections")) {
                        heal = heal * 1.58 // max conduit lvl?? 226
                        damage = damage * 1.58// max conduit lvl?? 226
                    }

                    //init
                    let crit
                    let returnData = {type:"damage",manaUsed: this.manaCost, damageToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, dotData: 0, name: this.name}
                    let spellpower = (stats.int ) * (1 + (stats.vers / 100))

                    //-------damage-------
                    let mainDmg = (spellpower * damage) * (1 + (dmgMod / 100))
                    let mainHeal = (spellpower * heal)/numberOfheals

                    crit = this.critChance(stats.crit)

                    returnData.damageToTargets.push([{id: enemyTargets[0], damage: mainDmg*crit}])

                    let healtheseTargets = []
                    for (let i = 0; i<friendlyTargets.length; i++) {
                        if (i===numberOfheals) {
                            break
                        }
                        healtheseTargets.push(friendlyTargets[i])
                    }

                    returnData.runAfter = ["heal", mainHeal, healtheseTargets, "Fallen Order"]

                    this.setCd()
                    return returnData
                }
                return 0

            }
        },

    }
}