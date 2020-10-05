/* eslint-disable */

export default {
    data() {
        return {
        }
    },
    methods: {
        getHots(targets) {
            let targetsHots = {"Renewing Mist":[], "Enveloping Mist":[], "Essence Font":[], "Tear of Morning":[]}
            for (let i = 0; i < targets.length; i++ ) {
                if (targets[i].hots.length>0) {
                    for (let a = 0; a < targets[i].hots.length; a++ ) {
                        let hotName = targets[i].hots[a].name
                        targetsHots[hotName].push(i)
                    }
                }
            }
            return targetsHots
        },
        healHots(targets,stats,gcd) {
            for (let i = 0; i < targets.length; i++ ) {
                if (targets[i].hots.length>0) {
                    for (let a = 0; a < targets[i].hots.length; a++ ) {
                        //+ gcd
                        targets[i].hots[a].duration = targets[i].hots[a].duration - gcd
                        //heal the target
                        targets[i].heal(((targets[i].hots[a].heal * (1 + (stats.haste / 100))) / targets[i].hots[a].maxDuration) * gcd)
                        //expire hot
                        if (targets[i].hots[a].duration<0) { //TODO: DO NOT HEAL FOR FULL GCD WHEN < GCD TIME LEFT
                            targets[i].hots.splice(a, 1)
                        }
                    }
                }
            }
            return targets
        }
    }
}