<template>
    <section>
        <div class="remDiv" v-for="item in time" :key="item.id" v-bind:class="{rems3: item.rems===3, rems4: item.rems===4, rems5: item.rems===5, morethan5rems: item.rems>5}" >
            {{ item.time }}
            <p>  <b>{{ item.rems }}</b> </p>

            <img  class="tftImg" v-if="item.usedAbilityFileName2!==''" :src="'/img/'+item.usedAbilityFileName2+'.jpg'">
            <img  v-if="item.usedAbility!=='none'" :src="'/img/'+item.usedAbilityFileName+'.jpg'">



 <div class="tooltip">
     <span>Heal: <strong> {{ formatNumber(item.healingDone) }} </strong> </span> <br>
     <hr>
     <span>Damage: <strong> {{ formatNumber(item.damageDone) }} </strong> </span>
     <hr>
     <span>Mana: <strong> {{ item.character.mana.toFixed(1) }} </strong> </span>
     <hr>
   <!--  <span v-if="item.usedAbility2!==''" > <strong> {{ item.usedAbility2 }} </strong> + </span>
     <span> <strong> {{ item.usedAbility }} </strong> </span>-->

 </div>
</div>
<button v-on:click="reloadLmao()">Reload (TEST)</button>
</section>
</template>

<script>
import main from "../mixins/sim/main";

export default {
name: "healSimTimeline",
mixins:[main],
data() {
 return {
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