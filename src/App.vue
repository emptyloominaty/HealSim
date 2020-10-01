<template>
  <div id="app">
    <Settings/>
    <Timeline/>
    <Chart/>
    <ChartHaste/>
    <ChartHeal/>
    <ChartDamage/>
    <ChartMana/>
  </div>
</template>

<script>
import Timeline from './components/Timeline.vue'
import Settings from './components/Settings.vue'
import Chart from './components/chart.vue'
import ChartMana from './components/chartMana.vue'
import ChartDamage from './components/chartDamage.vue'
import ChartHeal from './components/chartHeal.vue'
import ChartHaste from './components/chartHaste.vue'

export default {
  name: 'App',
  components: {
    Timeline,
    Settings,
    Chart,
    ChartMana,
    ChartDamage,
    ChartHeal,
    ChartHaste
  },
  methods: {
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
    margin-top: 60px;
  }
</style>
