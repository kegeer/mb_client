<template lang="html">
  <div id="main">
    <div class="row">
      <div class="col-md-6">
        <h1>该批次样品管理</h1>
      </div>
      <div class="col-md-6 text-right">
        <div class="button-within-header">
          <a href="#" class="btn btn-default btn-sm" v-show="!isFormVisible" @click="create"><i class="fa fa-plus"></i></a>
          <a href="#" class="btn btn-default btn-sm" v-show="isFormVisible" @click="hide"><i class="fa fa-minus"></i></a>
        </div>

      </div>
    </div>

    <transition name="fade">
      <router-view></router-view>
    </transition>


    <div class="table-content">
      <table class="table table-striped">
        <thead><tr><th>ID</th><th>谱元编号</th><th>操作</th></tr></thead>
        <tbody><tr v-for="sample in samples">
          <td>{{ sample.id }}</td>
          <td>{{ sample.py_num }}</td>
          <td>
            <a href="#" class="btn btn-default btn-sm" @click="editSample(sample)"><i class="fa fa-edit"></i></a>
            <a href="#" class="btn btn-danger btn-sm" @click="askRemoveSample(sample)"><i class="fa fa-times"></i></a>
          </td>
        </tr></tbody>
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
      addMore: false
    }
  },
  mounted () {
    this.$bus.$on('navigate', obj => this.navigate(obj)),
    this.$bus.$on('samples.created', () => this.fetchSamples())
    this.$bus.$on('samples.updated', () => this.fetchSamples())
    this.fetchSamples()
  },
  computed: {
    ...mapState({
      samples: state => state.Batches.samples,
      samples_pagination: state => state.Batches.samples_pagination
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.samples_pagination
    },
    isFormVisible () {
      return this.$route.name === 'batch.samples.new' || this.$route.name === 'batch.samples.edit'
    },
    batch_id () {
      return this.$route.params.id
    }
  },
  watch: {
    currentPage: 'fetchSamples',
    $route: 'fetchSamples'
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('samples.created')
    this.$bus.$off('samples.updated')
    next()
  },
  methods: {
    ...mapActions(['samplesSetData', 'recipientsSetData', 'locationsSetData', 'setFetching']),
    fetchSamples () {
      this.setFetching({
        fetching: true
      })
      this.$http.get(`batches/${this.batch_id}/samples?page=${this.currentPage}`)
        .then(({
          data
        }) => {
          this.samplesSetData({
            samples: data.data,
            samples_pagination: data.meta.pagination
          })
          this.setFetching({
            fetching: false
          })
        })
    },
    clickAddMore () {
      this.addMore = !this.addMore
    },
    create () {
      this.$router.push({
        name: 'batch.samples.new',
        query: {
          page: this.currentPage
        }
      })
    },
    hide () {
      this.$router.push({
        name: 'batch.samples.index',
        query: {
          page: this.currentPage
        }
      })
    },
    editSample (sample) {
      let sample_id = sample.id
      this.$router.push({
        name: 'batch.samples.edit',
        params: {
          sample_id
        }
      })
    },
    askRemoveSample (sample) {
      swal({
        title: '确定吗？',
        text: `样品${sample.id}将会被删除`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.deleteSample(sample))
    },
    deleteSample (sample) {
      this.$http.delete(`samples/${sample.id}`)
        .then(() => {
          swal('完成', '样品删除成功', 'success')
          this.fetchSamples()
        })
    },
    navigate (obj) {
      this.$router.push({
        name: 'samples.index',
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
