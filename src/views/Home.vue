<template>
  <div class="home">
    <heal-sim-timeline/>
    <Debug/>
  </div>
</template>

<script>
// @ is an alias to /src
import Debug from '../components/debugConsole.vue'
import healSimTimeline from '../components/healSimTimeline.vue'

export default {
  name: 'Home',
  components: {
    Debug,
    healSimTimeline
  }
}
</script>
