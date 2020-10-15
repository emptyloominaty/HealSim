/* eslint-disable */
import dfTigerPalm from './mistweaver/damage/tigerPalm'
import dfBlackoutKick from './mistweaver/damage/blackoutKick'
import dfRisingSunKick from './mistweaver/damage/risingSunKick'

export default {
    mixins: [dfTigerPalm,dfBlackoutKick,dfRisingSunKick],
    methods: {
        createDamages(healSpec,talents) {
            let damages = []

            class Damage {
                constructor(name,manaCost,timeCast,cooldown,charges,hasteCdReduce,talents,dmgFunc) {
                    this.name = name
                    this.talents = talents
                    this.manaCost = manaCost
                    this.timeCast = timeCast
                    this.cooldown = cooldown
                    this.maxCooldown = cooldown
                    this.charges = charges
                    this.maxCharges = charges
                    this.hasteCdReduce = hasteCdReduce
                    this.dmgFunc = dmgFunc
                    this.spec = {}
                }

                incCd(gcd,stats) {
                   if (this.cooldown<this.maxCooldown) {
                       if (this.hasteCdReduce===1) {
                           this.cooldown += gcd * (1 + (stats.haste / 100))
                       } else {
                           this.cooldown += gcd
                       }
                       //charges
                       if (this.maxCharges>1) {
                           if (this.maxCharges>this.charges && this.cooldown>=this.maxCooldown ) {
                               this.charges++
                               this.cooldown=0
                           }
                       }
                   }
                }

                setCd() {
                    this.cooldown = 0
                    this.charges --
                }

                critChance(statCrit) {
                    let critChance = (Math.random()*100)
                    if (critChance < statCrit) {
                        return 2
                    }
                    return 1
                }

                doEveryGcd(gcd) {
                }

            }

            switch(healSpec) {
                //MW Monk
                case "mistweaver":
                    damages = [new Damage("Rising Sun Kick",1.5,1.5,12,1,1,talents,this.damageFuncRisingSunKick()),
                        new Damage("Blackout Kick",0,1.5,3,1,1,talents,this.damageFuncblackOutKick()),
                        new Damage("Tiger Palm",0,1.5,0,1,0,talents,this.damageFuncTigerPalm()),
                        new Damage("Chi-Ji",0,0,0,1,0,talents,), //passive
                        new Damage("Touch of Death",0,0,0,1,0,talents,), //
                        new Damage("Chi Burst",0,0,0,1,0,talents,), //
                    ]
                    break;
                //Resto Druid
                //Resto Shaman
                //Holy Paladin
                //Disc Priest
                //Holy Priest
            }

            return damages
        }
    }
}