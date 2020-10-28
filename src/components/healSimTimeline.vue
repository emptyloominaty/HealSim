<template>
    <section>
        <div class="remDiv" v-for="item in timelineData" :key="item.id" v-bind:class="{rems3: item.rems===3, rems4: item.rems===4, rems5: item.rems===5, morethan5rems: item.rems>5}" >
            {{ item.time }}
            <p>  <b>{{ item.rems }}</b> </p>

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
        <!--TEST
        <div style="color:#fff">
            {{ test[testb] }}
            <button v-on:click="testb++" >haha</button>
        </div> -->
        <button v-on:click="reloadLmao()">Reload (TEST)</button>

        <targets :data="timelineData" />

        <div class="tables">
            <!-- Heals -->
            <table :key="reloadPls">
                <thead>
                    <tr>
                        <th> Heal </th>
                        <th> Amount </th>
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
        </div>


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
         tableData: [{name:"click reload pls",amount:0,hps:0,casts:0,avgCast:0,manaEf:0}] , //this.getHealTableData()  TODO: FIX PLS
         avgHps : 0
     }
    },
    methods: {
         reloadLmao() {
             this.timelineData = this.mainSim()
             this.tableData = this.getHealTableData()
         },
         formatNumber(num) {
             return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
         },
         formatNumber2(num) {
             if (num>999.99) {
                 num=Math.round((num/1000)*10)/10 +"k"
             } else if (num>999999.99) {
                 num=Math.round((num/1000000)*10)/10 +"M"
             }
            return num
         },
         getHealTableData() {
             let data = []
             let nameList = []
             let rskCasts = 0
             let avgHps = 0
            /* if (this.timelineData==undefined) {
                 this.timelineData =this.mainSim()
             }*/
             let castsList = new Array(this.timelineData[0].heals.length).fill(0)
             let amountList = new Array(this.timelineData[0].heals.length).fill(0)
             let hpsList = new Array(this.timelineData[0].heals.length).fill(0)
             let avgCastList = new Array(this.timelineData[0].heals.length).fill(0)
             let manaEfList = new Array(this.timelineData[0].heals.length).fill(0)
             //heal names
             for (let i = 0; i<this.timelineData[0].heals.length; i++) {
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

             //amount
             let fightlength = this.timelineData[this.timelineData.length-1].time
             for(let i = 0; i<(Object.keys(this.timelineData[0].healArr).length); i++) {
                 for(let a = 0; a<this.timelineData[0].healArr[nameList[i]].length; a++) {
                     amountList[i]+=this.timelineData[0].healArr[nameList[i]][a].heal
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

             for(let i = 0; i<nameList.length; i++) {
                 if (amountList[i]!==0) {
                     data.push({
                         name: nameList[i],
                         amount: Math.round(amountList[i]*10)/10,
                         hps: Math.round(hpsList[i]*10)/10,
                         casts: castsList[i],
                         avgCast: Math.round(avgCastList[i]*10)/10,
                         manaEf: Math.round(manaEfList[i]*10)/10,
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


             this.avgHps = avgHps
             return data
         }

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
    border: 1px solid #fff;
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
</style>