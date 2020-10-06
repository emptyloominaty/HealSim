/* eslint-disable */
import heals from './init/heals'
import targets from './init/targets'
import healai from './loop/healAI'
import hots from './loop/hots'
import init from './loop/init'
import sim from './loop/sim'

export default {
    mixins: [heals,targets,healai,hots,init,sim],
    data() {
        return {
            stats:{int:1000,haste:10,crit:10,vers:10,mastery:50},
            targets:[]
        }
    },
    methods: {
        mainSim() {
            // heal sim test-------------------------------------------------------
            //Init
            this.stats = {int:1000,haste:10,crit:10,vers:10,mastery:50}
            this.targets = this.createTargets()
            let heals = this.createHeals("mistweaver")
            this.hotsData = {"Renewing Mist":[2,5,9,10,11], "Enveloping Mist":[2], "Essence Font":[1,2,3,5,12,13,15,16,18,19,20], "Tear of Morning":[2]} //TEST
            let gcd = 1.5 //test
            let usedAbility
            //Loop Init
            for (let xd = 0; xd < 17; xd++ ) { //TEST TEST TEST
                gcd = 1.5 / (1 + (this.stats.haste / 100))
                this.getHots()
                this.healHots(gcd)
            }

            //loop
            usedAbility = heals[0]["vivify"].healFunc( this.stats, [1], 0, this.hotsData )
            console.log(usedAbility)
            if (usedAbility.type==="heal") {

            } else if  (usedAbility.type==="damage") {

            }
            else if  (usedAbility.type==="ability") {

            }

           console.log(this.targets)



            usedAbility = heals[1]["envelopingMist"].healFunc( this.stats, [1], 0, this.hotsData, 1 )



            //end (create charts, redraw timeline)
            //----------------------------------------------------------------------
        }
    }
}