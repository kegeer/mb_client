<template lang="html">
  <div id="main">
    <div class="row">
      <div class="col-md-6">
        <h1>
          样品稀释&nbsp;&nbsp;
          <a href="#" class="btn btn-primary btn-sm" v-show="multipleSelection.length" @click="pushToNext"><i class="fa fa-mail-forward"></i>&nbsp;&nbsp;确认推送到下一流程</a>
        </h1>

      </div>
      <div class="col-md-6 text-right">
        <div class="button-within-header">
          <a href="#" class="btn btn-default btn-sm" v-show="!isFormVisible" @click="create"><i class="fa fa-plus"></i></a>
          <a href="#" class="btn btn-default btn-sm" v-show="isFormVisible" @click="hide"><i class="fa fa-minus"></i></a>
        </div>
      </div>
    </div>
    <div class="divider"></div>

    <transition name="fade">
      <router-view></router-view>
    </transition>

    <div class="table-content">
      <table class="table table-striped">
        <thead>
          <tr>
            <th rowspan="2"></th>
            <th rowspan="2">样品编号</th>
            <th rowspan="2">目前状态</th>
            <th colspan="3">板位分布</th>
            <th rowspan="2">操作</th>
          </tr>
          <tr>
            <th>位置</th>
            <th>96孔板流水号</th>
          </tr>
        </thead>
        <tbody class="text-center">
          <tr v-for="distribution in distributions">
            <td>
              <input type="checkbox" v-show="canPush(distribution)" :value="distribution.id" v-model="multipleSelection">
            </td>
            <td>{{ distribution.sample_id }}</td>
            <td><i class="fa fa-circle" :style="{color: statusColor(distribution)}"></i></td>
            <td>{{ distribution.quality.ori_c }}</td>
            <td>{{ distribution.quality.sample_v }}</td>
            <td>{{ distribution.quality.water }}</td>
            <td>{{ distribution.quality.last_c }}</td>
            <td>
              <a href="#" class="btn btn-default btn-sm" @click="editDistribution(distribution)"><i class="fa fa-edit"></i></a>
              <a href="#" class="btn btn-danger btn-sm" @click="askRemoveDistribution(distribution)"><i class="fa fa-times"></i></a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pagination :paginationData="pagination" :currentPage="currentPage" :maxItems="pagination.total"></pagination>
  </div>
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'
export default {
  data () {
    return {
      multipleSelection: []
    }
  },
  mounted () {
    this.$bus.$on('navigate', obj => this.navigate(obj)),
    this.$bus.$on('distributions.created', () => this.fetchDistributions())
    this.$bus.$on('distributions.updated', () => this.fetchDistributions())
    this.fetchDistributions()
  },
  computed: {
    ...mapState({
      distributions: state => state.Experiments.distributions,
      distributions_pagination: state => state.Experiments.distributions_pagination
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.distributions_pagination
    },
    isFormVisible () {
      return this.$route.name === 'distributions.new' || this.$route.name === 'distributions.edit'
    }
  },
  watch: {
    currentPage: 'fetchDistributions',
    $route: 'fetchDistributions'
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('distributions.created')
    this.$bus.$off('distributions.updated')
    next()
  },
  methods: {
    ...mapActions(['distributionsSetData', 'setFetching', 'setMessage']),
    fetchDistributions () {
      this.setFetching({
        fetching: true
      })
      this.$http.get(`experiments/distributions?page=${this.currentPage}`)
        .then(({
          data
        }) => {
          console.log(data)
          this.distributionsSetData({
            distributions: data.data,
            distributions_pagination: data.meta.pagination
          })
          this.setFetching({
            fetching: false
          })
        })
    },
    canPush (distribution) {
      let status = distribution.status
      return status ? true : false
    },
    pushToNext () {
      swal({
        title: '确认吗？',
        text: '确认后该实验会流入下一步走',
        type: 'info',
        showCancelButton: 'true',
        closeOnConfirm: false,
        animation: 'slide-from-top'
      }, () => {
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.multipleSelection[i]
          let id = this.multipleSelection[i]
          this.$http.patch(`experiments/${id}`, {'next': true})
          .then(() => {
            this.fetchDistributions()
          })
          .catch((error) => {
            this.setMessage({ type: 'error', 'message': error})
          })
        }
        swal('成功', `批次${inputValue}已被成功提交`)
      })
    },
    statusColor (distribution) {
      let status = distribution.status
      return status ? (status === 1 ? '#3097D1': '#8eb4cb') : '#bf5329'
    },
    clickAddMore () {
      this.addMore = !this.addMore
    },
    create () {
      this.$router.push({
        name: 'distributions.new',
        query: {
          page: this.currentPage
        }
      })
    },
    hide () {
      this.$router.push({
        name: 'distributions.index',
        query: {
          page: this.currentPage
        }
      })
    },
    editDistribution (distribution) {
      let distribution_id = distribution.id
      this.$router.push({
        name: 'distributions.edit',
        params: {
          distribution_id
        }
      })
    },
    askRemoveDistribution (distribution) {
      swal({
        title: '确定吗？',
        text: `该步样品${distribution.id}将会被废弃`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.removeDistribution(distribution))
    },
    removeDistribution (distribution) {
      this.$http.patch(`experiments/${distribution.id}/cancel`)
        .then(() => {
          swal('完成', '该步样品废弃成功', 'success')
          this.fetchDistributions()
        })
    },
    navigate (obj) {
      this.$router.push({
        name: 'distributions.index',
        query: {
          page: obj.page
        }
      })
    }
  }

}
</script>

<style lang="css">
</style>
