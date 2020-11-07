/* eslint-disable */
export default {
    methods: {
        healFuncChiJiActivate() {
            return function(character,target,healMod,hots,targets) {
                if (this.cooldown>=this.maxCooldown && this.talents.chiJi===1  && this.manaCost < character.mana ) {
                    let stats = character.stats
                    //config
                    let duration = 25

                    //init
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: "Chi-Ji Activate"}
                    //let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    returnData.healingToTargets = [[{id: target[0], heal: 0}]]

                    character.buffs2.chiJi = duration

                    //legendaries
                    if (character.legendaries.invokersDelight===1) {
                        character.temporaryBuffs.push({name:"invokersDelight",statName:"haste",amount:character.legendariesData.mistweaver.invokersDelightAmount,
                            duration:character.legendariesData.mistweaver.invokersDelightDuration,act:0
                        })
                    }

                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}