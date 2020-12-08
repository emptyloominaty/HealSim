/* eslint-disable */
export default {
    methods: {
        doDamage(damage,name,target,who,dot = 0) {
            this.classThingsDamage(name)
            let bonus = this.checkForBuffs(target,name)
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
            this.classThingsHeal(name)
            let bonus = this.checkForBuffs(target,name)
            heal = heal * bonus
            this.overhealingDone += this.targets[target].heal(heal)
            this.targets[target].abilitiesOnThisTarget.push({name:name,value:heal,hot:hot,type:"heal",over:this.gcd})
            this.healingDone += heal
            //this.healingDoneArr[name].push( {time: this.time, heal: Math.floor(heal)})
            this.healingDoneArr[name][this.fl] += +Math.floor(heal)
           // console.log(+Math.floor(heal)+"/////"+this.healingDoneArr[name][this.fl])
        },
        checkForBuffs(target,name) {
            let bonus = 1
            let character = this.$store.state.global.character
            let targets = this.$store.state.global.targets

            //bonedust brew
            if (character.covenant==="necrolord") {
                for (let a = 0; a<targets[target].hots.length; a++) {
                    if (targets[target].hots[a].name==="Bonedust Brew") {
                        let random = Math.random()*100
                        if (random < 50) {
                            bonus += 0.35
                        }
                        if (name==="Gust of Mists") {
                            bonus += 0.42
                        }
                    }
                }
            }

            //conduit Resplendent Mist
            if (name==="Gust of Mists" && this.character.conduits.includes("resplendentMist") ) {
                let random = Math.random()*100
                if (random < 30) {
                    bonus += 0.80
                }
            }


            return bonus
        },
        classThingsHeal(name) {
            if (name==="Gust of Mists" && this.character.conduits.includes("jadeBond") ) {
                this.heals[this.healList["Yu'lon"]].cooldown+=0.3
                this.heals[this.healList["Chi-Ji Activate"]].cooldown+=0.3
            }
        },
        classThingsDamage(name) {
            if (name==="Rising Sun Kick" && this.character.conduits.includes("risingSunRevival") ) {
                this.heals[this.healList["Revival"]].cooldown+=1
            }



        }

    }
}