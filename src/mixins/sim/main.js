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
            this.raidHealth = 0
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


                timeline[fl] = {
                    id:fl,
                    time:this.time.toFixed(1),
                    rems:this.hotsData["Renewing Mist"].length,
                    hots:JSON.parse(JSON.stringify(this.hotsData)),
                    manaUsed:this.usedAbility.manaUsed,
                    usedAbility:this.usedAbility.name,
                    usedAbility2:"", damageDone:dmgGcd,
                    healingDone:healGcd,
                    character:JSON.parse(JSON.stringify(this.character)),
                    usedAbilityFileName:"",
                    usedAbilityFileName2:"",
                    upwelling: 0,
                    targets:JSON.parse(JSON.stringify(this.targets)),
                    usedAbilityData:JSON.parse(JSON.stringify(this.usedAbility)),
                    mana:this.character.mana,
                    haste:this.character.stats.haste,
                    raidHealth:this.raidHealth,
                    bossHealth:this.targets[this.enemyTargets[0]].health,
                }
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

            this.generateChartData2(timeline,["raidHealth","bossHealth"],["Raid Health","Boss Health"],"setChartDataRaidHp",["#34c33b","#ce383e"],[0.5,0.5])

            this.generateStackedChartData(timeline,"healingDoneArr",[],"setChartStacked",0.2)
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
                    },
                ]
            }
            this.$store.commit(store,chartdata)
        },
        generateChartData2(timeline,name,nameLabel,store,lineColor,lineTension) {
            let labels = []
            let data = [[],[],[],[],[],[]]
            for (let i=0; i<timeline.length ; i++) {
                labels.push(timeline[i].time)
                for (let a=0; a<name.length ; a++) {
                    data[a].push(timeline[i][name[a]])
                }
            }
            let chartdata = {
                labels: labels,
                datasets: [
                    {
                        yAxisID: 'A',
                        label: nameLabel[0],
                        fontColor: '#ffffff',
                        borderColor: lineColor[0],
                        data: data[0],
                        pointRadius: 4,
                        lineTension:lineTension[0],
                        pointHoverRadius: 7,
                    },   {
                        yAxisID: 'B',
                        label: nameLabel[1],
                        fontColor: '#ffffff',
                        borderColor: lineColor[1],
                        data: data[1],
                        pointRadius: 4,
                        lineTension:lineTension[1],
                        pointHoverRadius: 7,
                    },
                ]
            }
            this.$store.commit(store,chartdata)
        },
        generateStackedChartData(timeline,name,nameLabel,store,lineTension) {
            const colors = {
                green: {
                    fill: '#a1eaa2',
                    stroke: '#5eb84d',
                },
                lightBlue: {
                    fill: '#abdcdd',
                    stroke: '#00cddd',
                },
                darkBlue: {
                    fill: '#92bed2',
                    stroke: '#166fbf',
                },
                purple: {
                    fill: '#9b8ec8',
                    stroke: '#75539e',
                },
                yellow: {
                    fill: '#c8c280',
                    stroke: '#c4be0b',
                },
                orange: {
                    fill: '#c8a985',
                    stroke: '#9e5f1b',
                },
                red: {
                    fill: '#c8807d',
                    stroke: '#9e3e3c',
                },
                white: {
                    fill: '#b4afac',
                    stroke: '#fffdff',
                },
                darkGreen: {
                    fill: '#4ca244',
                    stroke: '#006400',
                },
                greenYellow: {
                    fill: '#98c96e',
                    stroke: '#ADFF2F',
                },
                pink: {
                    fill: '#ffa7cb',
                    stroke: '#FF69B4',
                },

                green2: {
                    fill: '#a1eaa2',
                    stroke: '#5eb84d',
                },
                lightBlue2: {
                    fill: '#abdcdd',
                    stroke: '#00cddd',
                },
                darkBlue2: {
                    fill: '#92bed2',
                    stroke: '#166fbf',
                },
                purple2: {
                    fill: '#9b8ec8',
                    stroke: '#75539e',
                },
                yellow2: {
                    fill: '#c8c280',
                    stroke: '#c4be0b',
                },
                orange2: {
                    fill: '#c8a985',
                    stroke: '#9e5f1b',
                },
                red2: {
                    fill: '#c8807d',
                    stroke: '#9e3e3c',
                },
                white2: {
                    fill: '#b4afac',
                    stroke: '#fffdff',
                },
                darkGreen2: {
                    fill: '#4ca244',
                    stroke: '#006400',
                },
                greenYellow2: {
                    fill: '#98c96e',
                    stroke: '#ADFF2F',
                },
                pink2: {
                    fill: '#ffa7cb',
                    stroke: '#FF69B4',
                },
                darkGreen3: {
                    fill: '#4ca244',
                    stroke: '#006400',
                },
                greenYellow3: {
                    fill: '#98c96e',
                    stroke: '#ADFF2F',
                },
                pink3: {
                    fill: '#ffa7cb',
                    stroke: '#FF69B4',
                }
            }
            let colorsNames = Object.keys(colors)

            let dataArray = this[name]
            let dataArrayKeys = Object.keys(dataArray)

            let labels = []
            let data = []


            for (let i=0; i<timeline.length ; i++) { //TIME LOOP
                 let timeNow = timeline[i].time
                 labels.push(timeNow)

                 for (let a=0; a<dataArrayKeys.length ; a++) { //HEALS LOOP
                     if (!data[a]) {
                         data[a]=[]
                     }

                     for (let b=0; b<dataArray[dataArrayKeys[a]].length ; b++) {   //HEAL LOOP //TODO:   FUNCTION TO CALC AVG VALUE

                         if (Math.round(dataArray[dataArrayKeys[a]][b].time*10)/10 === +timeNow) { //dataArray[dataArrayKeys[a]][b] &&
                            // console.log(i+" ( "+timeNow+" ) "+dataArrayKeys[a]+"/////"+dataArray[dataArrayKeys[a]][b].heal)
                             if (data[a][i]) {
                                 data[a][i]+=(dataArray[dataArrayKeys[a]][b].heal)
                             } else {
                                 data[a][i]=(dataArray[dataArrayKeys[a]][b].heal)
                             }
                         }
                     }
                     if (!data[a][i]) {
                         data[a][i]=0
                     }

                 }
             }

            let length = dataArrayKeys.length
            for (let a=0; a<length ; a++) {
                const arr = data[a]
                if (arr==undefined) {break;}
                const someIsNotZero = arr.some(item => item !== 0)
                const isAllZero = !someIsNotZero // <= this is your result
                if (isAllZero) {
                    dataArrayKeys.splice(a,1)
                    data.splice(a,1)
                    a--
                }

            }
            console.log("XD")




            for (let a=0; a<dataArrayKeys.length ; a++) {
                nameLabel.push(dataArrayKeys[a])
            }

            //generate dataset
            let datasets = []
            for (let i = 0; i<nameLabel.length; i++) {
                datasets.push({
                    fill: true,
                    backgroundColor: colors[colorsNames[i]].fill,
                    label: nameLabel[i],
                    fontColor: '#ffffff',
                    borderColor: colors[colorsNames[i]].stroke,
                    pointHighlightStroke: colors[colorsNames[i]].stroke,
                    borderCapStyle: 'butt',
                    pointRadius: 2,
                    lineTension:lineTension,
                    pointHoverRadius: 7,
                    data: data[i],
                })
            }

            let chartdata = {
                labels: labels,
                datasets: datasets
            }
            this.$store.commit(store,chartdata)
        }
    }
}