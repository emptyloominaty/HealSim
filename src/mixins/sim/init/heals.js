/* eslint-disable */
import healsFunc from './healsFunc'

export default {
    mixins: [healsFunc],
    data() {
        return {
        }
    },
    methods: {
        createHeals(healSpec) {
            let heals = []
            if (healSpec=="") {
                healSpec = "mistweaver"
            }

            class Heal {
                constructor(name,manaCost,timeCast,cooldown,charges,hasteCdReduce,healFunc) {
                    this.name = name
                    this.manaCost = manaCost
                    this.timeCast = timeCast
                    this.cooldown = cooldown
                    this.charges = charges
                    this.healFunc = healFunc
                }


            }

            //MW Monk
            switch(healSpec) {
                case "mistweaver":
                    heals = [{vivify:new Heal("Vivify",4.1,1.5,0,1,0,this.healFuncViv)},
                        {},
                        {},
                        {},
                        {},
                        {},
                        {},
                        {},
                        {},
                        {},
                        {},
                        {},
                        {},
                        {},]


                    new Heal("Enveloping Mist",6.0,2.0,0,1,0)
                    new Heal("Soothing Mist",0.4,1,0,1,0)
                    new Heal("Renewing Mist",2.2,1.5,9,2,0)
                    new Heal("Revival",4.374,1.5,180,1,0)
                    new Heal("Life Cocoon",2.4,1.5,120,1,0)
                    new Heal("Essence Font",7.2,3.0,12,1,0)     //time cast upwelling 6sec
                    new Heal("Yu'lon",5.0,1.5,180,1,0)
                    new Heal("Expel Harm",3.0,1.5,15,1,0)

                    //talents
                    new Heal("Refreshing Jade Wind",3.5,0,9,1,1)
                    new Heal("Chi Burst",0,1.5,0,1,0)

                    //passive
                    new Heal("Soothing Mist-Statue",0,1.5,0,1,0)
                    new Heal("Chi-Ji",0,0,0,1,0)  //wotc  mana cost = 5k activate
                    new Heal("Rising Mist",0,0,0,1,0)

                    //legendary
                    new Heal("Ancient Teachings of the Monastery",0,0,0,1,0)
                    new Heal("Tear of Morning",0,0,0,1,0)
                    new Heal("Yu'lon's Whisper",0,0,0,1,0)

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