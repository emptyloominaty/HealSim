/* eslint-disable */
export default {
    methods: {
        damageFuncRisingSunKick() {
            return function(character,target,dmgMod,hots,enemyTargets,allTargets,mostInjuredTarget) {
                if (this.cooldown>=this.maxCooldown && enemyTargets.length > 0  && this.manaCost < character.mana) {
                    let stats = character.stats

                    //config
                    let rskDamage = 1.438 * 1.4 //+40%????
                    let rmHeal = 0.28
                    let rmExtend = 4 //sec
                    let rmMaxExtend = 1 //x

                    rmMaxExtend = character.storeClassData.extendRem

                    //init
                    let crit
                    let returnData = {type:"damage",manaUsed: this.manaCost, damageToTargets: [], gcd: this.timeCast / (1 + (stats.haste / 100)), runAfter: 0, dotData: 0, name: this.name}
                    let spellpower = (stats.int * (1 + (dmgMod / 100))) * (1 + (stats.vers / 100))

                    //-------damage-------
                    let mainDmg = (spellpower * rskDamage)


                    crit = this.critChance(stats.crit)
                    returnData.damageToTargets.push([{id: target[0], damage: mainDmg*crit}])


                    //RISING MIST
                    if (this.talents.risingMist===1) {
                        crit = this.critChance(stats.crit)
                        let mainHeal = (spellpower * rmHeal)*crit
                        function arrayUnique(array) {
                            let a = array.concat()
                            for (let i = 0; i < a.length; ++i) {
                                for (let j = i + 1; j < a.length; ++j) {
                                    if (a[i] === a[j])
                                        a.splice(j--, 1)
                                }
                            }
                            return a;
                        }

                        //Heal
                        let rmHots = arrayUnique((hots["Renewing Mist"].concat(hots["Enveloping Mist"])).concat(hots["Essence Font"]))
                        let rmHealTargets = []
                        for (let i = 0; i < rmHots.length; i++) {
                            rmHealTargets.push(rmHots[i])
                        }
                        returnData.runAfter = ["heal", mainHeal, rmHealTargets, "Rising Mist"]

                        //Extend
                        for (let i = 0; i < allTargets.length; i++ ) {
                            if (allTargets[i].hots.length>0) {
                                for (let a = 0; a < allTargets[i].hots.length; a++ ) {
                                    let hotName = allTargets[i].hots[a].name
                                    let hot = allTargets[i].hots[a]
                                    if (hotName==="Renewing Mist" || hotName==="Enveloping Mist" || hotName==="Essence Font") {
                                        if (hot.extended<(hot.maxDuration*rmMaxExtend)-rmExtend) {
                                            hot.duration+=rmExtend
                                            hot.extended+=rmExtend
                                        } else if (hot.extended<(hot.maxDuration*rmMaxExtend)) {
                                            hot.duration+=((hot.maxDuration*rmMaxExtend)-hot.extended)
                                            hot.extended+=((hot.maxDuration*rmMaxExtend)-hot.extended)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    //CHI-JI
                    if (character.buffs2.chiJi>0) {
                        if (returnData.runAfter===0) {returnData.runAfter=[]}
                        returnData.runAfter.push("castHeal")
                        returnData.runAfter.push(15)
                    }


                    this.setCd()

                    //Thunder Focus Tea
                    if (character.buffs2.thunderFocusTea>0) {
                        this.cooldown = this.maxCooldown-3
                        character.buffs2.thunderFocusTea --
                    }

                    //legendaries
                    if (character.buffs2.ancientTeachingOfTheMonastery>0) {
                        if (returnData.runAfter===0) {returnData.runAfter=[]}
                        crit = this.critChance(stats.crit)
                        returnData.runAfter.push("heal", mainDmg*character.legendariesData.mistweaver.atoftmHeal*crit, [mostInjuredTarget], "Ancient Teachings Of The Monastery")
                    }

                    return returnData
                }
                return 0

            }
        },

    }
}