/* eslint-disable */
export default {
    methods: {
        doDamage(damage,name,target,who,dot = 0) {
            this.targets[target].dealDamage(damage,name)
            if (who==="healer") {
                this.damageDone += damage
                this.damageDoneArr[name].push( {time: this.time, damage: Math.floor(damage)})
            }
        },
        doHealing(heal,name,target,who,hot) {

            this.overhealingDone += this.targets[target].heal(heal)
            this.targets[target].abilitiesOnThisTarget.push({name:name,value:heal,hot:hot,type:"heal"})
            this.healingDone += heal
            this.healingDoneArr[name].push( {time: this.time, heal: Math.floor(heal)})

        }
    }
}