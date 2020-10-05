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
        }
    },
    methods: {
        mainSim() {
            // heal sim test-------------------------------------------------------
            //Init
            let stats = {int:1000,haste:10,crit:10,vers:10,mastery:50}      //TEST
            let heals = this.createHeals("mistweaver")
            let targets = this.createTargets() //20 + 1 Boss
            let hots = {"Renewing Mist":[2,5,9,10,11], "Enveloping Mist":[2], "Essence Font":[1,2,3,5,12,13,15,16,18,19,20], "Tear of Morning":[2]} //TEST
            let gcd = 1.5 //test
            //Loop Init
            for (let xd = 0; xd < 15; xd++ ) { //TEST TEST TEST
                gcd = 1.5 / (1 + (stats.haste / 100))
                hots = this.getHots(targets)
                targets = this.healHots(targets,stats,gcd)
                console.log(targets[1].health)

            }
            console.log(hots)
            //loop
            console.log(heals[0]["vivify"].healFunc( stats, [1], 0, hots ))
            console.log(heals[1]["envelopingMist"].healFunc( stats, [1], 0, hots, 1 ))



            //end (create charts, redraw timeline)
            //----------------------------------------------------------------------
        }
    }
}