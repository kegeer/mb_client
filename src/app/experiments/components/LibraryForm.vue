<template lang="html">
  <div>
    <form class="well">
      <div class="row">
      <div class="row">
        <div class="col-sm-2">
          <h3>建库前</h3>
        </div>
        <div class="col-sm-5">
          <label for="pre_v" class="control-label">体积</label>
          <input id="pre_v" type="text" class="form-control" v-model="form.pre_v">
        </div>
        <div class="col-sm-5">
          <label for="pre_c" class="control-label">浓度</label>
          <input id="pre_c" type="text" class="form-control" v-model="form.pre_c">
        </div>
      </div>
      <div class="row">
        <div class="col-md-2">
          <h3>建库后</h3>
        </div>
        <div class="col-md-2">
          <label for="after_index" class="control-label">Index</label>
          <input id="after_index" type="text" class="form-control" v-model="form.after_index">
        </div>
        <div class="col-md-2">
          <label for="after_v" class="control-label">体积</label>
          <input id="after_v" type="text" class="form-control" v-model="form.after_v">
        </div>
        <div class="col-md-2">
          <label for="after_c" class="control-label">浓度</label>
          <input id="after_c" type="text" class="form-control" v-model="form.after_c">
        </div>
        <div class="col-md-2">
          <label for="after_e_map" class="control-label">电泳结果</label>
          <input id="after_e_map" type="text" class="form-control" v-model="form.after_e_map">
        </div>
        <div class="col-md-2">
          <label for="after_library_size" class="control-label">文库片段大小</label>
          <input id="after_library_size" type="text" class="form-control" v-model="form.after_library_size">
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
        pre_v: 0,
        pre_c: 0,
        after_index: '',
        after_v: 0,
        after_c: 0,
        after_e_map: '',
        after_library_size: 0
      }
    }
  },
  computed: {
    ...mapState({
      libraries: state => state.Experiments.libraries
    }),
    isEditing () {
      return this.form.id > 0
    },
    isValid () {
      return true
    },
    showCreateForm () {
      return this.$route.name === 'libraries.new'
    },
    experiment_id () {
      return this.$route.params.library_id
    }
  },
  mounted () {
    this.fetch()
  },
  watch: {
    $route: 'fetch'
  },
  methods: {
    ...mapActions(['librariesSetData', 'setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      this.setFetching({ fetching: true })
      this.$http.get(`experiments/${this.experiment_id}`).then(({ data }) => {
        let library = data.data
        if (typeof (library.quality) === 'object') {
          this.form = {...library.quality}
        } else {
          let data = JSON.parse(library.quality)
          console.log(data)
          this.form = {...data}
        }
      })
    },
    submit () {
      this.$http.put(`/experiments/${this.experiment_id}`, this.form).then(() => {
        this.$bus.$emit('libraries.updated')
        this.setFetching({
          fetching: false
        })
        this.setMessage({ type: 'success', message: '分装信息更新成功' })
        this.reset()
      })
    },
    reset () {
      this.form.id = 0
      this.form.v = 0
      this.form.m = 0
      this.form.left = 0
    }
  }
}
</script>

<style lang="css">
</style>
