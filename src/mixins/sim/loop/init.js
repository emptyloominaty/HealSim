/* eslint-disable */

export default {
    methods: {
        loopInit() {
            //gcd
            if (this.usedAbility.gcd===0 || this.usedAbility===0 ) {
                this.gcd = 1.5 / (1 + (this.stats.haste / 100))
            } else {
                this.gcd = this.usedAbility.gcd
            }
            if (this.gcd<0.75) {
                this.gcd=0.75
            }
            this.time += this.gcd

            //mana regen
            this.character.mana+= 0.8 * this.gcd
            if (this.character.mana>100) {
                this.character.mana=100
            }

            //get injured targets
            this.injuredTargets = []
            for (let a = 0; a<this.targets.length; a++) {
                if (this.targets[a].health<this.targets[a].maxHealth) {
                    this.injuredTargets.push(a)
                }
            }
            //get hots
            let runGetHotsAgain = 0
            do {
                runGetHotsAgain = this.getHots()
            } while (runGetHotsAgain===1)


            //heal with hots
            this.healHots(this.gcd)

            //cd
            for (let i = 0; i < this.heals.length ; i++) {
                this.heals[i].incCd(this.gcd,this.stats)
            }


        }
    }
}