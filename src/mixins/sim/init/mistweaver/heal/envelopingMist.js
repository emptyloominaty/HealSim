/* eslint-disable */
export default {
    methods: {
        healFuncEm() {
            return function(character,target,healMod,hots,targets) {
                if (this.cooldown>=this.maxCooldown && targets.length > 0) {
                    let stats = character.stats
                    //config
                    let emHeal = 3.60 //360% sp
                    let emDuration = 6
                    let emBonus = 0.3

                    //enveloping breath
                    let envelopingBreathTargets = 6
                    let ebHeal = 1.8
                    let ebDuration = 6
                    let ebBonus= 0.1

                    if (this.talents.mistwrap===1) {
                        emDuration = 7
                        emBonus = 0.4
                    }

                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------
                    crit = this.critChance(stats.crit)
                    let mainHeal = (((spellpower * (stats.mastery / 100)) * (+(hots["Essence Font"].includes(target[0])) + 1)) * crit)
                    let emHotHeal = spellpower * emHeal
                    let ebHotHeal = spellpower * ebHeal

                    returnData.healingToTargets = [[{id: target[0], heal: 0}]]

                    returnData.hotData = [{targetID:target[0], canJump:1, scaleWithHaste: 1,data: {heal: emHotHeal , duration: emDuration, maxDuration: emDuration, extended: 0, name: "Enveloping Mist", healBonus:emBonus }}]

                    returnData.runAfter = ["heal",mainHeal,[target[0]],"Gust of Mists"]


                    if (character.buffs2.chiJiEnveloping>0) {
                        returnData.manaUsed =  returnData.manaUsed - (((character.buffs2.chiJiEnveloping*33)/100)*returnData.manaUsed)
                        returnData.gcd = returnData.gcd  - (((character.buffs2.chiJiEnveloping*33)/100)*returnData.gcd )
                        if (returnData.gcd < (1.5 / (1 + (stats.haste / 100)))) {
                            returnData.gcd = (1.5 / (1 + (stats.haste / 100)))
                        }
                        character.buffs2.chiJiEnveloping=0
                    }

                    //enveloping breath
                    if (character.buffs2.chiJi>0 || character.buffs2.yuLon>0) {
                        for (let i = 0; i<envelopingBreathTargets; i++) {
                            if (targets[i]!==undefined) {
                                returnData.hotData.push({targetID:targets[i], canJump:0, scaleWithHaste: 1, data:{heal: ebHotHeal , duration: ebDuration, maxDuration: ebDuration, extended: 0, name: "Enveloping Breath", healBonus:ebBonus}})
                            }
                        }
                    }

                    this.setCd()

                    //Thunder Focus Tea
                    if (character.buffs2.thunderFocusTea===1) {
                        let tftEmHeal = 2.80 * spellpower
                        returnData.runAfter.push("heal",tftEmHeal,[target[0]],"Thunder Focus Tea")
                        character.buffs2.thunderFocusTea = 0
                    }


                    return returnData
                }
                return 0

            }
        },

    }
}