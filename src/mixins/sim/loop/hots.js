/* eslint-disable */

export default {
    methods: {
        getHots() {
            function hotJump(i,a,targets,injuredTargets,db,hot)  {
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
                targets[canJumpOn[jumpTo]].applyHot(remHot)
                jumped = 1
                db.push(hot+" JUMPED FROM "+i+" TO "+canJumpOn[jumpTo])
            }

            let jumped = 0
            let targetsHots = {"Renewing Mist":[], "Enveloping Mist":[], "Essence Font":[], "Tear of Morning":[], "Soothing Mist": [], "Refreshing Jade Wind": []}
            for (let i = 0; i < this.targets.length; i++ ) {
                if (this.targets[i].hots.length>0) {
                    for (let a = 0; a < this.targets[i].hots.length; a++ ) {
                        let hotName = this.targets[i].hots[a].name
                        targetsHots[hotName].push(i)
                        //renewing mist jump when full health
                        if (hotName==="Renewing Mist" && this.targets[i].health === this.targets[i].maxHealth) { //|| hotName==="Refreshing Jade Wind"
                            hotJump(i,a,this.targets,this.injuredTargets,this.db,"Renewing Mist")
                        }
                        if (hotName==="Refreshing Jade Wind" && this.targets[i].health === this.targets[i].maxHealth) { //|| hotName==="Refreshing Jade Wind"
                            hotJump(i,a,this.targets,this.injuredTargets,this.db,"Refreshing Jade Wind")
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
                        this.healingDoneArr[this.targets[i].hots[a].name].push({time: this.time, heal: healing})
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