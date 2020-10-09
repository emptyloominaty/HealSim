/* eslint-disable */

export default {
    methods: {
        getHots() {
            let targetsHots = {"Renewing Mist":[], "Enveloping Mist":[], "Essence Font":[], "Tear of Morning":[], "Soothing Mist": []}
            for (let i = 0; i < this.targets.length; i++ ) {
                if (this.targets[i].hots.length>0) {
                    for (let a = 0; a < this.targets[i].hots.length; a++ ) {
                        let hotName = this.targets[i].hots[a].name
                        targetsHots[hotName].push(i)
                        //renewing mist jump when full health
                        if (hotName==="Renewing Mist" && this.targets[i].health === this.targets[i].maxHealth) {
                            let remHot = this.targets[i].hots[a]
                            this.targets[i].hots.splice(a, 1)

                            let injuredTargetsLength = this.injuredTargets.length
                            let jumpTo = (Math.floor(Math.random()*injuredTargetsLength))-1
                            if (jumpTo<0) { jumpTo = 0 }
                            this.targets[jumpTo].applyHot(remHot)
                            this.db.push("ReM JUMPED FROM "+i+" TO "+jumpTo)
                        }

                    }
                }
            }
            this.hotsData = targetsHots
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