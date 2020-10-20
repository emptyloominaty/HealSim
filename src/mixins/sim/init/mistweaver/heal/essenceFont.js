/* eslint-disable */
export default {
    methods: {
        healFuncEf() {

            return function(character,target,healMod,hots,targets) {
                if (this.cooldown>=this.maxCooldown && targets.length > 0 && this.manaCost < character.mana) {
                    let stats = character.stats
                    //config
                    let efHeal = 0.472
                    let efBolts = 6
                    let efBoltsMax = 18 + Math.floor(this.spec.upwellingStacks)
                    let efHotHeal = 0.168
                    let efDuration = 8

                    if (this.talents.upwelling===1) {
                        efHotHeal = efHotHeal * 1.5
                        efDuration = efDuration * 1.5
                        this.spec.upwellingStacks = 0
                    }

                    //init
                    let crit
                    let returnData = {type:"heal",manaUsed: this.manaCost, healingToTargets: [[]], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, hotData: [], name: this.name}
                    let spellpower = (stats.int * (1 + (healMod / 100))) * (1 + (stats.vers / 100))

                    //-------heal-------
                    let mainHeal = spellpower * efHeal //Bolt
                    let hotHeal = spellpower * efHotHeal

                    for (let sec = 0; sec<efBoltsMax/efBolts; sec++) {
                        let targets2 = targets.slice(0)
                        for (let h = 0; h<efBolts; h++) {
                            let healed = (Math.floor(Math.random()*targets2.length))
                            if (healed<0) {healed=Math.floor(Math.random()*4)}
                            //heal
                            crit = this.critChance(stats.crit)
                            returnData.healingToTargets[0].push({id: targets2[healed], heal: mainHeal*crit})
                            //hot
                            returnData.hotData.push({targetID:targets2[healed], canJump:0, scaleWithHaste: 1, data:{heal: hotHeal , duration: efDuration, maxDuration: efDuration, extended: 0, name: "Essence Font"}})

                            targets2.splice(healed,1)
                        }
                    }
                    returnData.gcd = (returnData.gcd/18)*efBoltsMax

                    this.setCd()

                    return returnData
                }
                return 0
            }
        },

    }
}