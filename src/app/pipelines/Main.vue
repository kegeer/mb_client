<template lang="html">
  <div>
    <div id="list">
      <h3>所有技术路线</h3>
      <a href="#" class="btn btn-primary" @click.prevent="addNew()">
        <i class="fa fa-plus"></i>添加新技术路线
      </a>
      <span class="dropdown" :class="{ open: addMore }">
        <a href="#" class="btn btn-default" @click.prevent="clickAddMore()">
          其余功能<i class="fa fa-angle-down"></i>
        </a>
        <ul class="dropdown-menu">
          <li><a href="#" @click.prevent="protocols">所有实验方法</a></li>
          <li><a href="#" @click.prevent="newManager">添加项目负责人</a></li>
        </ul>
      </span>

      <div class="table-content">
        <table class="table table-striped">
          <thead><tr><th>ID</th><th>名称</th><th>操作</th></tr></thead>
          <tbody><tr v-for="pipeline in pipelines">
            <td>{{ pipeline.id }}</td>
            <td>{{ pipeline.name }}</td>
            <td>
              <a href="#" class="btn btn-default btn-sm" @click="editPipeline(pipeline)"><i class="fa fa-edit"></i></a>
              <a href="#" class="btn btn-danger btn-sm" @click="askRemovePipeline(pipeline)"><i class="fa fa-times"></i></a>
            </td>
          </tr></tbody>
        </table>
          <pagination :paginationData="pagination" :currentPage="currentPage" :maxItems="pagination.total"></pagination>
      </div>
    </div>
    <!-- 技术路线负责人管理 -->
    <div class="modal fade" id="managersForm" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-md">
        <div class="modal-content">
          <table class="table">
            <thead>
              <tr><th>姓名</th><th>操作</th></tr>
            </thead>
            <tbody>
              <tr v-for="manager in managers">
                <td>{{ manager.name }}</td>
                <td>
                  <a href="#" class="btn btn-sm btn-default" @click="editManager(manager)"><i class="fa fa-edit"></i></a>
                  <a href="#" class="btn btn-sm btn-warning" @click="deleteManager(manager)"><i class="fa fa-delete"></i></a>
                </td>
              </tr>
              <tr>
                <form @submit.prevent="addNewManager()">
                  <td><input type="text" v-model="manager.name" class="form-control" placeholder="姓名"></td>
                  <td><button class="btn btn-primary" @click.prevent="addNewManager">添加</button></td>
                </form>
              </tr>
            </tbody>
          </table>
        </div>
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
  data () {
    return {
      manager: { name: '' },
      addMore: false
    }
  },
  mounted () {
    this.$bus.$on('navigate', obj => this.navigate(obj)),
    this.$bus.$on('pipelines.created', this.fetchPipelines()),
    this.$bus.$on('pipelines.updated', this.fetchPipelines()),
    this.fetchPipelines()
  },
  computed: {
    ...mapState({
      pipelines: state => state.Pipelines.pipelines,
      pipelines_pagination: state => state.Pipelines.pipelines_pagination,
      managers: state => state.Pipelines.managers
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.pipelines_pagination
    }
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('pipelines.created'),
    this.$bus.$off('pipelines.updated'),
    next()
  },
  watch: {
    currentPage: 'fetchBatches'
  },
  methods: {
    ...mapActions(['pipelinesSetData', 'managersSetData', 'locationsSetData']),
    fetchPipelines () {
      this.$http.get(`pipelines?page=${this.currentPage}`)
      .then(({ data }) => {
        this.pipelinesSetData({
          pipelines: data.data,
          pipelines_pagination: data.meta.pagination
        })
      })
    },
    fetchManagers () {
      this.$http.get('managers')
      .then(({ data }) => {
        this.managersSetData({
          managers: data.data
        })
      })
    },
    protocols () {
      this.$router.push({
        name: 'protocols.index'
      })
    },
    clickAddMore () {
      this.addMore = !this.addMore
    },
    addNew () {
      this.$router.push({
        name: 'pipelines.new'
      })
    },
    protocols (pipeline) {
      let id = pipeline.id
      this.$router.push({
        name: 'pipeline.protocols.index',
        params: { id }
      })
    },
    editPipeline (pipeline) {
      let id = pipeline.id
      this.$router.push({
        name: 'pipelines.edit',
        params: { id }
      })
    },
    askRemovePipeline (pipeline) {
      swal({
        title: '确定吗？',
        text: `技术路线${pipeline.id}将会被删除`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.deletePipeline(pipeline))
    },
    deletePipeline (pipeline) {
      this.$http.delete(`pipelines/${pipeline.id}`)
      .then(() => {
        swal('完成', '技术路线删除成功', 'success')
      })
    },
    newManager () {
      this.fetchManagers()
      this.clickAddMore()
      $('#managersForm').modal('show')
    },
    addNewManager () {

    },
    editManager (r) {

    },
    deleteManager (r) {

    },
    navigate (obj) {
      this.$router.push({ name: 'batches.index', query:{ page: obj.page }})
    }
  }
}
</script>

<style lang="css">
</style>
