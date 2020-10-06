/* eslint-disable */

export default {
    data() {
        return {
        }
    },
    methods: {
        getHots() {
            let targetsHots = {"Renewing Mist":[], "Enveloping Mist":[], "Essence Font":[], "Tear of Morning":[]}
            for (let i = 0; i < this.targets.length; i++ ) {
                if (this.targets[i].hots.length>0) {
                    for (let a = 0; a < this.targets[i].hots.length; a++ ) {
                        let hotName = this.targets[i].hots[a].name
                        targetsHots[hotName].push(i)
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
                        this.targets[i].hots[a].duration = this.targets[i].hots[a].duration - gcd
                        //crit chance
                        let crit = this.heals[0]["vivify"].critChance(stats.crit)
                        //heal the target
                        this.targets[i].heal((((this.targets[i].hots[a].heal * (1 + (stats.haste / 100))) / this.targets[i].hots[a].maxDuration) * gcd)*crit)
                        //expire hot
                        if (this.targets[i].hots[a].duration<0) { //TODO: DO NOT HEAL FOR FULL GCD WHEN < GCD TIME LEFT
                            this.targets[i].hots.splice(a, 1)
                        }
                    }
                }
            }
        },
        testlmao() {
            this.targets = "AYY LMAO"
        }
    }
}