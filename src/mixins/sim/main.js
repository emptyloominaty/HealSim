/* eslint-disable */
import heals from './init/heals'
import damages from './init/damages'
import targets from './init/targets'
import healai from './loop/healAI'
import hots from './loop/hots'
import dots from './loop/dots'
import init from './loop/init'
import useAbility from './loop/useAbility'
import healdmgFunctions from './healDmgFunctions'

export default {
    mixins: [heals,damages,targets,healai,hots,dots,init,useAbility,healdmgFunctions],
    methods: {
        mainSim() {
            this.db = []
//Init------------------------------------------------------------------------------------------------------
            let storeData = this.$store.state.healSetting
            let storeClassData = this.$store.state.classSettings
            let shadowlandsData = this.$store.state.shadowlandsData
        //Config
            let fightLength = storeData.fightLength
            let talents = {mistwrap: 0, chiBurst: 0, manaTea:0, jadeStatue: 0, refreshingJadeWind:0, chiJi: 0,focusedThunder:0, upwelling: 0, risingMist: 0,}
            let stats = this.$store.state.stats
            let mana = 100 //%
            let spec = "mistweaver"
            let target = 0
            let buffs = this.$store.state.buffs.slice(0) //proc stats
            let buffs2 = {everyGcd:["chiJi","yuLon","manaTea","ancientTeachingOfTheMonastery"],
                chiJi:0,chiJiEnveloping:0,yuLon:0,thunderFocusTea:0,manaTea:0,ancientTeachingOfTheMonastery:0}  //class/specs buffs
            let raidersHealth = [20000,30000,20000,20000,20000,20000,30000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000]
            let tanks = [1,6]
            let legendaries = {tearOfMorning:0, ancientTeachingOfTheMonastery:0, yulonWhisper:0, invokersDelight:0}
            let covenant = "" //
            let conduits = [] //

            //check for legendaries
            if (shadowlandsData.legendaries.length>0) {
                for (let i = 0; i<shadowlandsData.legendaries.length ;i++) {
                    legendaries[shadowlandsData.legendaries[i]]=1
                }
            }

            let legendariesData = {
                mistweaver: { atoftmDuration:15,atoftmHeal:2.5,invokersDelightDuration:20,invokersDelightAmount:33,yulonWhisperHeal:1.50*3,yulonWhisperTargets:6,}
            }

        //talents
            let talentsStore = this.$store.state.talents
            if (talentsStore.length>0) {
                for (let i = 0; i<talentsStore.length; i++) {
                    talents[talentsStore[i].value]=1
                }
            }

        //boss
            let bossFightData = storeData.bossFight
            let bossDamageAbilities = []
            for (let i = 0; i<bossFightData.length-1; i++) {
                bossDamageAbilities.push(bossFightData[i+1])
                bossDamageAbilities[i].used=0
                bossDamageAbilities[i].cd=0
            }

            let infiniteHp = 0
            if (storeData.simModeInfinite==="time") {
                infiniteHp = 1
            }
            console.log(infiniteHp+""+storeData.simModeInfinite)

        //targets
            let fff = storeData.simMode.split("-")
            this.character = { mana: mana, spec: spec,target: target, talents: talents, stats: stats, buffs: buffs, buffs2: buffs2, temporaryBuffs: [],
                conduits:conduits, convenant:covenant, legendaries: legendaries,legendariesData:legendariesData,storeClassData:storeClassData
            }
            this.targets = this.createTargets(fff[0],fff[1]-1,raidersHealth,bossFightData[0].bossHealth,bossFightData[0].addsHealth,infiniteHp,1.2)
            this.targets[target].stats = this.character.stats
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

            //console.log(this.targets)
            //console.log(this.heals)
            this.db.push(this.character.stats)
//LOOP START------------------------
            for (let fl = 0; fl<fightLength; fl++) {
//Loop Init---------------------------------------------------------------------------------------------
                let healGcd = this.healingDone
                let dmgGcd = this.damageDone
                //calc gcd, hots,CDs, mana regen, Target Buffs, Buffs(Healer),

                this.loopInit()

                this.db.push("Time: "+Math.round(this.time*10)/10+" <b>Hots:</b> "+JSON.stringify(this.hotsData))
//loop--------------------------------------------------------------------------------------------------

            //Heal AI
                this.usedAbility = this.healAi(healList,damageList,fightLength,fl,infiniteHp)

                this.useAbility()

                this.db.push("Mana: "+Math.round(this.character.mana*100)/100)


                  //boss abilities-------------------------------------------------------------------
                       //{time:0,everySec:5,damage:1000,targets:1,name:"bigdmg",dot:{isDot:0,dotData:{damage:0,duration:0,maxDuration:0,dispellable:0,dotType:"enemy"}}}, //1-dmg
                       for (let ba = 0; ba<bossDamageAbilities.length; ba++) {
                           let bAbility = bossDamageAbilities[ba]
                           if (bAbility.used===0 && bAbility.time<this.time && this.friendlyTargets.length>0) {

                               //(damage,name,target,who,dot = 0)
                               let dontInfiniteLoopPls = 0
                               for (let t = 0; t<bAbility.targets; t++) {
                                   let rngTarget = Math.round(Math.random() * (this.friendlyTargets.length))
                                   if (rngTarget===this.friendlyTargets.length) { rngTarget=0 }

                                   let target = this.friendlyTargets[rngTarget]
                                   if (this.targets[target].health>0) {
                                       this.doDamage(bAbility.damage, bAbility.name, target, "enemy")
                                       if (bAbility.dot.isDot===1) {
                                           this.targets[target].applyDot(bAbility.dot.dotData)
                                       }
                                   } else {
                                       if (dontInfiniteLoopPls<100) {
                                           dontInfiniteLoopPls++
                                           t--
                                       }
                                   }
                               }
                               bAbility.used=1
                           }
                           if (bAbility.used===1) {
                               bAbility.cd+=this.gcd
                               if(bAbility.cd>=bAbility.everySec) {
                                   bAbility.used=0
                                   bAbility.cd-=bAbility.everySec
                               }
                           }
                       }

                     //Boss AutoAttack
                if (this.targets[tanks[0]].health>0) {
                    //attack first tank
                    this.doDamage(bossFightData[0].bossAutoAttack*this.gcd, "AutoAttack", tanks[0], "enemy")
                    if (this.enemyTargets.length>1) {
                        for (let i = 0; i<this.enemyTargets.length-1; i++) {
                            if (this.targets[this.enemyTargets[i+1]].health>0) {
                                this.doDamage(bossFightData[0].addAutoattack*this.gcd, "AutoAttack", tanks[0], "enemy")
                            }
                        }
                    }
                } else if (this.targets[tanks[1]] && this.targets[tanks[1]].health>0) {
                    //attack second tank
                    this.doDamage(bossFightData[0].bossAutoAttack*this.gcd, "AutoAttack", tanks[1], "enemy")
                    if (this.enemyTargets.length>1) {
                        for (let i = 0; i<this.enemyTargets.length-1; i++) {
                            if (this.targets[this.enemyTargets[i+1]].health>0) {
                                this.doDamage(bossFightData[0].addAutoattack*this.gcd, "AutoAttack", tanks[1], "enemy")
                            }
                        }
                    }
                } /*else {
                                           //attack random target
                                           console.log(this.friendlyTargets[Math.round(Math.random()*this.friendlyTargets.length)])
                                           this.doDamage(bossFightData[0].bossAutoAttack*this.gcd, "AutoAttack", this.friendlyTargets[Math.round(Math.random()*this.friendlyTargets.length)], "enemy")
                                           if (this.enemyTargets.length>1) {
                                               for (let i = 0; i<this.enemyTargets.length-1; i++) {
                                                   if (this.targets[this.enemyTargets[i]].health>0) {
                                                       this.doDamage(bossFightData[0].addAutoattack*this.gcd, "AutoAttack", this.friendlyTargets[Math.round(Math.random()*this.friendlyTargets.length)], "enemy")
                                                   }
                                               }
                                           }
                                       }*/
                                   //--------------------------------------------------------------------------------------

                //Raid Attack
                for (let ft = 0; ft<this.friendlyTargets.length-1; ft++) {
                    let doData = this.targets[this.friendlyTargets[ft]].doSomething()
                    if (doData.damage!=undefined) {
                        this.doDamage(doData.damage,doData.name,this.enemyTargets[0],"friendly",0,)
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
                    usedAbility2:"",
                    damageDone:dmgGcd,
                    healingDone:healGcd,
                    character:JSON.parse(JSON.stringify(this.character)),
                    usedAbilityFileName:"",
                    usedAbilityFileName2:"",
                    usedAbilityData:JSON.parse(JSON.stringify(this.usedAbility)),
                    upwelling: 0,
                    targets:JSON.parse(JSON.stringify(this.targets)),
                    mana:this.character.mana,
                    haste:this.character.stats.haste,
                    raidHealth:this.raidHealth,
                    bossHealth:this.targets[this.enemyTargets[0]].health,
                    heals: [],
                    healArr: [],
                    damageArr: [],
                }
                // eslint-disable-next-line no-prototype-builtins
            if (this.usedAbility.hasOwnProperty('upwelling')) {
                    timeline[fl].upwelling =  Math.floor(this.usedAbility.upwelling)
                }

                //WIPE THE RAID
                if (this.raidHealth<(this.targets[0].maxHealth/10)) {
                    fl = fightLength+1
                }
                //BOSS IS DEAD
                if (this.targets[this.enemyTargets[0]].health<1) {
                    fl = fightLength+1
                }

            }
//LOOP END (create charts, redraw timeline)----------------------------------------------------------------------
            console.log(this.healingDoneArr)
            //console.log(this.damageDoneArr)
            let totalHealingDone = (Math.round(this.healingDone))-this.overhealingDone
            this.db.push("----------------------------------------------")
            this.db.push("Mana Used: "+ Math.round(this.manaUsed*100)/100)
            this.db.push("Healing Done: "+ totalHealingDone)
            this.db.push("OverHealing Done: "+this.overhealingDone)
            this.db.push("-----------")
            this.db.push("Damage Done: "+this.damageDone)

            if (this.$store.state.debug===1) {
                this.$store.commit('debug',this.db)
            }


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

            this.generateStackedChartData(timeline,"healingDoneArr",[],"setChartStacked",0.3)

            timeline[0].heals = this.heals
            timeline[0].healArr = this.healingDoneArr
            timeline[0].damageArr = this.damageDoneArr



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
                        pointStyle: "circle",
                        pointBorderColor: "rgba(0,0,0,0)",
                        pointBackgroundColor: "rgba(0,0,0,0)",
                        pointRadius: 6,
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
                        pointStyle: "circle",
                        pointBorderColor: "rgba(0,0,0,0)",
                        pointBackgroundColor: "rgba(0,0,0,0)",
                        pointRadius: 6,
                        lineTension:lineTension[0],
                        pointHoverRadius: 7,
                    },   {
                        yAxisID: 'B',
                        label: nameLabel[1],
                        fontColor: '#ffffff',
                        borderColor: lineColor[1],
                        data: data[1],
                        pointStyle: "circle",
                        pointBorderColor: "rgba(0,0,0,0)",
                        pointBackgroundColor: "rgba(0,0,0,0)",
                        pointRadius: 6,
                        lineTension:lineTension[1],
                        pointHoverRadius: 7,
                    },
                ]
            }
            this.$store.commit(store,chartdata)
        },
        generateStackedChartData(timeline,name,nameLabel,store,lineTension) {
            const colors = {
                yellow: {
                    stroke: '#f9ff6a',
                },
                orange: {
                    stroke: '#e78b24',
                },
                red: {
                    stroke: '#9e3e3c',
                },
                pink2: {
                    stroke: '#ffa7cb',
                },
                green2: {
                    stroke: '#80ea80',
                },
                lightBlue: {
                    stroke: '#00cddd',
                },
                darkBlue: {
                    stroke: '#166fbf',
                },
                white: {
                    stroke: '#fffdff',
                },
                darkBlue2: {
                    stroke: '#92bed2',
                },
                purple2: {
                    stroke: '#9b8ec8',
                },
                pink: {
                    stroke: '#FF69B4',
                },
                green: {
                    stroke: '#98b86e',
                },
                yellow2: {
                    stroke: '#c8c280',
                },
                orange2: {
                    stroke:  '#c8a985',
                },
                red2: {
                    stroke: '#c8807d',
                },
                white2: {
                    stroke: '#b4afac',
                },
                darkGreen: {
                    stroke: '#006400',
                },
                purple: {
                    stroke: '#75539e',
                },
                darkGreen2: {
                    stroke: '#4ca244',
                },
                greenYellow2: {
                    stroke: '#98c96e',
                },
                greenYellow: {
                    stroke: '#ADFF2F',
                }
            }

            function getAvgValues(data) {
                let avg = []
                let val = [0,0,0,0,0]
                for (let i = 0; i<data.length; i++) {
                    val.splice(0,1)
                    val.push(data[i])
                    avg[i] = (val[0]+val[1]+val[2]+val[3]+val[4])/5
                }
                return avg
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

                     for (let b=0; b<dataArray[dataArrayKeys[a]].length ; b++) {   //HEAL LOOP

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


           for (let a=0; a<dataArrayKeys.length ; a++) {
               data[a]=getAvgValues(data[a])
            }






            let length = dataArrayKeys.length
            for (let a=0; a<length ; a++) {
                const arr = data[a]
                if (arr==undefined) {break;}
                const someIsNotZero = arr.some(item => item !== 0)
                const isAllZero = !someIsNotZero
                if (isAllZero) {
                    dataArrayKeys.splice(a,1)
                    data.splice(a,1)
                    a--
                }

            }

            for (let a=0; a<dataArrayKeys.length ; a++) {
                nameLabel.push(dataArrayKeys[a])
            }

            //generate dataset
            let datasets = []
            for (let i = 0; i<nameLabel.length; i++) {
                datasets.push({
                    fill: true,
                    backgroundColor: colors[colorsNames[i]].stroke,
                    label: nameLabel[i],
                    fontColor: '#ffffff',
                    borderColor: "rgba(0,0,0,0)",
                    pointStyle: "circle",
                    pointBorderColor: "rgba(0,0,0,0)",
                    pointBackgroundColor: "rgba(0,0,0,0)",
                    pointRadius: 6,
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