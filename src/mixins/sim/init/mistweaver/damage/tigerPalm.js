/* eslint-disable */
export default {
    methods: {
        damageFuncTigerPalm() {
            return function(character,target,dmgMod,hots,enemyTargets) {
                if (this.cooldown>=this.maxCooldown && enemyTargets.length > 0  && this.manaCost < character.mana ) {
                    let stats = character.stats

                    //config
                    let tpDamage = 0.27027
                    let totmDuration = 15

                    //init
                    let crit
                    let returnData = {type:"damage",manaUsed: this.manaCost, damageToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, dotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (dmgMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------
                    crit = this.critChance(stats.crit)
                    let mainDmg = ((spellpower * tpDamage) * crit)

                    returnData.damageToTargets = [[{id: target[0], damage: mainDmg}]]

                    //totm buff
                    let buffExtended = 0
                    for (let i = 0; i<character.buffs.length; i++) {
                        if (character.buffs[i].name==="Teaching of the Monastery" ) {
                            if (character.buffs[i].value<3) {
                                character.buffs[i].value++
                            }
                            character.buffs[i].duration = totmDuration
                            buffExtended = 1
                        }
                    }
                    if (buffExtended===0) {
                        character.buffs.push({name:"Teaching of the Monastery", type:"buff", value:1, duration:totmDuration, maxDuration:totmDuration,})
                    }

                    //CHI-JI
                    if (character.buffs2.chiJi>0) {
                        if (returnData.runAfter===0) {returnData.runAfter=[]}
                        returnData.runAfter.push("castHeal")
                        returnData.runAfter.push(15)
                    }


                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}