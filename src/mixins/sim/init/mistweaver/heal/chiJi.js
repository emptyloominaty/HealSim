/* eslint-disable */
export default {
    methods: {
        healFuncChiJi() {
            return function(character,target,healMod,hots,targets) {
                    let stats = character.stats
                    let injuredTargets = targets.slice(0)
                    //config
                    let chiJitargets = 2

                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------

                    let mainHeal = (((spellpower * (stats.mastery / 100)) * (+(hots["Essence Font"].includes(target[0])) + 1)))

                    if (injuredTargets.length===0) {
                        injuredTargets = [0,1,2,3,4]
                    } else if (injuredTargets.length<chiJitargets) {
                        injuredTargets.push(Math.round(Math.random()*chiJitargets))
                    }


                    for (let i = 0; i<chiJitargets; i++) {
                        crit = this.critChance(stats.crit)
                        returnData.healingToTargets.push([{id: injuredTargets[i], heal: mainHeal*crit}])
                    }

                    if (character.buffs2.chiJiEnveloping<3) {
                        character.buffs2.chiJiEnveloping++
                    }

                    this.setCd()

                    return returnData

            }
        },

    }
}