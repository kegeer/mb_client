<template lang="html">
  <div>
    <div id="list">
      <h3>所有项目</h3>
      <a href="#" class="btn btn-primary" @click.prevent="addNew()">
        <i class="fa fa-plus"></i>添加新项目
      </a>
      <span class="dropdown" :class="{ open: addMore }">
        <a href="#" class="btn btn-default" @click.prevent="clickAddMore()">
          <i class="fa fa-arrow-down"></i>其余功能
        </a>
        <ul class="dropdown-menu">
          <li><a href="#" @click.prevent="newManager">添加项目负责人</a></li>
        </ul>
      </span>

      <div class="table-content">
        <table class="table table-striped">
          <thead><tr><th>ID</th><th>名称</th><th>负责人</th><th>操作</th></tr></thead>
          <tbody><tr v-for="project in projects">
            <td>{{ project.id }}</td>
            <td>{{ project.name }}</td>
            <td>{{ project.manager }}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-primary" @click.prevent="tasks(project)"><i class="fa fa-eye"></i></button>
                <button class="btn btn-default" @click.prevent="editProject(project)"><i class="fa fa-edit"></i></button>
                <button class="btn btn-danger" @click.prevent="askRemoveProject(project)"><i class="fa fa-times"></i></button>
              </div>
            </td>
          </tr></tbody>
        </table>
          <pagination :paginationData="pagination" :currentPage="currentPage" :maxItems="pagination.total"></pagination>
      </div>
    </div>
    <!-- 项目负责人管理 -->
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
                  <td><button class="btn btn-primary" @click.prevent="addNewManager">c</button></td>
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
      location: { name: '' },
      addMore: false
    }
  },
  mounted () {
    this.$bus.$on('navigate', obj => this.navigate(obj)),
    this.$bus.$on('projects.created', () => this.fetchProjects()),
    this.$bus.$on('projects.updated', () => this.fetchProjects()),
    this.fetchProjects()
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('projects.created'),
    this.$bus.$off('projects.updated'),
    next()
  },
  computed: {
    ...mapState({
      projects: state => state.Projects.projects,
      projects_pagination: state => state.Projects.projects_pagination,
      managers: state => state.Projects.managers
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.projects_pagination
    }
  },
  watch: {
    currentPage: 'fetchBatches'
  },
  methods: {
    ...mapActions(['projectsSetData', 'managersSetData', 'locationsSetData']),
    fetchProjects () {
      this.$http.get(`projects?page=${this.currentPage}`)
      .then(({ data }) => {
        this.projectsSetData({
          projects: data.data,
          projects_pagination: data.meta.pagination
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
    clickAddMore () {
      this.addMore = !this.addMore
    },
    addNew () {
      this.$router.push({
        name: 'projects.new',
        query: {
          page: this.currentPage
        }
      })
    },
    tasks (project) {
      let id = project.id
      this.$router.push({
        name: 'project.tasks.index',
        params: { id }
      })
    },
    editProject (project) {
      let id = project.id
      this.$router.push({
        name: 'projects.edit',
        params: { id }
      })
    },
    askRemoveProject (project) {
      swal({
        title: '确定吗？',
        text: `项目${project.id}将会被删除`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.deleteProject(project))
    },
    deleteProject (project) {
      this.$http.delete(`projects/${project.id}`)
      .then(() => {
        swal('完成', '项目删除成功', 'success')
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
