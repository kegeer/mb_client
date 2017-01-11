<template lang="html">
  <div>
    <div id="list">
      <h3>所有质控</h3>

      <div class="table-content">
        <table class="table table-striped">
          <thead><tr><th>ID</th><th>上机ID</th><th>数据下机日期</th><th>操作</th></tr></thead>
          <tbody><tr v-for="qc in qcs">
            <td>{{ qc.run_id }}</td>
            <td>{{ qc.created_at }}</td>
            <td>
              <a href="#" class="btn btn-primary btn-sm" @click="show(qc)"><i class="fa fa-eye"></i></a>
              <a href="#" class="btn btn-danger btn-sm" @click="askRemoveQc(qc)"><i class="fa fa-times"></i></a>
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
    this.$bus.$on('qcs.created', () => this.fetchQcs),
    this.$bus.$on('qcs.updated', () => this.fetchQcs),
    this.fetchQcs()
    console.log({...this.qcs})
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('qcs.created')
    this.$bus.$off('qcs.updated')
  },
  computed: {
    ...mapState({
      qcs: state => state.Qcs.qcs,
      qcs_pagination: state => state.Qcs.qcs_pagination
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.qcs_pagination
    }
  },
  watch: {
    currentPage: 'fetchQcs'
  },
  methods: {
    ...mapActions(['qcsSetData']),
    fetchQcs () {
      this.$http.get(`qcs?page=${this.currentPage}`)
      .then(({ data }) => {
        console.log(data.data)
        this.qcsSetData({
          qcs: data.data,
          qcs_pagination: data.meta.pagination
        })
      })
    },
    show (qc) {
      const { id } = qc.id
      this.$router.push({
        name: 'qcs.show',
        params: {
          id
        }
      })
    },
    askRemoveQc (qc) {
      swal({
        title: '确定吗？',
        text: `项目${qc.id}将会被删除`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.deleteQc(qc))
    },
    deleteQc (qc) {
      this.$http.delete(`qcs/${qc.id}`)
      .then(() => {
        swal('完成', '项目删除成功', 'success')
      })
    },
    navigate (obj) {
      this.$router.push({ name: 'qcs.index', query:{ page: obj.page }})
    }
  }
}
</script>

<style lang="css">
</style>
