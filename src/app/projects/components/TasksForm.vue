<template lang="html">
  <div>
    <form class="well">
      <div class="row">
        <div class="col-sm-6">
          <div class="form-group">
            <label for="name" class="control-label">任务名称</label>
            <input type="text" class="form-control" v-model="form.name" id="name">
          </div>
        </div>
        <div class="col-sm-6">
          <div class="form-group">
            <label for="pipeline_id" class="control-label">技术路线</label>
            <select class="form-control" id="pipeline_id" v-model="form.pipeline_id">
              <option label="其他" value="0"></option>
              <option label="16S" value="1"></option>
              <option label="WGS" value="2"></option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <div class="form-group">
            <label for="name" class="control-label">实验负责人</label>
            <select class="form-control" id="exp_manager" v-model="form.exp_manager">
              <option label="待定" value="0"></option>
              <option label="杨仁涛" value="1"></option>
            </select>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="form-group">
            <label for="name" class="control-label">信息负责人</label>
            <select class="form-control" id="info_manager" v-model="form.info_manager">
              <option label="待定" value="0"></option>
              <option label="苏丽丽" value="1"></option>
              <option label="刘光" value="1"></option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <div class="form-group">
            <label for="start_time" class="control-label">开始时间</label>
            <input type="date" class="form-control" v-model="form.start_time" id="start_time">
          </div>
        </div>
        <div class="col-sm-6">
          <div class="form-group">
            <label for="end_time" class="control-label">截止时间</label>
            <input type="date" class="form-control" v-model="form.end_time" id="end_time">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-5">
          <table class="table table-striped">
            <thead>
              <tr>
                <th></th>
                <th>样品编号</th>
                <th>寄送时间</th>
                <th>到样时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="batch in batches">
                <td>
                  <input type="checkbox" :value="batch" v-model="form.batchesSelection">
                </td>
                <td>
                  {{ batch.client_id }}
                </td>
                <td>
                  {{ batch.send_time }}
                </td>
                <td>
                  {{ batch.arrive_time }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-sm-2 text-center" style="padding-top:2em;color:#3097D1;">
          <i class="fa fa-exchange fa-2x"></i>
        </div>
        <div class="col-sm-5">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>样品编号</th>
                <th>寄送时间</th>
                <th>到样时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="batch in form.batchesSelection">
                <td>
                  {{ batch.client_id }}
                </td>
                <td>
                  {{ batch.send_time }}
                </td>
                <td>
                  {{ batch.arrive_time }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-4 col-sm-offset-4">
          <a href="#" class="btn btn-primary full-width" @click="submit">保存</a>
        </div>
      </div>

    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      form: {
        id: 0,
        name: '',
        project_id: this.$route.params.id,
        pipeline_id: 0,
        exp_manager: 0,
        info_manager: 0,
        start_time: '',
        end_time: '',
        batchesSelection: []
      }
    }
  },
  computed: {
    ...mapState({
      batches: state => state.Batches.batches
    }),
    isEditing () {
      return this.form.id > 0
    },
    isValid () {
      return true
    },
    showCreateForm () {
      return this.$route.name === 'project.tasks.new'
    }
  },
  mounted () {
    this.fetch()
  },
  watch: {
    $route: 'fetch'
  },
  methods: {
    ...mapActions(['batchesSetData', 'setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      const id = this.$route.params.task_id
      if (id !== undefined) {
        this.setFetching({ fetching: true })
        this.$http.get(`tasks/${id}`).then(({ data }) => {

          this.form = {...data.data}
          console.log(this.form)
        })
      }
      this.$http.get('batches/unsign').then(({ data }) => {
        this.batchesSetData({
          batches: data.data
        })
      })
    },
    submit () {
      if (this.isValid) {
        if (this.isEditing) {
          this.update()
        } else {
          this.save()
        }
      }
    },
    update () {
      this.$http.put(`tasks/${this.form.id}`, this.form).then(() => {
        this.$bus.$emit('tasks.updated')
        this.setFetching({
          fetching: false
        })
        this.setMessage({ type: 'success', message: '样品更新成功' })
        this.reset()
      })
    },
    save () {
      this.$http.post('tasks', this.form).then(() => {
        this.$bus.$emit('tasks.created')
        this.setFetching({
          fetching: false
        })
        this.setMessage({ type: 'success', message: '样品添加成功' })
        this.reset()
      })
    },
    reset () {
      this.form.id = 0
      this.form.name = ''
      this.form.project_id = this.$route.params.id
      this.form.pipeline_id = 0
      this.form.exp_manager = 0
      this.form.info_manager = 0
      this.form.start_time = ''
      this.form.end_time = ''
      this.form.batchesSelection = []
    }
  }
}
</script>

<style lang="css">
</style>
