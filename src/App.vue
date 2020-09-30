<template>
  <div id="app">
    <Settings/>
  </div>
</template>

<script>
import Settings from './components/Settings.vue'

export default {
  name: 'App',
  components: {
    Settings
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
