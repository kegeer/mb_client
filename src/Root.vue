<script>
  import MbNavbar from './components/root/Navbar'
  // import MbAlerts from './components/general/Alerts'
  export default {
    name: 'MbControl',
    components: {
      MbNavbar
    }
  }
</script>
<template>
  <div id="app">
    <mb-navbar></mb-navbar>
    <router-view></router-view>
  </div>
</template>
<style lang="scss" src="assets/scss/app.scss"></style>
