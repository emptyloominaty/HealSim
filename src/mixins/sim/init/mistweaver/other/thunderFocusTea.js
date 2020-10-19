/* eslint-disable */
export default {
    methods: {
        healFuncTFT() {
            return function(character,target,healMod,hots) {
                if (this.cooldown>=this.maxCooldown) {
                    let stats = character.stats
                    //config

                    //init
                    let returnData = {type:"other",type2: "other",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: "Thunder Focus Tea"}
                    //let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    returnData.healingToTargets = [[{id: target[0], heal: 0}]]

                    character.buffs2.thunderFocusTea = 1

                    this.setCd() //TODO: ???

                    return returnData
                }
                return 0

            }
        },

    }
}