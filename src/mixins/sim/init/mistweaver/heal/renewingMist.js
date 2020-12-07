/* eslint-disable */
export default {
    methods: {
        healFuncRM() {
            return function(character,target,healMod,hots,targets) {
                if (this.charges>0 && targets.length > 0 && this.manaCost < character.mana) {
                    let stats = character.stats
                    //config
                    let rmHeal = 2.25
                    let rmDuration = 20

                    //Thunder Focus Tea
                    if (character.buffs2.thunderFocusTea>0) {
                        rmDuration = 30
                        rmHeal = rmHeal * 1.5
                        character.buffs2.thunderFocusTea --
                    }

                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------
                    crit = this.critChance(stats.crit)
                    let mainHeal = (((spellpower * (stats.mastery / 100))) * crit)

                    returnData.healingToTargets = [[{id: target[0], heal: 0}]]

                    returnData.hotData = [{targetID:target[0], canJump:1, scaleWithHaste: 1,data: {heal: (spellpower * rmHeal), duration: rmDuration, maxDuration: rmDuration, extended: 0, name: "Renewing Mist"}}]

                    //conduit
                    if (character.conduits.includes("resplendentMist")) {
                        let randomIdk = Math.random()*100
                        if (randomIdk<30) {
                            mainHeal = mainHeal * 1.8 // 223ilvl conduit
                        }
                    }

                    returnData.runAfter = ["heal",mainHeal,[target[0]],"Gust of Mists"]
                    if (hots["Essence Font"].includes(target[0])) {
                        crit = this.critChance(stats.crit)
                        mainHeal = (((spellpower * (stats.mastery / 100))) * crit)
                        //conduit
                        if (character.conduits.includes("resplendentMist")) {
                            let randomIdk = Math.random()*100
                            if (randomIdk<30) {
                                mainHeal = mainHeal * 1.8 // 223ilvl conduit
                            }
                        }
                        returnData.runAfter.push("heal",mainHeal,[target[0]],"Gust of Mists")
                    }

                    this.setCd()


                    return returnData
                }
                return 0

            }
        },

    }
}