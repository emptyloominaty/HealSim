/* eslint-disable */
export default {
    methods: {
        healFuncViv() {
            return function(character,target,healMod,hots,targets,targetsData) {
                if (this.cooldown>=this.maxCooldown && targets.length > 0 && this.manaCost < character.mana) {
                    let stats = character.stats
                    //config
                    let vivMain = 1.41 //141% sp
                    let vivCleave = 1.04 //74% sp

                    if (character.legendaries.tearOfMorning===1) {
                        vivCleave = vivCleave * character.legendariesData.mistweaver.tomVivCleave
                    }

                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------
                    crit = this.critChance(stats.crit)
                    let masteryHeal = (((spellpower * (stats.mastery / 100))) * crit)
                    crit = this.critChance(stats.crit)
                    let mainHeal = ((spellpower * vivMain) * crit)
                    let cleaveHeal = (spellpower * vivCleave)

                    //rem loop
                    let cleaveTargets = []
                    for (let i = 0; i < hots["Renewing Mist"].length; i++) {
                        crit = this.critChance(stats.crit)
                        cleaveTargets.push({id: hots["Renewing Mist"][i], heal: (cleaveHeal * crit)})
                    }

                    returnData.healingToTargets = [[{id: target[0], heal: mainHeal}], cleaveTargets]

                    returnData.runAfter = ["heal",masteryHeal,[target[0]],"Gust of Mists"]
                    if (hots["Essence Font"].includes(target[0])) {
                        crit = this.critChance(stats.crit)
                        masteryHeal = (((spellpower * (stats.mastery / 100))) * crit)
                        returnData.runAfter.push("heal",masteryHeal,[target[0]],"Gust of Mists")
                    }

                    this.setCd()

                    //Thunder Focus Tea
                    if (character.buffs2.thunderFocusTea>0) {
                        returnData.manaUsed = 0
                        character.buffs2.thunderFocusTea --
                    }

                    //legendaries
                    if (character.legendaries.tearOfMorning===1 && hots["Renewing Mist"].indexOf(target[0])!==-1) {
                        let spreadChance = (Math.random()*100)
                        if (spreadChance < 10) {
                            for (let hh = 0; hh<targetsData[target[0]].hots.length; hh++)  {
                                if (targetsData[target[0]].hots[hh].name==="Renewing Mist") {
                                    let spreadHotData = targetsData[target[0]].hots[hh]
                                    returnData.hotData = []
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