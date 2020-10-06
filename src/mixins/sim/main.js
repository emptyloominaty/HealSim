/* eslint-disable */
import heals from './init/heals'
import targets from './init/targets'
import healai from './loop/healAI'
import hots from './loop/hots'
import init from './loop/init'
import useAbility from './loop/useAbility'

export default {
    mixins: [heals,targets,healai,hots,init,useAbility],
    data() {
        return {
            stats:{int:1000,haste:10,crit:10,vers:10,mastery:50},
            targets:[]
        }
    },
    methods: {
        mainSim() {
            this.db = []
            //------------------------------------------------------------Init------------------------------------------
            this.stats = {int:1000,haste:10,crit:10,vers:10,mastery:50}
            this.targets = this.createTargets()
            this.heals = this.createHeals("mistweaver")
            this.hotsData = {"Renewing Mist":[2,5,9,10,11], "Enveloping Mist":[2], "Essence Font":[1,2,3,5,12,13,15,16,18,19,20], "Tear of Morning":[2]} //TEST
            let usedAbility

            //-----------------------------------------------------Loop Init--------------------------------------------
            this.loopInit() //calc gcd, hots,CDs,  TODO: BUFFs

            this.db.push(this.stats)
            this.db.push(this.hotsData)

            //-------------------------------------------------------loop-----------------------------------------------
            // TODO: healAi,Heals,Damages,Abilities,
            // usedAbility = this.heals[0]["vivify"].healFunc( this.stats, [1], 0, this.hotsData )
            usedAbility = this.heals[1]["envelopingMist"].healFunc( this.stats, [1], 0, this.hotsData, 1 )
            this.db.push(usedAbility)
            if (usedAbility.type==="heal") {
                //get target
                let target = usedAbility.healingToTargets[0].id
                // hot
                if (usedAbility.hotsData!==0) {
                    this.targets[target].hots = usedAbility.hotsData
                }
                // heal
                if (usedAbility.healingToTargets[0].heal>0) {
                    this.targets[target].heal(usedAbility.healingToTargets[0].heal)
                }
            } else if  (usedAbility.type==="damage") {

            }
            else if  (usedAbility.type==="ability") {

            }

            //TEST GET HEALTH OF ALL TARGETS---------------------------------
            for (let i = 0; i < this.targets.length; i++ ) {
                this.db.push("T"+ i +" : "+this.targets[i].health)
            }
            //------------------------------------------------------------------

           //usedAbility = heals[1]["envelopingMist"].healFunc( this.stats, [1], 0, this.hotsData, 1 )



            //------------------------------------------------end (create charts, redraw timeline)----------------------
            this.$store.commit('debug',this.db)
        }
    }
}