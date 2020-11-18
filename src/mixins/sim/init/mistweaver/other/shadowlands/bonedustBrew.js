/* eslint-disable */
export default {
    methods: {
        healFuncbonedustbrew() {
            return function(character,target,healMod,hots,friendlyTargets,enemyTargets) {
                if (character.covenant==="necrolord" && this.cooldown>=this.maxCooldown && enemyTargets.length > 0 ) {
                    let stats = character.stats
                    //config
                    let duration = 10

                    //init
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: [], name: this.name}

                    returnData.healingToTargets = [[{id: target[0], heal: 0}]]

                    let targets = []
                    for (let i = 0; i<enemyTargets.length; i++) {
                        let randomIdk = Math.random()*100
                        if (randomIdk < 95) {
                            targets.push(enemyTargets[i])
                        }
                    }
                    for (let i = 0; i<friendlyTargets.length; i++) {
                        let randomIdk = Math.random()*100
                        if (randomIdk < 30) {
                            targets.push(friendlyTargets[i])
                        }
                    }

                    for (let i = 0; i<targets.length; i++) {      //TODO:IF heal = 0 hot!=hot
                        returnData.hotData.push({targetID:targets[i], canJump:0, scaleWithHaste: 0,data: {heal: 0, duration: duration, maxDuration: duration, extended: 0, name: "Bonedust Brew"}})
                    }
                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}