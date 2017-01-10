<template lang="html">
 <div>
   <div class="row">
      <div class="col-md-6">
       <h1>{{ formTitle }}</h1>
      </div>
    </div>
    <div class="divider"></div>
    <div class="row">
      <div class="col-sm-10 col-sm-offset-1">
        <form>
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label for="name" class="control-label">项目名称</label>
                <input type="text" id="name" v-model="form.name" class="form-control">
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="manager" class="control-label">负责人</label>
                <select class="form-control" id="manager" v-model="form.manager">
                  <option label="其他" value="0"></option>
                  <option label="李少川" value="1"></option>
                  <option label="周袁杰" value="2"></option>
                </select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4 col-sm-offset-4">
              <button class="btn btn-primary btn-block" @click.prevent="submit()">保存</button>
            </div>
          </div>

        </form>
      </div>
    </div>

 </div>
</template>

<script>
import { pick } from 'lodash'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      form: {
        id: 0,
        name: '',
        manager: 0
      }
    }
  },
  watch: {
    $route: 'fetch',
    $route: 'reset'
  },
  mounted () {
    this.fetch()
  },
  computed: {
    isEditing () {
      return this.form.id > 0
    },
    isValid () {
      return true
    },
    formTitle () {
      return this.form.id > 0 ? '修改项目信息': '新增项目'
    }
  },
  methods: {
    ...mapActions(['setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      const id = this.$route.params.id
      if (id !== undefined) {
        this.setFetching({ fetching: true })
        this.$http.get(`projects/${id}`)
        .then(({ data }) => {
          let project = data.data
          this.form = {...project}
          this.setFetching({ fetching: false })
        })
      }
    },
    submit () {
      console.log('sub')
      if (this.isValid) {
        this.setFetching({ fetching: true })
        if (this.isEditing) {
          this.update()
        } else {
          this.save()
        }
      }
    },
    save () {
      this.$http.post('projects', pick(this.form, ['name', 'manager']))
      .then(() => {
        this.$bus.$emit('projects.created')
        this.setFetching({ fetching: false })
        this.setMessage({ type: 'success', message: '新项目录入成功'})
        this.reset()
      })
    },
    update () {
      this.$http.put(`projects/${this.form.id}`, this.form)
      .then(() => {
        this.$bus.$emit('projects.updated')
        this.setMessage({ type:'success', message: '项目信息更新成功' })
        this.reset()
      })
    },
    reset () {
      this.form.name = ''
      this.form.manager = 0
    }
  }
}
</script>

<style lang="css">
</style>
