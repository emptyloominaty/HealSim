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
            let fightLength = 200 //sec
            let talents = {mistwrap: 0, chiBurst: 1,  jadeStatue: 0, refreshingJadeWind:0, chiJi: 1, upwelling: 0, risingMist: 1}
            let stats = {int:679, crit:25.8, haste:38.8, vers:3.12, mastery:105.2}
            let mana = 100 //%
            let spec = "mistweaver"
            let target = 0
            let buffs = [{stat:"haste",increase:20,ppm:6,duration:6,lastproc:0,proc:60/2/*ppm*/,procced:0}] //proc stats
            let buffs2 = {everyGcd:["chiJi","yuLon","manaTea"],chiJi:0,chiJiEnveloping:0,yuLon:0,thunderFocusTea:0,manaTea:0}  //class/specs buffs

            this.character = {mana: mana, spec: spec,target: target, talents: talents, stats: stats, buffs: buffs, buffs2: buffs2, temporaryBuffs: []}
            this.targets = this.createTargets(20,1,20000,1000000,0,1.2)
            this.friendlyTargets = []
            this.enemyTargets = []
            this.injuredTargets = []

            for (let i = 0; i<this.targets.length; i++) {
                if (this.targets[i].type==="friendly") {
                    this.friendlyTargets.push(this.targets[i])
                }
                if (this.targets[i].type==="enemy") {
                    this.enemyTargets.push(this.targets[i])
                }
            }

            let timeline = []
            this.time = 0
            this.heals = this.createHeals(this.character.spec,this.character.talents)
            this.damages = this.createDamages(this.character.spec,this.character.talents)
            this.hotsData = {}
            this.usedAbility = {manaUsed:0,gcd:0}

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
                let healGcd = this.healingDone
                let dmgGcd = this.damageDone
                //calc gcd, hots,CDs, mana regen, Target Buffs, Buffs(Healer),
                this.loopInit()

                this.db.push("Time: "+Math.round(this.time*10)/10+" <b>Hots:</b> "+JSON.stringify(this.hotsData))
                //-------------------------------------------------------loop-------------------------------------------

                //Heal AI
                this.usedAbility = this.healAi(healList,damageList,fightLength,fl)

                this.useAbility()

                this.db.push("Mana: "+Math.round(this.character.mana*100)/100)

                //TEST dmg
                for(let t = 0; t<this.friendlyTargets.length; t++ ) {
                    if (Math.random()>Math.random()) {
                        this.targets[t].dealDamage(100,"dmg") //value,name
                    }
                }
                //TEST dmg
                for(let t = 0; t<this.friendlyTargets.length; t++ ) {
                    if (Math.random()>Math.random()*5) {
                        this.targets[t].dealDamage(1000,"bigdmg")
                    }
                }

                healGcd = this.healingDone - healGcd
                dmgGcd = this.damageDone - dmgGcd


                timeline[fl] = {id:fl, time:this.time.toFixed(1), rems:this.hotsData["Renewing Mist"].length, hots:JSON.parse(JSON.stringify(this.hotsData)),
                    manaUsed:this.usedAbility.manaUsed, usedAbility:this.usedAbility.name, usedAbility2:"", damageDone:dmgGcd, healingDone:healGcd,
                    character:JSON.parse(JSON.stringify(this.character)), usedAbilityFileName:"", usedAbilityFileName2:"", upwelling: 0, targets:JSON.parse(JSON.stringify(this.targets)),
                    usedAbilityData:JSON.parse(JSON.stringify(this.usedAbility)),mana:this.character.mana,haste:this.character.stats.haste}

            if (this.usedAbility.hasOwnProperty('upwelling')) {
                    timeline[fl].upwelling =  Math.floor(this.usedAbility.upwelling)
                }
            }
            //------------------------------------------------end (create charts, redraw timeline)----------------------
            console.log(this.healingDoneArr)
            console.log(this.damageDoneArr)
            let totalHealingDone = (Math.round(this.healingDone))-this.overhealingDone
            this.db.push("----------------------------------------------")
            this.db.push("Mana Used: "+ Math.round(this.manaUsed*100)/100)
            this.db.push("Healing Done: "+ totalHealingDone)
            this.db.push("OverHealing Done: "+this.overhealingDone)
            this.db.push("-----------")
            this.db.push("Damage Done: "+this.damageDone)
            this.$store.commit('debug',this.db)

            let time1 = 0
            for (let i = 0; i<timeline.length; i++) {
                if (i>0 && timeline[i].time===timeline[i-1].time) {
                    timeline[i].usedAbility2=timeline[i-1].usedAbility
                    timeline[i].healingDone+= +timeline[i-1].healingDone
                    timeline[i].damageDone+= +timeline[i-1].damageDone
                    timeline[i].manaUsed+= +timeline[i-1].manaUsed
                    timeline.splice(i-1,1)
                    i--
                }
                timeline[i].damageDone = Math.round(timeline[i].damageDone)
                timeline[i].healingDone = Math.round(timeline[i].healingDone)
                timeline[i].usedAbilityFileName = timeline[i].usedAbility.replace(/\s+/g,'')
                timeline[i].usedAbilityFileName2 = timeline[i].usedAbility2.replace(/\s+/g,'')
            }


            this.generateChartData(timeline,"rems","ReMs","setChartData","#78f871",0)
            this.generateChartData(timeline,"mana","Mana","setChartDataMana","#6edcf8",0.4)
            this.generateChartData(timeline,"damageDone","Damage","setChartDataDamage","#ce383e",0.4)
            this.generateChartData(timeline,"healingDone","Heal","setChartDataHeal","#05c300",0.5)
            this.generateChartData(timeline,"haste","Haste","setChartDataHaste","#a800c3",0.5)
            this.generateStackedChartData(timeline,"haste","Haste","setChartStacked","#a800c3",0.5)
            return timeline
        },
        generateChartData(timeline,name,nameLabel,store,lineColor,lineTension) {
            let labels = []
            let data = []
            for (let i=0; i<timeline.length ; i++) {
                labels.push(timeline[i].time)
                data.push(timeline[i][name])
            }

            let chartdata = {
                labels: labels,
                datasets: [
                    {
                        label: nameLabel,
                        fontColor: '#ffffff',
                        borderColor: lineColor,
                        data: data,
                        pointRadius: 4,
                        lineTension:lineTension,
                        pointHoverRadius: 7,
                    }
                ]
            }
            this.$store.commit(store,chartdata)
        },
        generateStackedChartData(timeline,name,nameLabel,store,lineColor,lineTension) {
            let labels = []
            let data = []
            for (let i=0; i<timeline.length ; i++) {
                labels.push(timeline[i].time)
                data.push(timeline[i][name])
            }

            let chartdata = {
                labels: labels,
                datasets: [
                    {
                        label: nameLabel,
                        fontColor: '#ffffff',
                        borderColor: lineColor,
                        data: data,
                        pointRadius: 4,
                        lineTension:lineTension,
                        pointHoverRadius: 7,
                    }
                ]
            }
            this.$store.commit(store,chartdata)
        }
    }
}