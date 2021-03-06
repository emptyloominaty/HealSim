/* eslint-disable */
export default {
    methods: {
        healFuncYulon() {
            return function(character,target,healMod,hots,targets) {
                if (this.cooldown>=this.maxCooldown && this.talents.chiJi===0 && targets.length > 0 && this.manaCost < character.mana) {
                    let stats = character.stats

                    //config
                    let yulonHeal = 5.83333  //   105% over 4.5sec --- 583.333%  over 25sec
                    let yulonTargets = 3
                    let yulonDuration = 25


                    if (character.conduits.includes("jadeBond") ) {
                        yulonHeal = yulonHeal * 1.1008
                    }

                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [[]], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: [], name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------
                    let mainHeal = (spellpower * yulonHeal)


                    returnData.healingToTargets[0].push({id: targets[0], heal: 0})

                    for (let h = 0; h<yulonTargets; h++) {
                            let healed = (Math.floor(Math.random()*targets.length))
                            //hot
                            returnData.hotData.push({targetID:targets[healed], canJump:1, scaleWithHaste: 1, data:{heal: mainHeal, duration: yulonDuration, maxDuration: yulonDuration, name: "Soothing Mist - Yu'Lon"}})
                    }

                    //legendaries
                    if (character.legendaries.invokersDelight===1) {
                        character.temporaryBuffs.push({name:"invokersDelight",statName:"haste",amount:character.legendariesData.mistweaver.invokersDelightAmount,
                            duration:20,act:0
                        })
                    }

                    character.buffs2.yuLon=yulonDuration
                    this.setCd()

                    return returnData
                }
                return 0

            }
        },

    }
}