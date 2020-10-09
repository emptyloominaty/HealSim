/* eslint-disable */

export default {
    methods: {
        getHots() {
            let jumped = 0
            let targetsHots = {"Renewing Mist":[], "Enveloping Mist":[], "Essence Font":[], "Tear of Morning":[], "Soothing Mist": []}
            for (let i = 0; i < this.targets.length; i++ ) {
                if (this.targets[i].hots.length>0) {
                    for (let a = 0; a < this.targets[i].hots.length; a++ ) {
                        let hotName = this.targets[i].hots[a].name
                        targetsHots[hotName].push(i)
                        //renewing mist jump when full health
                        if (hotName==="Renewing Mist" && this.targets[i].health === this.targets[i].maxHealth) {
                            let canJumpOn = []
                            let cantJumpOn = []
                            let injuredTargetsLength = this.injuredTargets.length
                            let remHot = this.targets[i].hots[a]
                            this.targets[i].hots.splice(a, 1)

                            for (let b=0; b<injuredTargetsLength; b++) {
                                for (let hh=0; hh<this.targets[this.injuredTargets[b]].hots.length; hh++) {
                                    if (this.targets[this.injuredTargets[b]].hots[hh].name === "Renewing Mist" || this.targets[this.injuredTargets[b]].health===this.targets[this.injuredTargets[b]].maxHealth) {
                                        cantJumpOn.push(this.injuredTargets[b])
                                    }
                                }
                            }
                            canJumpOn = this.injuredTargets.filter(val => !cantJumpOn.includes(val))

                            let jumpTo = (Math.floor(Math.random()*canJumpOn.length))
                            this.targets[canJumpOn[jumpTo]].applyHot(remHot)
                            jumped = 1
                            this.db.push("ReM JUMPED FROM "+i+" TO "+jumpTo)
                        }
                    }
                }
            }
            this.hotsData = targetsHots

            return jumped
        },
        healHots(gcd) {
            let stats = this.stats
            for (let i = 0; i < this.targets.length; i++ ) {
                if (this.targets[i].hots.length>0) {
                    for (let a = 0; a < this.targets[i].hots.length; a++ ) {
                        //+ gcd
                        this.targets[i].hots[a].duration -= gcd
                        let hotTimeLeft = this.targets[i].hots[a].duration
                        //crit chance
                        let crit = this.heals[0].critChance(stats.crit)
                        //heal the target
                        let healing = (((this.targets[i].hots[a].heal * (1 + (stats.haste / 100))) / this.targets[i].hots[a].maxDuration) * gcd)*crit
                        if (hotTimeLeft<gcd) {
                            healing = healing / (gcd/hotTimeLeft)
                        }
                        healing = Math.round(healing)
                        this.healingFromHots += healing
                        this.overhealingDone += this.targets[i].heal(healing)
                        //expire hot
                        if (hotTimeLeft<0) {
                            this.targets[i].hots.splice(a, 1)
                        }
                    }
                }
            }
        }
    }
}