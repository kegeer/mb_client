<template lang="html">
  <div id="main">
    <div class="row">
      <div class="col-md-6">
        <h1>
          产物分析&nbsp;&nbsp;
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
            <th colspan="5">分析结果</th>
            <th rowspan="2">操作</th>
          </tr>
          <tr>
            <th>引物</th>
            <th>循环数</th>
            <th>浓度</th>
            <th>体积</th>
            <th>电泳结果/电泳图名称</th>
          </tr>
        </thead>
        <tbody class="text-center">
          <tr v-for="analysis in analysises">
            <td>
              <input type="checkbox" v-show="canPush(analysis)" :value="analysis.id" v-model="multipleSelection">
            </td>
            <td>{{ analysis.sample_id }}</td>
            <td><i class="fa fa-circle" :style="{color: statusColor(analysis)}"></i></td>
            <td>{{ analysis.quality.primer }}</td>
            <td>{{ analysis.quality.cycle }}</td>
            <td>{{ analysis.quality.c }}</td>
            <td>{{ analysis.quality.v }}</td>
            <td>{{ analysis.quality.e_map }}</td>
            <td>
              <a href="#" class="btn btn-default btn-sm" @click="editAnalysis(analysis)"><i class="fa fa-edit"></i></a>
              <a href="#" class="btn btn-danger btn-sm" @click="askRemoveAnalysis(analysis)"><i class="fa fa-times"></i></a>
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
    this.$bus.$on('analysises.created', this.fetchAnalysiss())
    this.$bus.$on('analysises.updated', this.fetchAnalysiss())
    this.fetchAnalysiss()
  },
  computed: {
    ...mapState({
      analysises: state => state.Experiments.analysises,
      analysises_pagination: state => state.Experiments.analysises_pagination
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.analysises_pagination
    },
    isFormVisible () {
      return this.$route.name === 'analysises.new' || this.$route.name === 'analysises.edit'
    }
  },
  watch: {
    currentPage: 'fetchAnalysiss',
    $route: 'fetchAnalysiss'
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('analysises.created')
    this.$bus.$off('analysises.updated')
    next()
  },
  methods: {
    ...mapActions(['analysisesSetData', 'setFetching', 'setMessage']),
    fetchAnalysiss () {
      this.setFetching({
        fetching: true
      })
      this.$http.get(`experiments/analysises?page=${this.currentPage}`)
        .then(({
          data
        }) => {
          console.log(data)
          this.analysisesSetData({
            analysises: data.data,
            analysises_pagination: data.meta.pagination
          })
          this.setFetching({
            fetching: false
          })
        })
    },
    canPush (analysis) {
      let status = analysis.status
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
            this.fetchAnalysiss()
          })
          .catch((error) => {
            this.setMessage({ type: 'error', 'message': error})
          })
        }
        swal('成功', `批次${inputValue}已被成功提交`)
      })
    },
    statusColor (analysis) {
      let status = analysis.status
      return status ? (status === 1 ? '#3097D1': '#8eb4cb') : '#bf5329'
    },
    clickAddMore () {
      this.addMore = !this.addMore
    },
    create () {
      this.$router.push({
        name: 'analysises.new',
        query: {
          page: this.currentPage
        }
      })
    },
    hide () {
      this.$router.push({
        name: 'analysises.index',
        query: {
          page: this.currentPage
        }
      })
    },
    editAnalysis (analysis) {
      let analysis_id = analysis.id
      this.$router.push({
        name: 'analysises.edit',
        params: {
          analysis_id
        }
      })
    },
    askRemoveAnalysis (analysis) {
      swal({
        title: '确定吗？',
        text: `该步样品${analysis.id}将会被废弃`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.removeAnalysis(analysis))
    },
    removeAnalysis (analysis) {
      this.$http.patch(`experiments/${analysis.id}/cancel`)
        .then(() => {
          swal('完成', '该步样品废弃成功', 'success')
          this.fetchAnalysiss()
        })
    },
    navigate (obj) {
      this.$router.push({
        name: 'analysises.index',
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
