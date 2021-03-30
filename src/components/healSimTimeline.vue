<template>
    <section>
        <div class="remDiv" v-for="item in timelineData" :key="item.id" v-bind:class="{rems3: item.rems===3, rems4: item.rems===4, rems5: item.rems===5, morethan5rems: item.rems>5}" >
            {{ item.time }}
            <p>  <b>{{ item.rems }}</b> <span class="emsText">{{ item.ems }}</span> </p>

            <img  class="tftImg" v-if="item.usedAbilityFileName2!==''" :src="'/img/'+item.usedAbilityFileName2+'.jpg'">
            <img  v-if="item.usedAbility!==0" :src="'/img/'+item.usedAbilityFileName+'.jpg'">
            <span class="upwellingKekw" v-if="item.usedAbility==='Essence Font' && item.character.talents.upwelling===1"> {{item.upwelling}} </span>

            <div class="tooltip">
                <span>Heal: <strong> {{ formatNumber(item.healingDone) }} </strong> </span> <br>
                <hr>
                <span>Damage: <strong> {{ formatNumber(item.damageDone) }} </strong> </span>
                <hr>
                <span>Mana: <strong> {{ item.character.mana.toFixed(1) }} </strong> </span>
                <!--<hr>
                <span v-for="(value, name) in item.hots" :key="name"  > <span v-if="value.length>0">{{name}} <strong  > {{ value }} </strong> <br> </span> </span>-->
            </div>
        </div>
        <button v-on:click="reloadLmao()">ReSim</button>
        <button v-on:click="massSim(10)">Mass Sim</button>
        <!--TEST
        <div style="color:#fff">
            {{ test[testb] }}
            <button v-on:click="testb++" >haha</button>
        </div> -->

        <div class="tables">
            <!-- Heals -->
            <table>
                <thead>
                    <tr>
                        <th> Heal </th>
                        <th> Amount </th>
                        <th> % </th>
                        <th> Hps </th>
                        <th> Casts </th>
                        <th> avg Cast </th>
                        <th> Mana Ef </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in tableData" :key="item.id" >
                        <td> {{ item.name }} </td>
                        <td> {{ formatNumber2(item.amount) }} </td>
                        <td> {{ item.percent }}% </td>
                        <td> {{ item.hps }} </td>
                        <td> {{ item.casts }} </td>
                        <td> {{ formatNumber2(item.avgCast) }} </td>
                        <td> {{ formatNumber2(item.manaEf) }} </td>
                    </tr>
                </tbody>
            </table>

            <!-- HPS DPS  -->
            <p> HPS: {{ formatNumber2(avgHps) }} </p>
            <!--<p> DPS: </p>-->
            <p> DPS: {{ formatNumber2(avgDps) }} </p>

            <p> Rems: {{ Math.round(avgRem*100)/100 }} </p>
        </div>

        <targets :data="timelineData" />
<!--
        <table class="hotTable">
            <tr v-for="item in timelineData[0].friendlyTargets" :key="item+'xd'">
                <th> {{ timelineData[0].targets[item].name }}</th>
                <td v-for="dataitem in timelineData" :key="dataitem.time+'xd2'" >
                    <div class="targetHotDiv"  v-bind:class="{targetHotDiv2: getTargetHots(dataitem.targets[item].hots, 'Renewing Mist')}"> .
                    </div>
                </td>
            </tr>
        </table> -->


    </section>
</template>

<script>
import main from "../mixins/sim/main"
import targets from "./healSimTargets"

