/* eslint-disable */
export default {
    methods: {
        doDamage(damage,name,target,who,dot = 0) {
            let bonus = this.checkForBuffs(target)
            if (who==="healer") {
                damage = damage * bonus
            }
            this.targets[target].dealDamage(damage,name)
            if (who==="healer") {
                this.damageDone += damage
                this.damageDoneArr[name].push( {time: this.time, damage: Math.floor(damage), dot:dot, over:this.gcd})
            }
        },
        doHealing(heal,name,target,who,hot) {
            let bonus = this.checkForBuffs(target)
            heal = heal * bonus
            this.overhealingDone += this.targets[target].heal(heal)
            this.targets[target].abilitiesOnThisTarget.push({name:name,value:heal,hot:hot,type:"heal",over:this.gcd})
            this.healingDone += heal
            this.healingDoneArr[name].push( {time: this.time, heal: Math.floor(heal)})
            //this.healingDoneArr[name][this.time] += Math.floor(heal)
        },
        checkForBuffs(target) {
            let bonus = 1
            let character = this.$store.state.global.character
            let targets = this.$store.state.global.targets

            //bonedust brew
            if (character.covenant==="necrolord") {
                for (let a = 0; a<targets[target].hots.length; a++) {
                    if (targets[target].hots[a].name==="Bonedust Brew") {
                        let random = Math.random()*100
                        if (random < 50) {
                            bonus = 1.35
                        }
                    }
                }
            }


            return bonus
        }
    }
}