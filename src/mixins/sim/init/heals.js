/* eslint-disable */
import hfviv from './mistweaver/heal/vivify'
import hfem from './mistweaver/heal/envelopingMist'
import hfrm from './mistweaver/heal/renewingMist'
import hfrev from './mistweaver/heal/revival'
import hflc from './mistweaver/heal/lifeCocoon'
import hfef from './mistweaver/heal/essenceFont'
import hfrjw from './mistweaver/heal/refreshingJadeWind'
import hfsm from './mistweaver/heal/soothingMist'
import hfyul from './mistweaver/heal/yuLon'
import hfchijiact from './mistweaver/heal/chiJiActivate'
import hfchiji from './mistweaver/heal/chiJi'
import hfslwooa from './mistweaver/heal/shadowlands/weaponsOfOrderActivate'
import hfslwoo from './mistweaver/heal/shadowlands/weaponsOfOrder'

import hftft from './mistweaver/other/thunderFocusTea'
import hfmt from './mistweaver/other/manaTea'
import hfmp from './mistweaver/other/manaPotion'

export default {
    mixins: [hfviv,hfem,hfrm,hfrev,hflc,hfef,hfrjw,hfsm,hfyul,hfchiji,hfchijiact,hftft,hfmt,hfmp,hfslwooa,hfslwoo],
    methods: {
        createHeals(healSpec,talents) {
            let heals = []

            class Heal {
                constructor(name,manaCost,timeCast,cooldown,charges,hasteCdReduce,talents,healFunc) {
                    this.name = name
                    this.talents = talents
                    this.manaCost = manaCost
                    this.timeCast = timeCast
                    this.cooldown = cooldown
                    this.maxCooldown = cooldown
                    this.charges = charges
                    this.maxCharges = charges
                    this.hasteCdReduce = hasteCdReduce
                    this.healFunc = healFunc
                    this.spec = {upwellingStacks:0}
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
                    if (this.name==="Essence Font" && this.talents.upwelling===1) {
                        if (this.cooldown>=this.maxCooldown) {
                            if (this.spec.upwellingStacks < 18) {
                                this.spec.upwellingStacks += gcd
                            } else {
                                this.spec.upwellingStacks = 18
                            }
                        }
                    }
                }
            }

            switch(healSpec) {
                //MW Monk
                case "mistweaver":
                    heals = [new Heal("Vivify",4.1,1.5,0,1,0,talents,this.healFuncViv(),), //0
                        new Heal("Enveloping Mist",6.0,2.0,0,1,0,talents,this.healFuncEm()),
                        new Heal("Renewing Mist",2.2,1.5,9,2,0,talents,this.healFuncRM()),
                        new Heal("Revival",4.374,1.5,180,1,0,talents,this.healFuncRevival()),
                        new Heal("Life Cocoon",2.4,1.5,120,1,0,talents,this.healFuncLifeCocoon()),
                        new Heal("Essence Font",7.2,3.0,12,1,0,talents,this.healFuncEf()) ,
                        new Heal("Soothing Mist",0.4,1,8,1,0,talents,this.healFuncSM()), //cooldown for the statue
                        new Heal("Yu'lon",5.0,1.5,180,1,0,talents,this.healFuncYulon()),
                        new Heal("Expel Harm",3.0,1.5,15,1,0,talents,), //no
                        new Heal("Chi-Ji Activate",5.0,1.5,180,1,0,talents,this.healFuncChiJiActivate()),

                        //talents
                        new Heal("Refreshing Jade Wind",3.5,1.5,9,1,1,talents,this.healFuncRJW()),
                        new Heal("Chi Burst",0,0,0,1,0,talents,function() {return 0}),
                        //passive
                        new Heal("Rising Mist",0,0,0,1,0,talents,function() {return 0}),
                        new Heal("Soothing Mist - Yu'Lon",0,0,0,1,0,talents,function() {return 0}),
                        new Heal("Soothing Mist - Statue",0,0,0,1,0,talents,function() {return 0}),
                        new Heal("Chi-Ji",0,0,0,1,0,talents,this.healFuncChiJi()),
                        new Heal("Enveloping Breath",0,0,0,1,0,talents,function() {return 0}),

                        //covenants
                        new Heal("Weapons of Order",0,0,0,1,0,talents,this.healFuncSlWoo()),
                        new Heal("Weapons of Order Activate",5.0,0,120,1,0,talents,this.healFuncSlWooA()),

                        //legendary
                        new Heal("Ancient Teachings Of The Monastery",0,0,0,1,0,talents,function() {return 0}),
                        new Heal("Tear of Morning",0,0,0,1,0,talents,),
                        new Heal("Yu'lon's Whisper",0,0,0,1,0,talents,),
                        //mastery
                        new Heal ("Gust of Mists",0,0,0,1,0,talents,function() {return 0}),
                        //tft
                        new Heal ("Thunder Focus Tea",0,0,30,1,0,talents,this.healFuncTFT()),
                        new Heal ("Mana Tea",0,0,120,1,0,talents,this.healFuncManaTea()),
                        new Heal ("Mana Potion",0,0,300,1,0,talents,this.healFuncManaPotion()),

                    ]
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