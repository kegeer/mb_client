<template>
  <div id="nav" class="col-md-12" :class="{ active: isActive }">
    <a href="#" class="nav-menu-button" @click.prevent="toggleMenu">导航</a>
    <div class="nav-inner">
      <h4 style="color: #fff;">样品管理系统</h4>
      <h3>{{ currentUser.name }}</h3>
      <a href="/logout" class="btn btn-default btn-sm"><i class="fa fa-logout"></i>登出</a>
      <div class="menu">
        <ul class="menu-list">
          <li class="menu-list-item">
            <router-link :to="{ name: 'batches.index' }" class="menu-link"><i class="fa fa-list"></i>样品批次</router-link>
          </li>
          <li class="menu-list-item">
            <router-link :to="{ name: 'projects.index' }" class="menu-link"><i class="fa fa-th"></i>项目任务</router-link>
          </li>
          <li class="menu-list-item">
            <router-link :to="{ name: 'pipelines.index' }" class="menu-link"><i class="fa fa-sort-numeric-asc"></i>技术路线</router-link>
          </li>
          <li class="menu-list-item">
            <router-link :to="{ name: 'experiments.index' }" class="menu-link"><i class="fa fa-retweet"></i>实验流程</router-link>
          </li>
          <li class="menu-list-item">
            <router-link :to="{ name: 'qcs.index' }" class="menu-link"><i class="fa fa-sitemap"></i>数据质控</router-link>
          </li>
          <li class="menu-list-item">
            <router-link :to="{ name: 'results.index' }" class="menu-link"><i class="fa fa-file-o"></i>结果报告</router-link>
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
import { mapActions, mapGetters } from 'vuex'
  export default {
    data () {
      return {
        isActive: false
      }
    },
    computed: {
      ...mapGetters(['currentUser', 'isLogged'])
    },
    watch: {
      isLogged (value) {
        if (value === false) {
          this.$router.push({ name: 'auth.signin' })
        }
      }
    },
    methods: {
      ...mapActions(['logout']),
      toggleMenu () {
        this.isActive = !this.isActive
      },
      navigate (name) {
        switch (name) {
          case 'logout':
          this.logout()
          break
          default:
          this.$router.push({ name })
          break
        }
      }
    }
  }
</script>
<style lang="scss">
@import "../../assets/scss/variables";
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
    background: transparent;
    text-decoration: none;

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
    background: transparent;
    padding: 1em 0em;
    i, span {
      margin-right: 1em;
    }
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
}
.label-primary {
  background: $brand-primary;
}
.label-warning {
  background: $brand-warning;
}
.label-error {
  background: $brand-danger;
}
.label-default {
  background: $brand-info;
}

</style>
