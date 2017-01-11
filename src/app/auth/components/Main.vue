<template>
  <div class="container">
    <header class="page-header">
      <h3>样品管理系统</h3>
    </header>
    <div class="row">
      <div class="col-md-2"></div>
      <div class="col-md-3">
        <ul class="nav nav-pills nav-stacked">
          <router-link tag="li" :to="{ name: 'auth.signin' }">
            <a>登录</a>
          </router-link>
          <router-link tag="li" :to="{ name: 'auth.signup' }">
            <a>注册</a>
          </router-link>
        </ul>
      </div>
      <div class="col-md-4">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
