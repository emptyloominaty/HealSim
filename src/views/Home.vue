<template>
  <div class="home">
    <Settings/>
    <Timeline/>
    <Debug/>
  </div>
</template>

<script>
import Debug from '../components/debugConsole.vue'
import Timeline from '../components/healSimTimeline.vue'
import Settings from '../components/healSimSettings.vue'

export default {
  name: 'Home',
  components: {
    Debug,
    Timeline,
    Settings,
  }
}
</script>
