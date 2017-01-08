<template>
  <div id="nav" class="col-md-12" :class="{ active: isActive }">
    <a href="#" class="nav-menu-button" @click.prevent="toggleMenu">导航</a>
    <div class="nav-inner">
      <button class="btn btn-primary">新增</button>
      <div class="menu">
        <ul class="menu-list">
          <li class="menu-list-item">
            <router-link :to="{ name: 'batches.index' }"><i class="fa fa-user"></i>样品管理</router-link>
          </li>
          <li class="menu-list-item">
            <a href="#" class="menu-link">
              任务管理
              <span class="msg-count">(1)</span>
            </a>
          </li>
          <li class="menu-heading">样品状态</li>
          <li class="menu-list-item">
            <a href="#" class="menu-link">
              <span class="label-default"></span>未处理
            </a>
          </li>
          <li class="menu-list-item">
            <a href="#" class="menu-link">
              <span class="label-primary"></span>处理成功
            </a>
          </li>
          <li class="menu-list-item">
            <a href="#" class="menu-link">
              <span class="label-warning"></span>需要确认
            </a>
          </li>
          <li class="menu-list-item">
            <a href="#" class="menu-link">
              <span class="label-error"></span>失败样品
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        isActive: false
      }
    },
    methods: {
      toggleMenu () {
        this.isActive = !this.isActive
      }
    }
  }
</script>
<style lang="scss">
.menu {
  background: transparent;
  border:none;
  text-align: left;
}
.menu-link {
  color: #fff;
  margin-left: 0.5em;
  &:hover,
  &:focus {
    background: rgb(55, 60, 90);
  }
}
.menu-heading {
  border-bottom: none;
  font-size: 110%;
  color: rgb(75, 113, 151);
}
.msg-count {
  color: rgb(75, 113, 151);
}
ul.menu-list {
  list-style: none;
  position: relative;
  padding: 0;
  li {
    width: 100%;
    padding: 2em 0;
  }
}

.label-default,
.label-error,
.label-primary,
.label-warning {
  width: 15px;
  height: 15px;
  display: inline-block;
  margin-right: 0.5em;
  border-radius: 3px;
  background: #ffc94c;
}
</style>
