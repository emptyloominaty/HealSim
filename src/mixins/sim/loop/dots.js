/* eslint-disable */

export default {
    methods: {
        damageDots(gcd) {
            let stats = this.character.stats
            for (let i = 0; i < this.targets.length; i++ ) {
                if (this.targets[i].dots.length>0) {
                    for (let a = 0; a < this.targets[i].dots.length; a++ ) {

                        //+ gcd
                        this.targets[i].dots[a].duration -= gcd
                        let dotTimeLeft = this.targets[i].dots[a].duration
                        //crit chance
                        let crit = this.damages[0].critChance(stats.crit)
                        let damage = 0
                        //damage the target
                        if (this.targets[i].dots[a].scaleWithHaste===1) {
                            damage = (((this.targets[i].dots[a].damage * (1 + (stats.haste / 100))) / this.targets[i].dots[a].maxDuration) * gcd)*crit
                        } else {
                            damage = (((this.targets[i].dots[a].damage) / this.targets[i].dots[a].maxDuration) * gcd)*crit
                        }
                        damage = damage * (1+this.targets[i].healingBonus)

                        if (dotTimeLeft<gcd) {
                            damage = damage - (damage / (gcd/dotTimeLeft))
                        }

                        damage = Math.round(damage)

                        if (this.targets[i].dots[a].dotType==="friendly" ) {
                            this.doDamage(damage,this.targets[i].dots[a].name,i,"healer",1)
                        } else {
                            this.doDamage(damage,this.targets[i].dots[a].name,i,"enemy",1)
                        }
                        //expire dot
                        if (dotTimeLeft<0) {
                            this.targets[i].dots.splice(a, 1)
                        }
                    }
                }
            }
        }
    }
}