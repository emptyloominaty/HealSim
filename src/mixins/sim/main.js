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
            this.character = {mana:100, spec: "mistweaver"}


            this.time = 0
            this.targets = this.createTargets(20,1)
            this.heals = this.createHeals(this.character.spec)
            this.hotsData = {}
            this.usedAbility = {manaUsed:0,gcd:0}
            //test vars
            this.overhealingDone = 0
            this.manaUsed = 0
            this.healingDone = 0
            this.healingFromHots = 0

            this.db.push(this.stats)
            for (let fl = 0; fl<fightLength; fl++) {
                //-----------------------------------------------------Loop Init----------------------------------------//TODO: RENEWING MIST JUMPING!
                this.loopInit() //calc gcd, hots,CDs, mana regen,  TODO: BUFFs,
                this.db.push(this.hotsData)
                //-------------------------------------------------------loop------------------------------------------- // TODO: healAi,Heals,Damages,Abilities,
                //TEST TEST TEST TEST           //TODO: USEDABILITY WILL BE RETURNING TO HEALAI AND IF IT RETURN 0 GO TO NEXT????  //CAN ONLY CAST WHEN I HAVE MANA
                let randomTarget = Math.floor(Math.random()*19)
                this.usedAbility = this.heals[2].healFunc(this.stats, [randomTarget], 0, this.hotsData)

                if (this.usedAbility===0) {
                    this.usedAbility = this.heals[0].healFunc(this.stats, [19], 0, this.hotsData)
                }
                //TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST
                                                                                            //TODO: ONLY ONE FUNCTION FOR ALL HEALS!


                this.useAbility()

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