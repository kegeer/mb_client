<script>
  import MbNavbar from './components/root/Navbar'
  import MbAlerts from './components/general/Alerts'
  import { mapGetters } from 'vuex'
  export default {
    name: 'MbControl',
    components: {
      MbNavbar,
      MbAlerts
    },
    computed:{
      ...mapGetters(['shouldShowNavigation'])
    }
  }
</script>
<template>
  <div id="app">
    <mb-navbar v-show="shouldShowNavigation"></mb-navbar>
    <div>
      <mb-alerts></mb-alerts>
      <router-view></router-view>
    </div>
  </div>
</template>
<style lang="scss" src="assets/scss/app.scss"></style>
