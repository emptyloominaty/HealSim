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
            //Config    //TODO: THUNDER FOCUS TEA!!
            let fightLength = 30 //sec
            let talents = {mistwrap: 0, chiBurst: 1,  jadeStatue: 0, refreshingJadeWind:0, chiJi: 1, upwelling: 0, risingMist: 1 }
            let stats = {int:679, haste:25.8, crit:38.8, vers:3.12, mastery:105.2}
            let mana = 100 //%
            let spec = "mistweaver"
            let target = 0
            let buffs = [{stat:"haste",increase:20,ppm:6,duration:6,lastproc:0,proc:60/2/*ppm*/,procced:0}] //proc stats
            let buffs2 = {everyGcd:["chiJi","yuLon"],chiJi:0,chiJiEnveloping:0,yuLon:0,}                        //other buffs

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
            console.log(this.targets)
            console.log(this.heals)
            /* TODO:
                  Enveloping Breath,  Legendaries , Conduits , Covenants
                  HealAI
                  Charts
                  Rotations
                  Mana/HPS Tables
                  Expel Harm
             */

            //------------------------
            this.overhealingDone = 0
            this.manaUsed = 0
            this.healingDone = 0
            this.healingFromHots = 0
            this.healingDoneArr = []
            this.damageDone = 0
            this.damageDoneArr = []

            for (let i = 0; i<this.heals.length; i++) {
                this.healingDoneArr[this.heals[i].name] = []
            }

            for (let i = 0; i<this.damages.length; i++) {
                this.damageDoneArr[this.damages[i].name] = []
            }

            //------------------------
            //TODO: CREATE LIST OF HEALS / DAMAGES WITH NAME AND ID  Heals{vivify:0,rRenewingMist:2,lifeCocoon:4}

            this.db.push(this.character.stats)
            for (let fl = 0; fl<fightLength; fl++) {
                //-----------------------------------------------------Loop Init----------------------------------------
                this.loopInit() //calc gcd, hots,CDs, mana regen, Target Buffs, Buffs(Healer), //TODO: stat buffs with duration
                this.db.push("Time: "+Math.round(this.time*10)/10+" <b>Hots:</b> "+JSON.stringify(this.hotsData))

                //-------------------------------------------------------loop-------------------------------------------
                //TEST TEST TEST TEST
                let randomTarget = Math.floor(Math.random()*this.friendlyTargets.length)
                //Renewing Mist
                this.usedAbility = this.heals[2].healFunc(this.character, [randomTarget], 0, this.hotsData, this.injuredTargets)


                if (this.usedAbility===0) { //Life Cocoon
                    this.usedAbility = this.heals[4].healFunc(this.character, [1], 0, this.hotsData, this.injuredTargets, this.targets[this.character.target])     //TODO ADD Increase healing EM + LifeCocoon
                }

                if (this.usedAbility===0) { //Revival
                    this.usedAbility = this.heals[3].healFunc(this.character, this.friendlyTargets, 0, this.hotsData, this.injuredTargets)
                }

                if (this.usedAbility===0) { //Refreshing Jade Wind
                    this.usedAbility = this.heals[10].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
                }

                if (this.usedAbility===0) { //Yu'Lon
                    this.usedAbility = this.heals[7].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
                }

                if (this.usedAbility===0) { //Chi Ji
                    this.usedAbility = this.heals[9].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)

                }

                if (this.usedAbility===0) { //Rising Sun Kick
                    this.usedAbility = this.damages[0].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData, this.enemyTargets, this.targets)
                }
                if (this.usedAbility===0) { //Chi Burst
                    this.usedAbility = this.damages[3].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData, this.enemyTargets,this.friendlyTargets)
                }
/*
                if (this.usedAbility===0) { //Blackout Kick
                    this.usedAbility = this.damages[1].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,this.enemyTargets)
                }


                if (this.usedAbility===0) { //Tiger Palm
                    this.usedAbility = this.damages[2].dmgFunc(this.character, [this.enemyTargets[0]], 0, this.hotsData,this.enemyTargets)
                }
*/


                /*if (this.usedAbility===0) { //Soothing Mist
                    this.usedAbility = this.heals[6].healFunc(this.character.stats, [randomTarget], 0, this.hotsData, this.injuredTargets)
                }*/


                if (this.usedAbility===0) { //Essence Font
                    this.usedAbility = this.heals[5].healFunc(this.character, [0], 0, this.hotsData, this.injuredTargets)
                }


                if (this.usedAbility===0) { //Vivify
                    this.usedAbility = this.heals[0].healFunc(this.character, [1], 0, this.hotsData, this.injuredTargets)
                }
                //TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST

                this.useAbility()

                this.db.push("Mana: "+Math.round(this.character.mana*100)/100)
            }
            console.log(this.healingDoneArr)
            console.log(this.damageDoneArr)
            //------------------------------------------------end (create charts, redraw timeline)----------------------
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