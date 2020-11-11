/* eslint-disable */

export default {
    methods: {
        getHots() {
            function hotJump(i,a,targets,injuredTargets,db,hot,friendlytargets)  {
                let canJumpOn = []
                let cantJumpOn = []
                let injuredTargetsLength = injuredTargets.length
                let remHot = targets[i].hots[a]
                targets[i].hots.splice(a, 1)

                for (let b=0; b<injuredTargetsLength; b++) {
                    for (let hh=0; hh<targets[injuredTargets[b]].hots.length; hh++) {
                        if (targets[injuredTargets[b]].hots[hh].name === hot || targets[injuredTargets[b]].health===targets[injuredTargets[b]].maxHealth) { //this.targets[this.injuredTargets[b]].hots[hh].name === "Refreshing Jade Wind" ||
                            cantJumpOn.push(injuredTargets[b])
                        }
                    }
                }
                canJumpOn = injuredTargets.filter(val => !cantJumpOn.includes(val))

                let jumpTo = (Math.floor(Math.random()*canJumpOn.length))
                if (canJumpOn[jumpTo]===undefined) { canJumpOn[jumpTo] = Math.floor(Math.random()*friendlytargets.length) }
                targets[canJumpOn[jumpTo]].applyHot(remHot)
                jumped = 1
            }

            let jumped = 0
            let targetsHots = {"Renewing Mist":[], "Enveloping Mist":[], "Essence Font":[], "Tear of Morning":[], "Refreshing Jade Wind": [], "Soothing Mist - Statue": [], "Soothing Mist - Yu'Lon": [],"Enveloping Breath": []}
            for (let i = 0; i < this.targets.length; i++ ) {
                if (this.targets[i].hots.length>0) {
                    for (let a = 0; a < this.targets[i].hots.length; a++ ) {
                        let hotName = this.targets[i].hots[a].name

                        targetsHots[hotName].push(i)
                        if (this.targets[i].hots[a].canJump===1 && this.targets[i].health === this.targets[i].maxHealth) {
                            hotJump(i,a,this.targets,this.injuredTargets,this.db,hotName,this.friendlyTargets)
                        }
                    }
                }
            }
            this.hotsData = targetsHots

            return jumped
        },
        healHots(gcd) {
            let stats = this.character.stats
            for (let i = 0; i < this.targets.length; i++ ) {
                this.targets[i].healingBonus = 0
                if (this.targets[i].hots.length>0) {
                    for (let a = 0; a < this.targets[i].hots.length; a++ ) {
                        //bonus
                        try {
                            if (this.targets[i].hots[a].healBonus!==undefined) {
                                this.targets[i].healingBonus += this.targets[i].hots[a].healBonus
                            }
                        } catch { }
                        //+ gcd

                        this.targets[i].hots[a].duration -= gcd
                        let hotTimeLeft = this.targets[i].hots[a].duration
                        //crit chance
                        let crit = this.heals[0].critChance(stats.crit)
                        let healing = 0
                        //heal the target
                        if (this.targets[i].hots[a].scaleWithHaste===1) {
                            healing = (((this.targets[i].hots[a].heal * (1 + (stats.haste / 100))) / this.targets[i].hots[a].maxDuration) * gcd)*crit
                        } else {
                            healing = (((this.targets[i].hots[a].heal) / this.targets[i].hots[a].maxDuration) * gcd)*crit
                        }
                        healing = healing * (1+this.targets[i].healingBonus)

                        if (hotTimeLeft<gcd) {
                            healing = healing - (healing / (gcd/hotTimeLeft))
                        }

                        healing = Math.round(healing*(1+this.targets[i].healingBonus))

                        this.doHealing(healing,this.targets[i].hots[a].name,i,"healer",1)

                        //TODO: DO SOMETHING WITH THIS PLS--------------------------
                        if (this.character.legendaries.tearOfMorning===1 && this.targets[i].hots[a].name==="Enveloping Mist") {
                            for (let tom = 0; tom<this.hotsData["Renewing Mist"].length;tom++) {
                                this.doHealing(healing*this.character.legendariesData.mistweaver.tomEmRemHeal,"Tear of Morning",this.hotsData["Renewing Mist"][tom],"healer",1)
                            }
                        }
                        //----------------------------------------------------------

                        // expire hot
                        if (hotTimeLeft<0) {
                            this.targets[i].hots.splice(a, 1)
                        }
                    }
                }
            }
        },
        capHots(hotName,cap) {
            while(this.hotsData[hotName].length > cap) {
                for (let i = 0; i<this.targets[this.hotsData[hotName][0]].hots.length; i++) {
                    if (this.targets[this.hotsData[hotName][0]].hots[i].name===hotName) {
                        this.targets[this.hotsData[hotName][0]].hots.splice(i,1)
                        this.hotsData[hotName].splice(0,1)
                    }
                }
            }
        }
    }
}