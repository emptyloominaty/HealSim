/* eslint-disable */
import heals from './init/heals'
import damages from './init/damages'
import targets from './init/targets'
import healai from './loop/healAI'
import hots from './loop/hots'
import dots from './loop/dots'
import init from './loop/init'
import useAbility from './loop/useAbility'
import boss from './loop/boss'
import healdmgFunctions from './healDmgFunctions'


export default {
    mixins: [heals,damages,targets,healai,hots,dots,init,useAbility,healdmgFunctions,boss],
    methods: {
        mainSim() {
            let startTime = Date.now()
            let endTime,endTime2,endTime3
            this.db = []
//Init------------------------------------------------------------------------------------------------------
            let storeData = this.$store.state.healSetting
            let storeClassData = this.$store.state.classSettings
            let shadowlandsData = this.$store.state.shadowlandsData
        //Config
            let fightLength = storeData.fightLength
            let talents = {mistWrap: 0, chiBurst: 0, manaTea:0, jadeStatue: 0, refreshingJadeWind:0, chiJi: 0,focusedThunder:0, upwelling: 0, risingMist: 0,}
            let stats = this.$store.state.stats
            let mana = 100 //%
            let spec = "mistweaver"
            let target = 0
            let buffs = this.$store.state.buffs.slice(0) //proc stats
            let buffs2 = {everyGcd:["chiJi","yuLon","manaTea","ancientTeachingOfTheMonastery","weaponsOfOrder"],
                chiJi:0,chiJiEnveloping:0,yuLon:0,thunderFocusTea:0,manaTea:0,ancientTeachingOfTheMonastery:0,weaponsOfOrder:0}  //class/specs buffs
            let raidersHealth = [20000,30000,20000,20000,20000,20000,30000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000,20000]
            let tanks = [1,6] //TODO: change to threat ?????????
            let legendaries = {tearOfMorning:0, ancientTeachingOfTheMonastery:0, yulonWhisper:0, invokersDelight:0}
            let covenant = shadowlandsData.covenant
            let conduits = [] //

            //check for legendaries
            if (shadowlandsData.legendaries.length>0) {
                for (let i = 0; i<shadowlandsData.legendaries.length ;i++) {
                    legendaries[shadowlandsData.legendaries[i]]=1
                }
            }

            let legendariesData = {
                mistweaver: { atoftmDuration:15,atoftmHeal:2.5,
                    invokersDelightDuration:20,invokersDelightAmount:33,
                    yulonWhisperHeal:0.60*3,yulonWhisperTargets:6,
                    tomSpreadChance:10,tomVivCleave:1.2/* 20% */, tomEmRemHeal:0.2 /* 20% */,
                },
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
            if (bossFightData==undefined) {
                bossFightData= [ //test boss - Heroic
                    {name:"Test Boss - Heroic",bossHealth:1000000,addsHealth:10000,adds:0,addAutoattack:100,bossAutoAttack:150}, //0-data
                    {time:0,everySec:1,damage:1000,targets:3,name:"bigdmg",dot:{isDot:0,dotData:{damage:0,duration:0,maxDuration:0,dispellable:0,dotType:"enemy"}}}, //1-dmg
                    {time:0,everySec:1,damage:100,targets:10,name:"dmg",dot:{isDot:0,dotData:{damage:0,duration:0,maxDuration:0,dispellable:0,dotType:"enemy"}}}, //2-dmg
                    {time:0,everySec:5,damage:100,targets:1,name:"dot",dot:{isDot:1,dotData:{damage:500,duration:15,maxDuration:15,dispellable:0,dotType:"enemy",name:"dotdot"}}} //3-dmg dot
                ]
            }
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

        //targets
            let fff = storeData.simMode.split("-")
            this.character = { mana: mana, spec: spec,target: target, talents: talents, stats: stats, buffs: buffs, buffs2: buffs2, temporaryBuffs: [],
                conduits:conduits, covenant:covenant, legendaries: legendaries,legendariesData:legendariesData,storeClassData:storeClassData
            }
            this.targets = this.createTargets(fff[0],fff[1]-1,raidersHealth,bossFightData[0].bossHealth,bossFightData[0].addsHealth,infiniteHp,1.2)
            this.targets[target].stats = this.character.stats
            this.friendlyTargets = []
            this.enemyTargets = []
            this.injuredTargets = []

            this.$store.state.global.character = this.character
            this.$store.state.global.targets = this.targets

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
            this.healingDoneArr = []
            this.damageDone = 0
            this.damageDoneArr = []
            let avgRem = 0

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
            endTime = Date.now()
//LOOP START------------------------
            for (let fl = 0; fl<fightLength; fl++) {
                this.fl = fl
//Loop Init---------------------------------------------------------------------------------------------
                let healGcd = this.healingDone
                let dmgGcd = this.damageDone
                //calc gcd, hots,CDs, mana regen, Target Buffs, Buffs(Healer),

                this.loopInit(healList,fl)

                this.db.push("Time: "+Math.round(this.time*10)/10+" <b>Hots:</b> "+JSON.stringify(this.hotsData))
//loop--------------------------------------------------------------------------------------------------

            //Heal AI
                this.usedAbility = this.healAi(healList,damageList,fightLength,fl,infiniteHp)

                this.useAbility(healList,damageList)

                this.db.push("Mana: "+Math.round(this.character.mana*100)/100)

                this.doBoss(bossDamageAbilities,tanks,bossFightData)

                //Raid Attack
                for (let ft = 0; ft<this.friendlyTargets.length-1; ft++) {
                    let doData = this.targets[this.friendlyTargets[ft]].doSomething()
                    if (doData.damage!=undefined) {
                        this.doDamage(doData.damage,doData.name,this.enemyTargets[0],"friendly",0,)
                    }
                }

                healGcd = this.healingDone - healGcd
                dmgGcd = this.damageDone - dmgGcd
                avgRem += this.hotsData["Renewing Mist"].length

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
                    avgDps: 0,
                    avgRem: 0,
                    friendlyTargets: [],
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
            avgRem = avgRem / this.time
            //console.log(this.healingDoneArr)
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
            endTime2 = Date.now()
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
            timeline[0].avgDps = this.damageDone / this.time
            timeline[0].avgRem = avgRem
            timeline[0].friendlyTargets = this.friendlyTargets

            endTime3 = Date.now()
            console.log( "Sim: "+ +(endTime2 - startTime) +" ms"+" - Charts: "+ +(endTime3 - endTime2) +" ms"+" --- Total: "+ +(endTime3 - startTime)+" ms")

            /* TEST GET SIZE OBJECT*/
            function memorySizeOf(obj) {
                var bytes = 0;

                function sizeOf(obj) {
                    if(obj !== null && obj !== undefined) {
                        switch(typeof obj) {
                            case 'number':
                                bytes += 8;
                                break;
                            case 'string':
                                bytes += obj.length * 2;
                                break;
                            case 'boolean':
                                bytes += 4;
                                break;
                            case 'object':
                                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                                if(objClass === 'Object' || objClass === 'Array') {
                                    for(var key in obj) {
                                        if(!obj.hasOwnProperty(key)) continue;
                                        sizeOf(obj[key]);
                                    }
                                } else bytes += obj.toString().length * 2;
                                break;
                        }
                    }
                    return bytes;
                };

                function formatByteSize(bytes) {
                    if(bytes < 1024) return bytes + " bytes";
                    else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
                    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
                    else return(bytes / 1073741824).toFixed(3) + " GiB";
                };

                return formatByteSize(sizeOf(obj));
            };

            console.log("Size of Sim Data:"+memorySizeOf(timeline)) //400kb per min of sim



            return timeline
        },
        generateChartData(timeline,name,nameLabel,store,lineColor,lineTension) {
            let data = []
            for (let i=0; i<timeline.length ; i++) {
                data.push({y:timeline[i][name], x:timeline[i].time})
            }

            let chartdata = {
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
            let data = [[],[],[],[],[],[]]
            for (let i=0; i<timeline.length ; i++) {
                for (let a=0; a<name.length ; a++) {
                    data[a].push({x:timeline[i].time,y:timeline[i][name[a]]})
                }
            }
            let chartdata = {
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
            const colors = ['#f9ff6a','#e78b24','#9e3e3c','#ffa7cb',
                '#80ea80','#00cddd', '#166fbf','#fffdff',
                '#9b8ec8','#d2cc8b','#FF69B4','#98b86e',
                '#c8c280', '#c8a985','#c8807d','#b4afac',
                '#006400','#75539e','#ff230a','#98c96e',
                '#ADFF2F']

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


            let dataArray = this[name]
            let dataArrayKeys = Object.keys(dataArray)

            let labels = []
            let data = []

            for (let i=0; i<timeline.length ; i++) { //TIME LOOP
                 let timeNow = +timeline[i].time
                 labels.push(timeNow)

                 for (let a=0; a<dataArrayKeys.length ; a++) { //HEALS LOOP
                     if (!data[a]) {
                         data[a]=[]
                     }
                     data[a][i]=dataArray[dataArrayKeys[a]][i]
                 }
             }


           for (let a=0; a<dataArrayKeys.length ; a++) {
               data[a]=getAvgValues(data[a])
            }

            //remove 0 heal heals
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


            //generate x y data from two arrays
            for (let a = 0; a<data.length; a++) {
                for (let b = 0; b<data[a].length; b++) {
                    data[a][b]={x:labels[b], y:data[a][b]}
                }
            }

            //generate dataset
            let datasets = []
            for (let i = 0; i<nameLabel.length; i++) {
                datasets.push({
                    fill: true,
                    backgroundColor: colors[i],
                    label: nameLabel[i],
                    fontColor: '#ffffff',
                    borderColor: "rgba(0,0,0,0)",
                    pointStyle: "circle",
                    pointBorderColor: "rgba(0,0,0,0)",
                    pointBackgroundColor: "rgba(0,0,0,0)",
                    pointRadius: 10,
                    lineTension:lineTension,
                    pointHoverRadius: 11,
                    data: data[i],
                })
            }

            let chartdata = {
               // labels: labels,
                datasets: datasets
            }
            this.$store.commit(store,chartdata)
        }
    }
}