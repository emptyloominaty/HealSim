<template>
  <div id="app">
    <Settings/>
    <Timeline/>
    <Chart :chart-data="remsData" :options="chartOptionsRems"  />
    <Chart :chart-data="hasteData" :options="chartOptionsHaste"  />
    <Chart :chart-data="healData" :options="chartOptionsHeal"  />
    <Chart :chart-data="damageData" :options="chartOptionsDamage"  />
    <Chart :chart-data="manaData" :options="chartOptionsMana"  />

  </div>
</template>

<script>
  import Timeline from '../components/Timeline.vue'
  import Settings from '../components/Settings.vue'
  import Chart from '../components/chart.vue'
  import chartOptions from '../mixins/chartOptions'

  export default {
    name: 'App',
    mixins: [chartOptions],
    components: {
      Timeline,
      Settings,
      Chart,
    },
    data() {
      return {
        hasteData: [],
        remsData:[],
        damageData:[],
        healData:[],
        manaData:[]
      }
    },
    methods: {
    },
    watch: {
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
      }

    }
  }
</script>

<style>
  html {
    background-color: #222;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #1f1d24;
  }
</style>
