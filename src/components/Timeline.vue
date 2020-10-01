<template>
    <section>
        <div class="remDiv" v-for="item in time" :key="item.id" v-bind:class="{rems3: item.rems===3, rems4: item.rems===4, rems5: item.rems===5, morethan5rems: item.rems>5}" >
          {{ item.time }}
          <p>  <b>{{ item.rems }}</b> </p>
            <img v-if="item.usedAbility!=='none'" :src="'/img/'+item.usedAbility+'.jpg'">
            <img class="tftImg" v-if="item.tftUsed" :src="'/img/tft.jpg'">
            <div class="tooltip">
                <span>Heal: <strong> {{ formatNumber(item.healingDone) }} </strong> </span> <br>
                <hr>
                <span>Damage: <strong> {{ formatNumber(item.damageDone) }} </strong> </span>
            </div>

        </div>
    </section>
</template>

<script>
    import simulateFunction from '../mixins/simulateFunction'
    export default {
        name: "Timeline",
        mixins: [simulateFunction],
        data() {
            return {
                time: this.simulate(this.$store.state.remSetting)
            }
        },
        methods: {
            formatNumber(num) {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            }
        },
        watch: {
            '$store.state.remSetting': function () {
                this.time = this.simulate(this.$store.state.remSetting)
            }
        }
    }
</script>

<style scoped>
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
        top:-10px;
        margin-bottom:-20px;
    }
    .remDiv {
        width:38px;
        min-height:92px;
        padding: 5px;
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