export default {
    name: "healSimTimeline",
    mixins:[main],
    components:{targets},
    data() {
     return {
         test: [5,2,6,8,9,5,8,15,4,7],
         testb: 0,
         timelineData: this.mainSim(),
         tableData: [{name:"click reload pls",amount:0,hps:0,casts:0,avgCast:0,manaEf:0}] , //FIXED EZ
         avgHps: 0,
         avgDps: 0,
         avgRem: 0,
         arrayHpsGraph: [],
         arrayDpsGraph: []
     }
    },
    methods: {
         reloadLmao() {
             this.$store.state.simTime.start=Date.now()
             this.timelineData = this.mainSim()
             this.tableData = this.getHealTableData()
             this.$store.state.simTime.afterSim=Date.now()
         },
        massSim(num) {
          for(let i = 0; i<num; i++) {
              this.reloadLmao()
          }
        },
         formatNumber(num) {
             return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
         },
         formatNumber2(num) {
             if (num>999.99) {
                 num=Math.round((num/1000)*10)/10 +"k"
             } else if (num>999999.99) {
                 num=Math.round((num/1000000)*10)/10 +"M"
             } else {
                 num=Math.round(num*10)/10
             }
            return num
         },
     /*   getTargetHots(targetHots, hotName) {
             for (let i = 0; i<targetHots.length; i++) {
                 if (targetHots[i].name===hotName) {
                     return 1
                 }
             }
            return 0
        },*/
         getHealTableData() {
             let data = []
             let nameList = []
             let rskCasts = 0
             let avgHps = 0
            /* if (this.timelineData==undefined) {
                 this.timelineData =this.mainSim()
             }*/
             let healsLength = this.timelineData[0].heals.length
             let simTime = this.timelineData[0].simTime


             this.avgDps = this.timelineData[0].avgDps
             this.avgRem =  this.timelineData[0].avgRem
             let castsList = new Array(healsLength).fill(0)
             let amountList = new Array(healsLength).fill(0)
             let hpsList = new Array(healsLength).fill(0)
             let avgCastList = new Array(healsLength).fill(0)
             let manaEfList = new Array(healsLength).fill(0)
             let percentList = new Array(healsLength).fill(0)

             //heal names
             for (let i = 0; i<healsLength; i++) {
                 nameList.push(this.timelineData[0].heals[i].name)
             }

             //casts
             for(let i = 0; i<this.timelineData.length; i++) {
                for(let a = 0; a<nameList.length; a++) {
                    if(this.timelineData[i].usedAbility===this.timelineData[0].heals[a].name) {
                       castsList[a]++
                    }
                }
                 if(this.timelineData[i].usedAbility==="Rising Sun Kick") {
                     rskCasts++
                 }
             }

             let fightlength = this.timelineData[this.timelineData.length-1].time
             for(let i = 0; i<(Object.keys(this.timelineData[0].healArr).length); i++) {
                 //amount
                 for(let a = 0; a<this.timelineData[0].healArr[nameList[i]].length; a++) {
                     amountList[i]+=this.timelineData[0].healArr[nameList[i]][a]
                 }
                 //hps
                 hpsList[i] = amountList[i] / fightlength
                 //avgcast
                 avgCastList[i] = amountList[i] / castsList[i]
                 if (!isFinite( avgCastList[i])) {
                     avgCastList[i] = 0
                 }
                 //manaef
                 manaEfList[i] =  (amountList[i] / (this.timelineData[0].heals[i].manaCost * castsList[i]))/20

                 //RISING MIST
                 if (nameList[i]==="Rising Mist") {
                     castsList[i] = rskCasts
                     avgCastList[i] = amountList[i] / castsList[i]
                     manaEfList[i] =  (amountList[i] / (1.5 * rskCasts))/20
                 }

                 if (!isFinite(manaEfList[i])) {
                     manaEfList[i] = 0
                 }

                 //get avg hps
                 avgHps += amountList[i]
             }
             avgHps = avgHps / fightlength

             for(let i = 0; i<(Object.keys(this.timelineData[0].healArr).length); i++) {
                 percentList[i] = (amountList[i] / (avgHps * fightlength))*100
             }


             for(let i = 0; i<nameList.length; i++) {
                 if (amountList[i]!==0) {
                     data.push({
                         name: nameList[i],
                         amount: Math.round(amountList[i]*10)/10,
                         hps: Math.round(hpsList[i]*10)/10,
                         casts: castsList[i],
                         avgCast: Math.round(avgCastList[i]*10)/10,
                         manaEf: Math.round(manaEfList[i]*10)/10,
                         percent: Math.round(percentList[i]*10)/10,
                     })
                 }
             }

             //SORT BY AMOUNT
             function compare( a, b ) {
                 if ( a.amount < b.amount ){
                     return 1
                 }
                 if ( a.amount > b.amount ){
                     return -1
                 }
                 return 0
             }
             data.sort( compare )

             //test avgHps-----------------------------------------------------------------
             this.$store.state.global.test.push(avgHps)
             this.$store.state.global.avgrems.push(this.avgRem)
             let avgHpsArray = this.$store.state.global.test
             let avgRemsArray = this.$store.state.global.avgrems

             let avgTotal = 0

             //---------------------29-03-2021 hps graph
             //this.arrayHpsGraph.push(avgHps)
             let storehpsData = this.$store.state.global.test
             this.generateChartDataHps(storehpsData,"#78f871",0)

             //this.$store.commit("setHpsData",this.$store.state.global.test)
             //---------------------
             avgHpsArray.forEach(function(item){
                 item = +item
                 avgTotal += item
             });

             let remAvgAvg = 0
             avgRemsArray.forEach(function(item){
                 remAvgAvg += item
             });
             remAvgAvg = remAvgAvg / avgRemsArray.length
            console.log("ReM: "+remAvgAvg+" - - - - - RSK every: "+ (simTime/rskCasts) + "s" )


             let avgMin = 0
             let avgMax = 0
             let minMin = Math.min.apply(Math, avgHpsArray)
             let maxMax = Math.max.apply(Math, avgHpsArray)
             let avgHpsCount = avgHpsArray.length
             let avgAvg = avgTotal / avgHpsCount

             let avgMinCount = 0
             let avgMaxCount = 0
             avgHpsArray.forEach(function(item){
                 if (avgAvg>item) {
                     avgMin += item
                     avgMinCount++
                 }
                 if (avgAvg<item) {
                     avgMax += item
                     avgMaxCount++
                 }
             });
             avgMin = avgMin / avgMinCount
             avgMax = avgMax / avgMaxCount

            /* console.log(avgHpsArray)
             console.log("avg: "+avgAvg)
             console.log("avg min: "+avgMin)
             console.log("avg max: "+avgMax)
             console.log("max: "+maxMax)
             console.log("min: "+minMin)*/

             let minPercent = Math.round((((avgAvg - minMin)/avgAvg)*100)*100)/100
             let minAvgPercent = Math.round((((avgAvg - avgMin)/avgAvg)*100)*100)/100
             let maxPercent = Math.round(((((avgAvg - maxMax)/avgAvg)*100)*(-1))*100)/100
             let maxAvgPercent = Math.round(((((avgAvg - avgMax)/avgAvg)*100)*(-1))*100)/100


             console.log(Math.round(minMin)+" / "+Math.round(avgMin)+" / "+Math.round(avgAvg)+" / "+Math.round(avgMax)+" / "+Math.round(maxMax))
             console.log("- "+minPercent+"% - "+minAvgPercent+"% /// + "+ maxAvgPercent +"% + "+maxPercent+"%"+ " / ("+avgHpsCount+")")

             console.log("---------------")
             //test avgHps-----------------------------------------------------------------




             this.avgHps = avgHps
             return data
         },
        generateChartDataHps(timeline,lineColor,lineTension) {
            let data = []
            for (let i=0; i<timeline.length ; i++) {
                data.push({y:timeline[i], x:i})
            }

            let chartdata = {
                datasets: [
                    {
                        label: "HPS",
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
            this.$store.commit("setHpsData",chartdata)
        }

    },
    watch: {
        '$store.state.healSetting': function () {
            this.reloadLmao()
        },
        '$store.state.talents': function () {
            this.reloadLmao()
        },
    },
    created() {
        this.tableData = this.getHealTableData()
    }
}
</script>

<style scoped>
button {
    font-size:26px;
    margin:8px;
}

hr {
padding:0;
margin:9px 0 9px 0 ;
}
section {
display:flex;
flex-wrap:wrap;
justify-content: flex-start;
margin-top:20px;
margin-bottom:20px;
}
p {
margin-top:10px;
margin-bottom: 2px;
font-size:1.35rem;
}
img {
width:32px;
}

button {
    margin:5px;
    padding: 8px;
    width:150px;
    background-color: #404040;
    color: #ffde00;
    text-shadow: 0 0 3px #987300;
    border:1px solid #ffde00;
    border-radius:3px;
    cursor:pointer;
    transition:all 0.2s;
    font-size:1.2rem;
}
button:hover {
    background-color: #575757;
    text-shadow: 0 0 8px #d7ac00;
}
/*
.hotTable {
    border-collapse: collapse;
    text-align: center;
}

.hotTable table,th,td  {
    border: 1px solid #000000;
    color: #fff;
    padding: 3px !important;
    margin: 0;
}

.hotTable td {
    padding: 0 !important;
}

.hotTable th {
    font-size:12px;
}

.targetHotDiv {
    width:100%;
    margin:0;
    padding:0;
    height:100%;
    background-color: transparent;
    color: transparent;
}
.targetHotDiv2 {
    background-color: #5fb75d;
    color: #5fb75d;
}*/

.tables {
    display:flex;
    flex-direction:column;
    text-align: center;
    align-items: center;
    /*margin-left:15px;*/
    width:100%;
}

.tables table {
    max-width:650px;
    border-collapse: collapse;
    text-align: center;
}

.tables table,th,td {
    border: 1px solid #000000;
    color: #fff;
    padding: 10px;
}

.tables th {
    font-size:1.2rem;
}

.tables p {
    color: #fff;
}

.tftImg {
position:relative;
top:-5px;
margin-bottom:-10px;
}
.remDiv {
width:38px;
min-height:92px;
padding: 4px;
margin-right:-1px;
margin-top:-1px;
border: 1px solid #333;
background-color:#fff;
}
.upwellingKekw {
    line-height:1px;
    font-weight: 600;
    font-size:18px;
    position:relative;
    top:-28px;
}
/*------Tooltip-------*/
.tooltip {
visibility: hidden;
position:absolute;
margin-left:-44px;
border: 1px solid rgba(0,0,0,0.3);
border-radius:5px;
background-color:#fcfcfc;
z-index:1;
padding:7px;
}
.remDiv:hover .tooltip {
visibility: visible;
}
/*--------------------*/
.rems3 {
background-color: #ccffcc ;
}
.rems4 {
background-color: #66ff66 ;
}
.rems5 {
background-color: #00a53b;
}
.morethan5rems {
background-color: #006a26;
}

.emsText {
    font-size:11px;
}

</style>