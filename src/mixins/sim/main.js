/* eslint-disable */
import heals from './init/heals'
import targets from './init/targets'
import healai from './loop/healAI'
import hots from './loop/hots'
import init from './loop/init'
import useAbility from './loop/useAbility'

export default {
    mixins: [heals,targets,healai,hots,init,useAbility],
    methods: {
        mainSim() {
            this.db = []
            //------------------------------------------------------------Init------------------------------------------
            //Config
            let fightLength = 22
            this.stats = {int:13900,haste:30,crit:44,vers:10,mastery:54}
            this.character = {mana:100, spec: "mistweaver",target: 0}
            this.targets = this.createTargets(20,1,500000,10000000,0,2)
            this.friendlyTargets = []

            for (let i = 0; i<this.targets.length; i++) {
                if (this.targets[i].type==="friendly") {
                    this.friendlyTargets.push(this.targets[i])
                }
            }
            this.injuredTargets = []
            this.time = 0
            this.heals = this.createHeals(this.character.spec)
            this.hotsData = {}
            this.usedAbility = {manaUsed:0,gcd:0}

            /* TODO:
                11-10-2020  Damages??? / More Heals
                12-10-2020  HealAI / Damages
                13-10-2020  HealAI + Buffs
                14-10-2020  HealAI
                15-10-2020  Charts
                16-10-2020  Rotations
                17-10-2020  Mana/HPS Tables
                18-10-2020  Bug Fixes + Release
             */

            //------------------------
            this.overhealingDone = 0
            this.manaUsed = 0
            this.healingDone = 0
            this.healingFromHots = 0
            //------------------------

            this.db.push(this.stats)
            for (let fl = 0; fl<fightLength; fl++) {
                //-----------------------------------------------------Loop Init----------------------------------------
                this.loopInit() //calc gcd, hots,CDs, mana regen, Target Buffs,   TODO: BUFFs(Healer),
                this.db.push(this.hotsData)
                //-------------------------------------------------------loop------------------------------------------- // TODO: healAi,Heals,Damages,Abilities,
                //TEST TEST TEST TEST           //TODO: USEDABILITY WILL BE RETURNING TO HEALAI AND IF IT RETURN 0 GO TO NEXT????  //CAN ONLY CAST WHEN I HAVE MANA
                let randomTarget = Math.floor(Math.random()*4)
                this.usedAbility = this.heals[2].healFunc(this.stats, [randomTarget], 0, this.hotsData)

                if (this.usedAbility===0) {
                    this.usedAbility = this.heals[4].healFunc(this.stats, [1], 0, this.hotsData, this.targets[this.character.target])                 //TODO ADD Increase healing EM + LifeCocoon
                }

                if (this.usedAbility===0) {
                    this.usedAbility = this.heals[3].healFunc(this.stats, this.friendlyTargets, 0, this.hotsData)
                }

                if (this.usedAbility===0) {
                    this.usedAbility = this.heals[0].healFunc(this.stats, [1], 0, this.hotsData)
                }
                //TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST



                this.useAbility()

                this.targets[1].dealDamage(30000)
                /*console.log("---------------")
                console.log(this.targets[0].absorb)
                console.log(this.targets[0].health)*/
                console.log(this.targets[1].absorb)
                console.log(this.targets[1].health)
                this.db.push(this.character.mana)


                //TEST GET HEALTH OF TARGETS---------------------------------
                /*this.db.push("T" + 5 + " : " + this.targets[5].health)
                this.db.push("T" + 6 + " : " + this.targets[6].health)*/
                //------------------------------------------------------------------



            }
            //------------------------------------------------end (create charts, redraw timeline)----------------------
            let totalHealingDone = (this.healingFromHots + Math.round(this.healingDone))-this.overhealingDone
            this.db.push("----------------------------------------------")
            this.db.push("Mana Used: "+ Math.round(this.manaUsed*100)/100)
            this.db.push("Healing Done: "+ totalHealingDone)
            this.db.push("OverHealing Done: "+this.overhealingDone)



            this.$store.commit('debug',this.db)

        }
    }
}