<template lang="html">
  <div>
    <form class="well">
      <div class="row">
        <div class="col-sm-6">
          <div class="form-group">
            <label for="procedure" class="control-label">所属流程</label>
            <select id="procedure" class="form-control" v-model="form.procedure">
              <option v-for="procedure in procedures" :value="procedure.id">{{ procedure.name }}</option>
            </select>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="form-group">
            <label for="name" class="control-label">名称</label>
            <input id="name" type="text" class="form-control" v-model="form.name">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <div class="form-group">
            <label for="form.content" class="control-label">详细步骤</label>
            <textarea rows="8" cols="80" id="form.content" v-model="form.content"></textarea>
          </div>
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
        procedure: 0,
        name: '',
        content: ''
      }
    }
  },
  computed: {
    ...mapState({
      procedures: state => state.procedures
    }),
    isEditing () {
      return this.form.id > 0
    },
    isValid () {
      return true
    },
    showCreateForm () {
      return this.$route.name === 'protocols.new'
    }
  },
  mounted () {
    this.fetch()
    this.fetchProcedures()
  },
  watch: {
    $route: 'fetch'
  },
  methods: {
    ...mapActions(['proceduresSetData', 'setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      const id = this.$route.params.protocol_id
      if (id !== undefined) {
        this.setFetching({ fetching: true })
        this.$http.get(`protocols/${id}`).then(({ data }) => {
          this.form = {...data.data}
          console.log(this.form)
        })
      }
    },
    fetchProcedures () {
      this.$http.get('procedures')
      .then(({ data }) => {
        proceduresSetData({
          procedures: data
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
      this.$http.put(`protocols/${this.form.id}`, this.form).then(() => {
        this.$bus.$emit('protocols.updated')
        this.setFetching({
          fetching: false
        })
        this.setMessage({ type: 'success', message: '实验方法更新成功' })
        this.reset()
      })
    },
    save () {
      this.$http.post('protocols', this.form).then(() => {
        this.$bus.$emit('protocols.created')
        this.setFetching({
          fetching: false
        })
        this.setMessage({ type: 'success', message: '实验方法添加成功' })
        this.reset()
      })
    },
    reset () {
      this.form.id = 0
      this.form.procedure = 0
      this.form.name = ''
      this.form.content = ''
    }
  }
}
</script>

<style lang="css">
</style>
