<template lang="html">
  <div id="main">
    <div class="row">
      <div class="col-md-6">
        <h1>
          样品提取&nbsp;&nbsp;
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
            <th colspan="3">提取结果</th>
            <th rowspan="2">操作</th>
          </tr>
          <tr>
            <th>浓度</th>
            <th>体积</th>
            <th>总量</th>
            <th>电泳结果</th>
          </tr>
        </thead>
        <tbody class="text-center">
          <tr v-for="extraction in extractions">
            <td>
              <input type="checkbox" v-show="canPush(extraction)" :value="extraction.id" v-model="multipleSelection">
            </td>
            <td>{{ extraction.sample_id }}</td>
            <td><i class="fa fa-circle" :style="{color: statusColor(extraction)}"></i></td>
            <td>{{ extraction.quality.c }}</td>
            <td>{{ extraction.quality.v }}</td>
            <td>{{ extraction.quality.total }}</td>
            <td>{{ extraction.quality.result }}</td>
            <td>
              <a href="#" class="btn btn-default btn-sm" @click="editdExtraction(extraction)"><i class="fa fa-edit"></i></a>
              <a href="#" class="btn btn-danger btn-sm" @click="askRemovedExtraction(extraction)"><i class="fa fa-times"></i></a>
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
    this.$bus.$on('extractions.created', () => this.fetchdExtractions())
    this.$bus.$on('extractions.updated', () => this.fetchdExtractions())
    this.fetchdExtractions()
  },
  computed: {
    ...mapState({
      extractions: state => state.Experiments.extractions,
      extractions_pagination: state => state.Experiments.extractions_pagination
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.extractions_pagination
    },
    isFormVisible () {
      return this.$route.name === 'extractions.new' || this.$route.name === 'extractions.edit'
    }
  },
  watch: {
    currentPage: 'fetchdExtractions',
    $route: 'fetchdExtractions'
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('extractions.created')
    this.$bus.$off('extractions.updated')
    next()
  },
  methods: {
    ...mapActions(['extractionsSetData', 'setFetching', 'setMessage']),
    fetchdExtractions () {
      this.setFetching({
        fetching: true
      })
      this.$http.get(`experiments/extractions?page=${this.currentPage}`)
        .then(({
          data
        }) => {
          console.log(data)
          this.extractionsSetData({
            extractions: data.data,
            extractions_pagination: data.meta.pagination
          })
          this.setFetching({
            fetching: false
          })
        })
    },
    canPush (extraction) {
      let status = extraction.status
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
            this.fetchdExtractions()
          })
          .catch((error) => {
            this.setMessage({ type: 'error', 'message': error})
          })
        }
        swal('成功', `批次${inputValue}已被成功提交`)
      })
    },
    statusColor (extraction) {
      let status = extraction.status
      return status ? (status === 1 ? '#3097D1': '#8eb4cb') : '#bf5329'
    },
    clickAddMore () {
      this.addMore = !this.addMore
    },
    create () {
      this.$router.push({
        name: 'extractions.new',
        query: {
          page: this.currentPage
        }
      })
    },
    hide () {
      this.$router.push({
        name: 'extractions.index',
        query: {
          page: this.currentPage
        }
      })
    },
    editdExtraction (extraction) {
      let extraction_id = extraction.id
      this.$router.push({
        name: 'extractions.edit',
        params: {
          extraction_id
        }
      })
    },
    askRemovedExtraction (extraction) {
      swal({
        title: '确定吗？',
        text: `该步样品${extraction.id}将会被废弃`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.removedExtraction(extraction))
    },
    removedExtraction (extraction) {
      this.$http.patch(`experiments/${extraction.id}/cancel`)
        .then(() => {
          swal('完成', '该步样品废弃成功', 'success')
          this.fetchdExtractions()
        })
    },
    navigate (obj) {
      this.$router.push({
        name: 'extractions.index',
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
