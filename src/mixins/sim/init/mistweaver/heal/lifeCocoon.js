/* eslint-disable */
export default {
    methods: {
        healFuncLifeCocoon() {

            return function(character,target,healMod,hots,targets,healer) {
                if (this.cooldown>=this.maxCooldown && targets.length > 0 && this.manaCost < character.mana) {
                    let stats = character.stats
                    //config
                    let absorb = 60 //60%
                    let duration = 12
                    //init
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [[]], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: this.name}
                    let mainHeal = (((healer.maxHealth*absorb)/100) * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    returnData.healingToTargets[0].push({id: target[0], heal: 0})

                    returnData.runAfter = ["absorb",mainHeal,[target[0]],duration]

                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}