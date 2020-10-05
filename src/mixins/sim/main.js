/* eslint-disable */
import heals from './init/heals'
import targets from './init/targets'
import healai from './loop/healAI'
import hots from './loop/hots'
import init from './loop/init'
import sim from './loop/sim'        //MAIN LOOP

export default {
    mixins: [heals,targets,healai,hots,init,sim],
    data() {
        return {
        }
    },
    methods: {
        mainSim() {
            // heal sim test-------------------------------------------------------
            let heals = this.createHeals("mistweaver")
            let targets = this.createTargets()
            let hots = {remTargets:[2,5,9,10,11], emTargets:[2], efTargets:[1,2,3,5,12,13,15,16,18,19,20], tomTargets:[2]}
            
            console.log(heals[0]["vivify"].healFunc( {int:1000,haste:10,crit:10,vers:10,mastery:50}, [1], 0, hots ))
            console.log(heals[1]["envelopingMist"].healFunc( {int:1000,haste:10,crit:10,vers:10,mastery:50}, [1], 0, hots, 1 ))
            console.log(targets)
            //----------------------------------------------------------------------
        }
    }
}