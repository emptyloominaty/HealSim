/* eslint-disable */
export default {
    methods: {
        healFuncEm() {
            return function(character,target,healMod,hots,targets,targetsData) {
                if (this.cooldown>=this.maxCooldown && targets.length > 0 && this.manaCost < character.mana) {
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

                    if (this.talents.mistWrap===1) {
                        emDuration = 7
                        emBonus = 0.4
                    }

                    emHeal = emHeal / (1+ emBonus) //TODO:FIX?????????????

                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------
                    crit = this.critChance(stats.crit)
                    let mainHeal = (((spellpower * (stats.mastery / 100))) * crit)
                    let emHotHeal = spellpower * emHeal
                    let ebHotHeal = spellpower * ebHeal

                    returnData.healingToTargets = [[{id: target[0], heal: 0}]]

                    returnData.hotData = [{targetID:target[0], canJump:1, scaleWithHaste: 1,data: {heal: emHotHeal , duration: emDuration, maxDuration: emDuration, extended: 0, name: "Enveloping Mist", healBonus:emBonus }}]

                    returnData.runAfter = ["heal",mainHeal,[target[0]],"Gust of Mists"]
                    if (hots["Essence Font"].includes(target[0])) {
                        crit = this.critChance(stats.crit)
                        mainHeal = (((spellpower * (stats.mastery / 100))) * crit)
                        returnData.runAfter.push("heal",mainHeal,[target[0]],"Gust of Mists")
                    }


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
                        let targetsEb = targets.slice(0)
                        for (let i = 0; i<envelopingBreathTargets; i++) {
                            let randomTarget = Math.round(Math.random()*targetsEb.length)
                            targetsEb.splice(randomTarget,1)
                            if (targets[i]!==undefined) {
                                returnData.hotData.push({targetID:targetsEb[randomTarget], canJump:0, scaleWithHaste: 1, data:{heal: ebHotHeal , duration: ebDuration, maxDuration: ebDuration, extended: 0, name: "Enveloping Breath", healBonus:ebBonus}})
                            }
                        }
                    }


                    this.setCd()

                    //Thunder Focus Tea
                    if (character.buffs2.thunderFocusTea>0) {
                        let tftEmHeal = 2.80 * spellpower
                        returnData.runAfter.push("heal",tftEmHeal,[target[0]],"Thunder Focus Tea")
                        character.buffs2.thunderFocusTea --
                    }

                    //legendaries
                    if (character.legendaries.tearOfMorning===1 && hots["Renewing Mist"].indexOf(target[0])!==-1) {
                        let spreadChance = (Math.random()*100)
                        if (spreadChance < 10) {
                            for (let hh = 0; hh<targetsData[target[0]].hots.length; hh++)  {
                                if (targetsData[target[0]].hots[hh].name==="Renewing Mist") {
                                    let spreadHotData = targetsData[target[0]].hots[hh]
                                    returnData.hotData.push({targetID:[0], canJump:1, scaleWithHaste: 1, data:{heal: spreadHotData.heal , duration: spreadHotData.duration, maxDuration: spreadHotData.maxDuration, extended: spreadHotData.extended, name: "Renewing Mist"}})
                                }
                            }
                        }
                    }

                    return returnData
                }
                return 0

            }
        },

    }
}