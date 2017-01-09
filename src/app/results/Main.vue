<template lang="html">
  <div>
    <div id="list">
      <h3>所有质控</h3>

      <div class="table-content">
        <table class="table table-striped">
          <thead><tr><th>ID</th><th>样品ID</th><th>产品类型</th><th>结果生成日期</th><th>操作</th></tr></thead>
          <tbody><tr v-for="result in results">
            <td>{{ result.sample_id }}</td>
            <td>{{ result.product }}</td>
            <td>{{ result.created_at }}</td>
            <td>
              <a href="#" class="btn btn-primary btn-sm" @click="show(result)"><i class="fa fa-eye"></i></a>
              <a href="#" class="btn btn-danger btn-sm" @click="askRemoveResult(result)"><i class="fa fa-times"></i></a>
            </td>
          </tr></tbody>
        </table>
          <pagination :paginationData="pagination" :currentPage="currentPage" :maxItems="pagination.total"></pagination>
      </div>
    </div>

    <!-- main container form router-view -->
    <div id="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  mounted () {
    this.$bus.$on('navigate', obj => this.navigate(obj)),
    this.fetchResults()
  },
  computed: {
    ...mapState({
      results: state => state.Results.results,
      results_pagination: state => state.Results.results_pagination
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.results_pagination
    }
  },
  watch: {
    currentPage: 'fetchResults'
  },
  methods: {
    ...mapActions(['resultsSetData']),
    fetchResults () {
      this.$http.get(`results?page=${this.currentPage}`)
      .then(({ data }) => {
        this.resultsSetData({
          results: data.data,
          results_pagination: data.meta.pagination
        })
      })
    },
    show (result) {
      const { id } = result.id
      this.$router.push({
        name: 'results.show',
        params: {
          id
        }
      })
    },
    askRemoveResult (result) {
      swal({
        title: '确定吗？',
        text: `项目${result.id}将会被删除`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.deleteResult(result))
    },
    deleteResult (result) {
      this.$http.delete(`results/${result.id}`)
      .then(() => {
        swal('完成', '项目删除成功', 'success')
      })
    },
    navigate (obj) {
      this.$router.push({ name: 'batches.index', query:{ page: obj.page }})
    }
  }
}
</script>

<style lang="css">
</style>
