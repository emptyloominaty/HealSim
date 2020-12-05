<template>
  <div class="home">
    <Settings/>
    <Timeline/>
    <Chart style="height:700px;" :chart-data="stackedData" :options="chartOptionsStacked"  />
    <Chart :chart-data="healData" :options="chartOptionsHeal"  />
    <Chart :chart-data="damageData" :options="chartOptionsDamage"  />
    <Chart :chart-data="raidHpData" :options="chartOptionsRaidHp"  />
    <Chart :chart-data="manaData" :options="chartOptionsMana"  />
    <Chart :chart-data="remsData" :options="chartOptionsRems"  />
    <Chart :chart-data="hasteData" :options="chartOptionsHaste"  />
    <Chart :chart-data="masteryData" :options="chartOptionsMastery"  />
    <Debug/>
  </div>
</template>

<script>
import Debug from '../components/debugConsole.vue'
import Timeline from '../components/healSimTimeline.vue'
import Settings from '../components/healSimSettings.vue'
import Chart from '../components/chart.vue'
import chartOptions from '../mixins/chartOptions'

export default {
  name: 'Home',
  mixins: [chartOptions],
  components: {
    Debug,
    Timeline,
    Settings,
    Chart,
  },
  data() {
    return {
      stackedData:[],
      hasteData: [],
      remsData:[],
      damageData:[],
      healData:[],
      manaData:[],
      raidHpData:[],
      masteryData:[],
      testData:{a:0,b:0,c:0,d:0,e:0,f:0,g:0,h:0},
    }
  },
  watch: {
    '$store.state.chartDataMastery': function() {
      this.$store.state.simTime.vue = Date.now()
      this.masteryData = this.$store.state.chartDataMastery
    },
    '$store.state.chartDataHaste': function() {
      this.hasteData = this.$store.state.chartDataHaste
    },
    '$store.state.chartData': function() {
      this.remsData = this.$store.state.chartData
    },
    '$store.state.chartDataDamage': function() {
      this.damageData = this.$store.state.chartDataDamage
    },
    '$store.state.chartDataHeal': function() {
      this.healData = this.$store.state.chartDataHeal
    },
    '$store.state.chartDataMana': function() {
      this.manaData = this.$store.state.chartDataMana
    },
    '$store.state.chartDataStacked': function() {
      this.stackedData = this.$store.state.chartDataStacked
    },
    '$store.state.chartDataRaidHp': function() {
      this.$store.state.simTime.end = Date.now()
      let time = this.$store.state.simTime
      console.log( "Sim: "+ +(time.simEnd - time.start) +" ms"+" - Charts: "+ +(time.chart - time.simEnd) +" ms"+" - Vue: "+
              +(time.vue - time.chart)+" ms"+" - ChartsVue: "+(time.end - time.vue)+" ms"+" - Total: "+(time.end - time.start )+" ms")
      this.raidHpData = this.$store.state.chartDataRaidHp
    }
  }
}
</script>
