<template lang="html">
  <div id="main">
    <div class="row">
      <div class="col-md-6">
        <h1>
          产物Pooling&nbsp;&nbsp;
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
            <th colspan="3">Pooling状态</th>
            <th rowspan="2">操作</th>
          </tr>
          <tr>
            <th>引物</th>
            <th>浓度</th>
            <th>循环数</th>
            <th>取样体积</th>
            <th>取样量</th>
          </tr>
        </thead>
        <tbody class="text-center">
          <tr v-for="pooling in poolings">
            <td>
              <input type="checkbox" v-show="canPush(pooling)" :value="pooling.id" v-model="multipleSelection">
            </td>
            <td>{{ pooling.sample_id }}</td>
            <td><i class="fa fa-circle" :style="{color: statusColor(pooling)}"></i></td>
            <td>{{ pooling.quality.ori_c }}</td>
            <td>{{ pooling.quality.sample_v }}</td>
            <td>{{ pooling.quality.water }}</td>
            <td>{{ pooling.quality.last_c }}</td>
            <td>
              <a href="#" class="btn btn-default btn-sm" @click="editPooling(pooling)"><i class="fa fa-edit"></i></a>
              <a href="#" class="btn btn-danger btn-sm" @click="askRemovePooling(pooling)"><i class="fa fa-times"></i></a>
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
    this.$bus.$on('poolings.created', this.fetchPoolings())
    this.$bus.$on('poolings.updated', this.fetchPoolings())
    this.fetchPoolings()
  },
  computed: {
    ...mapState({
      poolings: state => state.Experiments.poolings,
      poolings_pagination: state => state.Experiments.poolings_pagination
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.poolings_pagination
    },
    isFormVisible () {
      return this.$route.name === 'poolings.new' || this.$route.name === 'poolings.edit'
    }
  },
  watch: {
    currentPage: 'fetchPoolings',
    $route: 'fetchPoolings'
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('poolings.created')
    this.$bus.$off('poolings.updated')
    next()
  },
  methods: {
    ...mapActions(['poolingsSetData', 'setFetching', 'setMessage']),
    fetchPoolings () {
      this.setFetching({
        fetching: true
      })
      this.$http.get(`experiments/poolings?page=${this.currentPage}`)
        .then(({
          data
        }) => {
          console.log(data)
          this.poolingsSetData({
            poolings: data.data,
            poolings_pagination: data.meta.pagination
          })
          this.setFetching({
            fetching: false
          })
        })
    },
    canPush (pooling) {
      let status = pooling.status
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
            this.fetchPoolings()
          })
          .catch((error) => {
            this.setMessage({ type: 'error', 'message': error})
          })
        }
        swal('成功', `批次${inputValue}已被成功提交`)
      })
    },
    statusColor (pooling) {
      let status = pooling.status
      return status ? (status === 1 ? '#3097D1': '#8eb4cb') : '#bf5329'
    },
    clickAddMore () {
      this.addMore = !this.addMore
    },
    create () {
      this.$router.push({
        name: 'poolings.new',
        query: {
          page: this.currentPage
        }
      })
    },
    hide () {
      this.$router.push({
        name: 'poolings.index',
        query: {
          page: this.currentPage
        }
      })
    },
    editPooling (pooling) {
      let pooling_id = pooling.id
      this.$router.push({
        name: 'poolings.edit',
        params: {
          pooling_id
        }
      })
    },
    askRemovePooling (pooling) {
      swal({
        title: '确定吗？',
        text: `该步样品${pooling.id}将会被废弃`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.removePooling(pooling))
    },
    removePooling (pooling) {
      this.$http.patch(`experiments/${pooling.id}/cancel`)
        .then(() => {
          swal('完成', '该步样品废弃成功', 'success')
          this.fetchPoolings()
        })
    },
    navigate (obj) {
      this.$router.push({
        name: 'poolings.index',
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
