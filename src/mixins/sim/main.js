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
            this.healerMana = 100
            let fightLength = 20
            this.stats = {int:13900,haste:10,crit:10,vers:10,mastery:70}
            this.character = {mana:100, spec: "mistweaver"}

            this.time = 0
            this.targets = this.createTargets()  //TODO: raid / dung /
            this.heals = this.createHeals(this.character.spec)
            this.hotsData = {}
            this.usedAbility = {manaUsed:0,gcd:0}

            //test vars
            this.manaUsed = 0
            this.healingDone = 0
            this.healingFromHots = 0

            this.db.push(this.stats)
            for (let fl = 0; fl<fightLength; fl++) {
                //-----------------------------------------------------Loop Init----------------------------------------
                this.loopInit() //calc gcd, hots,CDs, mana regen,  TODO: BUFFs,

                this.db.push(this.hotsData)
                //-------------------------------------------------------loop-------------------------------------------
                // TODO: healAi,Heals,Damages,Abilities,
                this.usedAbility = this.heals[1].healFunc(this.stats, [fl], 0, this.hotsData,1) //TODO: ONLY ONE FUNCTION FOR ALL HEALS!
                this.useAbility()                                                               //TODO: RENEWING MIST NOT WORKING + RENEWING MIST JUMPING!
                this.db.push(this.character.mana)


                //TEST GET HEALTH OF TARGETS---------------------------------
                /*this.db.push("T" + 5 + " : " + this.targets[5].health)
                this.db.push("T" + 6 + " : " + this.targets[6].health)*/
                //------------------------------------------------------------------



            }
            //------------------------------------------------end (create charts, redraw timeline)----------------------
            let totalHealingDone = this.healingFromHots + Math.round(this.healingDone)
            this.db.push("----------------------------------------------")
            this.db.push("Mana Used: "+ Math.round(this.manaUsed*100)/100)
            this.db.push("Healing Done: "+ Math.round(this.healingDone)+" Hots: ("+this.healingFromHots+") + Total: "+ totalHealingDone)
            this.$store.commit('debug',this.db)

        }
    }
}