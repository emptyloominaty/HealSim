/* eslint-disable */
export default {
    methods: {
        healFuncTFT() {
            return function(character,target,healMod,hots,allTargets,friendlyTargets) {
                if (this.cooldown>=this.maxCooldown) {
                    let stats = character.stats
                    //config

                    //init
                    let returnData = {type:"other",type2: "other",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: "Thunder Focus Tea"}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    returnData.healingToTargets = [[{id: target[0], heal: 0}]]

                    character.buffs2.thunderFocusTea = 1
                    if (character.talents.focusedThunder===1) {
                        character.buffs2.thunderFocusTea = 2
                    }
                    this.setCd() //TODO: ???
                    //legendaries
                    if (character.legendaries.yulonWhisper===1) {
                        if (returnData.runAfter===0) {returnData.runAfter=[]}
                        let healTargets = []
                        for (let i = 0; i<friendlyTargets.length; i++) {
                            if (allTargets[friendlyTargets[i]].health<allTargets[friendlyTargets[i]].maxHealth) {
                                healTargets.push(i)
                            }
                        }

                        for (let a = 0; a < character.legendariesData.mistweaver.yulonWhisperTargets; a++ ) {
                            if (healTargets[a]!=undefined) {
                                returnData.runAfter.push("heal", character.legendariesData.mistweaver.yulonWhisperHeal*spellpower, [healTargets[a]], "Yu'lon's Whisper")
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