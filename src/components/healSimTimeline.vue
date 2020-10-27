<template>
    <section>
        <div class="remDiv" v-for="item in time" :key="item.id" v-bind:class="{rems3: item.rems===3, rems4: item.rems===4, rems5: item.rems===5, morethan5rems: item.rems>5}" >
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
        <targets :data="time" />
        <table>
            <tr>
                <th> Heal </th>
                <th> Amount </th>
                <th> Hps </th>
                <th> Casts </th>
                <th> avg Cast </th>
                <th> Mana Ef </th>
            </tr>
        </table>

        <table>
            <tr>
                <th> HPS </th>
                <th> DPS </th>
                <th> Hps </th>
            </tr>
        </table>



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
         time: this.mainSim()
     }
    },
    methods: {
         reloadLmao() {
            this.time = this.mainSim()
         },
         formatNumber(num) {
             return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
background-color: #00b43c;
}
.morethan5rems {
background-color: #006a26;
}
</style>