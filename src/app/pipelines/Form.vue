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
            <div class="col-md-12">
              <div class="form-group">
                <label for="name" class="control-label">技术路线名称</label>
                <input type="text" class="form-control" v-model="form.name" id="name">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>步骤</th>
                    <th>实验流程</th>
                    <th>实验方法</th>
                    <th>耗时</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="step in form.steps">
                    <td>
                      <span class="next">{{ step.step }}</span>
                    </td>
                    <td>
                      <select class="form-control" v-model="step.procedure">
                        <option v-for="procedure in procedures" :value="procedure.id">{{ procedure.name }}</option>
                      </select>
                    </td>
                    <td>
                      <select class="form-control" v-model="step.protocol">
                        <option v-for="protocol in protocols" :label="protocol.name" :value="protocol.id"></option>
                      </select>
                    </td>
                    <td><input type="text" class="form-control" v-model="step.time"></td>
                    <td>
                      <a href="#" class="btn btn-danger btn-sm" @click="removeLine(step)"><i class="fa fa-times"></i></a>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <a href="#" class="btn btn-info btn-sm" @click="addNewLine"><i class="fa fa-plus"></i></a>
                    </td>
                  </tr>
                </tbody>
              </table>
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
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      form: {
        id: 0,
        name: '',
        steps: [
          {
            step: 1,
            procedure: 0,
            protocol: 0,
            time: 0
          }
        ]
      }
    }
  },
  watch: {
    $route: 'fetch',
    $route: 'reset'
  },
  mounted () {
    this.fetch()
    console.log({...this.procedures})
  },
  computed: {
    ...mapState({
      procedures: state => state.procedures,
      protocols: state => state.Pipelines.protocols
    }),
    isEditing () {
      return this.form.id > 0
    },
    isValid () {
      return true
    },
    formTitle () {
      return this.form.id > 0 ? '修改技术路线信息': '新增技术路线'
    }
  },
  methods: {
    ...mapActions(['proceduresSetData', 'protocolsSetData', 'setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      const id = this.$route.params.id
      if (id !== undefined) {
        this.setFetching({ fetching: true })
        this.$http.get(`pipelines/${id}`)
        .then(({ data }) => {
          let pipeline = data.data
          this.form = {...pipeline}
          this.setFetching({ fetching: false })
        })
      }
      this.$http.get('procedures').then(({ data }) => {
        this.proceduresSetData({
          procedures: data
        })
      })
      this.$http.get('protocols').then(({ data }) => {
        this.protocolsSetData({
          protocols: data.data
        })
      })
    },
    addNewLine () {
      this.form.steps.push({
        step: this.form.steps.length + 1,
        procedure: 0,
        protocol: 0,
        time: 0
      })
    },
    removeLine (step) {
      let index = this.form.steps.indexOf(step)
      this.form.steps.splice(index, 1)
    },
    submit () {
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
      this.$http.post('pipelines', pick(this.form, ['name', 'manager']))
      .then(() => {
        this.$bus.$emit('pipelines.created')
        this.setFetching({ fetching: false })
        this.setMessage({ type: 'success', message: '新技术路线录入成功'})
        this.reset()
      })
    },
    update () {
      this.$http.put(`pipelines/${this.form.id}`, this.form)
      .then(() => {
        this.$bus.$emit('pipelines.updated')
        this.setMessage({ type:'success', message: '技术路线信息更新成功' })
        this.reset()
      })
    },
    reset () {
      this.form.id = 0
      this.form.name = ''
      this.form.steps = [
        {
          step: 1,
          procedure: 0,
          protocol: 0,
          time: 0
        }
      ]
    }
  }
}
</script>

<style lang="css">
</style>
