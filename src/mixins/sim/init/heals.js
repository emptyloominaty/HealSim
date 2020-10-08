/* eslint-disable */
import hfviv from './mistweaver/vivify'
import hfem from './mistweaver/envelopingMist'
import hfrm from './mistweaver/renewingMist'

export default {
    mixins: [hfviv,hfem,hfrm],
    methods: {
        createHeals(healSpec) {
            let heals = []

            class Heal {
                constructor(name,manaCost,timeCast,cooldown,charges,hasteCdReduce,healFunc) {
                    this.name = name
                    this.manaCost = manaCost
                    this.timeCast = timeCast
                    this.cooldown = cooldown
                    this.maxCooldown = cooldown
                    this.hasteCdReduce = hasteCdReduce
                    this.charges = charges
                    this.maxCharges = charges
                    this.healFunc = healFunc
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
            }

            switch(healSpec) {
                //MW Monk
                case "mistweaver":
                    heals = [new Heal("Vivify",4.1,1.5,0,1,0,this.healFuncViv()),
                        new Heal("Enveloping Mist",6.0,2.0,0,1,0,this.healFuncEm()),
                        new Heal("Renewing Mist",2.2,1.5,9,2,0,this.healFuncRM()),
                        new Heal("Soothing Mist",0.4,1,0,1,0),
                        new Heal("Revival",4.374,1.5,180,1,0),
                        new Heal("Life Cocoon",2.4,1.5,120,1,0),
                        new Heal("Essence Font",7.2,3.0,12,1,0) ,        //time cast upwelling 6sec
                        new Heal("Yu'lon",5.0,1.5,180,1,0),
                        new Heal("Expel Harm",3.0,1.5,15,1,0),
                        //talents
                        new Heal("Refreshing Jade Wind",3.5,0,9,1,1),
                        new Heal("Chi Burst",0,1.5,0,1,0),
                        //passive
                        new Heal("Soothing Mist-Statue",0,1.5,0,1,0),
                        new Heal("Chi-Ji",0,0,0,1,0)  ,                        //wotc  mana cost = 5k activate
                        new Heal("Rising Mist",0,0,0,1,0),
                        //legendary
                        new Heal("Ancient Teachings of the Monastery",0,0,0,1,0),
                        new Heal("Tear of Morning",0,0,0,1,0),
                        new Heal("Yu'lon's Whisper",0,0,0,1,0)]
                    break;
                //Resto Druid
                //Resto Shaman
                //Holy Paladin
                //Disc Priest
                //Holy Priest
            }

            return heals
        }
    }
}