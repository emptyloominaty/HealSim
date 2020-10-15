/* eslint-disable */

export default {
    methods: {
        loopInit() {
            //gcd
            if (this.usedAbility.gcd===0 || this.usedAbility===0 ) {
                this.gcd = 1.5 / (1 + (this.character.stats.haste / 100))
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

            //get injured targets and friendly targets
            this.injuredTargets = []
            this.friendlyTargets = []
            this.enemyTargets = []
            for (let a = 0; a<this.targets.length; a++) {
                if (this.targets[a].health<this.targets[a].maxHealth && this.targets[a].type==="friendly" ) {
                    this.injuredTargets.push(a)
                }
                if (this.targets[a].type==="friendly") {
                    this.friendlyTargets.push(a)
                }
                if (this.targets[a].type==="enemy") {
                    this.enemyTargets.push(a)
                }
            }



            //get hots
            let runGetHotsAgain = 0
            let loops = 0
            do {
                runGetHotsAgain = this.getHots()
                loops++
            } while (runGetHotsAgain===1 && loops < 10)


            //heal with hots
            this.healHots(this.gcd)

            //buffs on targets
            for (let i = 0; i < this.targets.length ; i++) {
                this.targets[i].checkBuffs(this.gcd)
            }
            //cd
            for (let i = 0; i < this.heals.length ; i++) {
                this.heals[i].incCd(this.gcd,this.character.stats)
                this.heals[i].doEveryGcd(this.gcd)
            }

            for (let i = 0; i < this.damages.length ; i++) {
                this.damages[i].incCd(this.gcd, this.character.stats)
                this.damages[i].doEveryGcd(this.gcd)
            }

        }
    }
}