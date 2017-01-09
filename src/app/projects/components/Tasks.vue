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
    <div class="divider"></div>

    <transition name="fade">
      <router-view></router-view>
    </transition>

    <div class="table-content">
      <table class="table table-striped">
        <thead><tr><th>提交给实验处理</th><th>任务名称</th><th>技术路线</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="task in tasks">
            <td width="140" >
              <a href="#" class="btn btn-block btn-sm btn-info"  @click="pushToExperiment(task)" v-show="!task.pushed"><i class="fa fa-send"></i></a>
              <p v-show="task.pushed">已进入实验流程</p>
            </td>
          <td>{{ task.name }}</td>
          <td>{{ task.pipeline_id }}</td>
          <td>
            <a href="#" class="btn btn-default btn-sm" @click="editTask(task)"><i class="fa fa-edit"></i></a>
            <a href="#" class="btn btn-danger btn-sm" @click="askRemoveTask(task)"><i class="fa fa-times"></i></a>
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
      addMore: false
    }
  },
  mounted () {
    this.$bus.$on('navigate', obj => this.navigate(obj)),
    this.$bus.$on('tasks.created', this.fetchTasks())
    this.$bus.$on('tasks.updated', this.fetchTasks())
    this.fetchTasks()
  },
  computed: {
    ...mapState({
      tasks: state => state.Projects.tasks,
      tasks_pagination: state => state.Projects.tasks_pagination
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.tasks_pagination
    },
    isFormVisible () {
      return this.$route.name === 'project.tasks.new' || this.$route.name === 'project.tasks.edit'
    },
    project_id () {
      return this.$route.params.id
    }
  },
  watch: {
    currentPage: 'fetchTasks',
    $route: 'fetchTasks'
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('tasks.created')
    this.$bus.$off('tasks.updated')
    next()
  },
  methods: {
    ...mapActions(['tasksSetData', 'recipientsSetData', 'locationsSetData', 'setFetching', 'setMessage']),
    fetchTasks () {
      this.setFetching({
        fetching: true
      })
      this.$http.get(`projects/${this.project_id}/tasks?page=${this.currentPage}`)
        .then(({
          data
        }) => {
          this.tasksSetData({
            tasks: data.data,
            tasks_pagination: data.meta.pagination
          })
          this.setFetching({
            fetching: false
          })
        })
    },
    clickAddMore () {
      this.addMore = !this.addMore
    },
    pushToExperiment (task) {
      swal({
        title: '确定吗？',
        text: `任务${task.name}将会被添加到实验线`,
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3097D1',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.confirmPush(task))
    },
    confirmPush (task) {
      let id = task.id
      this.$http.patch(`tasks/${id}/push`)
      .then(() => {
        swal('完成', '任务添加到实验线成功', 'success')
        this.fecthTasks()
      })
    },
    create () {
      this.$router.push({
        name: 'project.tasks.new',
        query: {
          page: this.currentPage
        }
      })
    },
    hide () {
      this.$router.push({
        name: 'project.tasks.index',
        query: {
          page: this.currentPage
        }
      })
    },
    editTask (task) {
      let task_id = task.id
      this.$router.push({
        name: 'project.tasks.edit',
        params: {
          task_id
        }
      })
    },
    askRemoveTask (task) {
      swal({
        title: '确定吗？',
        text: `样品${task.id}将会被删除`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.deleteTask(task))
    },
    deleteTask (task) {
      this.$http.delete(`tasks/${task.id}`)
        .then(() => {
          swal('完成', '样品删除成功', 'success')
          this.fetchTasks()
        })
    },
    navigate (obj) {
      this.$router.push({
        name: 'tasks.index',
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
