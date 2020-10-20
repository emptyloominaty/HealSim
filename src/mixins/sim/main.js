/* eslint-disable */
import heals from './init/heals'
import damages from './init/damages'
import targets from './init/targets'
import healai from './loop/healAI'
import hots from './loop/hots'
import init from './loop/init'
import useAbility from './loop/useAbility'

export default {
    mixins: [heals,damages,targets,healai,hots,init,useAbility],
    methods: {
        mainSim() {
            this.db = []
            //------------------------------------------------------------Init------------------------------------------
            //Config
            let fightLength = 35 //sec
            let talents = {mistwrap: 0, chiBurst: 1,  jadeStatue: 0, refreshingJadeWind:0, chiJi: 1, upwelling: 0, risingMist: 1 }
            let stats = {int:679, haste:25.8, crit:38.8, vers:3.12, mastery:105.2}
            let mana = 100 //%
            let spec = "mistweaver"
            let target = 0
            let buffs = [{stat:"haste",increase:20,ppm:6,duration:6,lastproc:0,proc:60/2/*ppm*/,procced:0}] //proc stats
            let buffs2 = {everyGcd:["chiJi","yuLon","manaTea"],chiJi:0,chiJiEnveloping:0,yuLon:0,thunderFocusTea:0,manaTea:0}  //class/specs buffs

            this.character = {mana: mana, spec: spec,target: target, talents: talents, stats: stats, buffs: buffs, buffs2: buffs2, temporaryBuffs: []}
            this.targets = this.createTargets(20,1,20000,100000,0,2)
            this.friendlyTargets = []
            this.enemyTargets = []

            for (let i = 0; i<this.targets.length; i++) {
                if (this.targets[i].type==="friendly") {
                    this.friendlyTargets.push(this.targets[i])
                }
                if (this.targets[i].type==="enemy") {
                    this.enemyTargets.push(this.targets[i])
                }
            }

            this.injuredTargets = []
            this.time = 0
            this.heals = this.createHeals(this.character.spec,this.character.talents)
            this.damages = this.createDamages(this.character.spec,this.character.talents)
            this.hotsData = {}
            this.usedAbility = {manaUsed:0,gcd:0}
            /* TODO:
                  healer stat temporary buffs
                  Legendaries , Conduits , Covenants
                  HealAI
                  Charts
                  Rotations
                  Mana/HPS Tables
                  Expel Harm KEKW
             */

            //------------------------
            this.overhealingDone = 0
            this.manaUsed = 0
            this.healingDone = 0
            this.healingFromHots = 0
            this.healingDoneArr = []
            this.damageDone = 0
            this.damageDoneArr = []

            let healList = {}
            let damageList = {}
            for (let i = 0; i<this.heals.length; i++) {
                this.healingDoneArr[this.heals[i].name] = []
                healList[this.heals[i].name] = i
            }

            for (let i = 0; i<this.damages.length; i++) {
                this.damageDoneArr[this.damages[i].name] = []
                damageList[this.damages[i].name] = i
            }

            console.log(this.targets)
            console.log(this.heals)
            this.db.push(this.character.stats)
            //------------------------
            for (let fl = 0; fl<fightLength; fl++) {
                //-----------------------------------------------------Loop Init----------------------------------------

                //calc gcd, hots,CDs, mana regen, Target Buffs, Buffs(Healer),
                this.loopInit()

                this.db.push("Time: "+Math.round(this.time*10)/10+" <b>Hots:</b> "+JSON.stringify(this.hotsData))
                //-------------------------------------------------------loop-------------------------------------------

                //Heal AI
                this.usedAbility = this.healAi(healList,damageList)

                this.useAbility()

                this.db.push("Mana: "+Math.round(this.character.mana*100)/100)
            }
            //------------------------------------------------end (create charts, redraw timeline)----------------------
            console.log(this.healingDoneArr)
            console.log(this.damageDoneArr)
            let totalHealingDone = (this.healingFromHots + Math.round(this.healingDone))-this.overhealingDone
            this.db.push("----------------------------------------------")
            this.db.push("Mana Used: "+ Math.round(this.manaUsed*100)/100)
            this.db.push("Healing Done: "+ totalHealingDone)
            this.db.push("OverHealing Done: "+this.overhealingDone)
            this.db.push("-----------")
            this.db.push("Damage Done: "+this.damageDone)


            this.$store.commit('debug',this.db)

        }
    }
}