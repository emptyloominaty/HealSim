/* eslint-disable */
export default {
    methods: {
        damageFuncblackOutKick() {
            return function(character,target,dmgMod,hots,enemyTargets) {
                if (this.cooldown>=this.maxCooldown && enemyTargets.length > 0) {
                    let stats = character.stats

                    //config
                    let bokDamage = 0.847

                    //init
                    let crit
                    let returnData = {type:"damage",manaUsed: this.manaCost, damageToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, dotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (dmgMod / 100))) * (1 + (stats.vers / 100))

                    //-------damage-------
                    let mainDmg = (spellpower * bokDamage)



                    //check totm buff
                    let totm = 0
                    for (let i = 0; i<character.buffs.length; i++) {
                        if (character.buffs[i].name==="Teaching of the Monastery" ) {
                               totm = character.buffs[i].value
                        }
                            character.buffs.splice(i,1)
                    }
                    //totm dmg
                    for (let m = 0; m<totm+1; m++ ) {
                        crit = this.critChance(stats.crit)
                        returnData.damageToTargets.push([{id: target[0], damage: mainDmg*crit}])
                    }

                    //reset rsk
                    let resetChance = (Math.random())*100
                    if (resetChance < totm*15) {
                        returnData.runAfter =function () {
                            return ["resetCooldown", "Rising Sun Kick"]
                        }
                    }

                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}