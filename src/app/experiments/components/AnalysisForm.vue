<template lang="html">
  <div>
    <form class="well">
      <div class="row">
        <div class="col-sm-2">
          <label for="primer" class="control-label">引物</label>
          <input id="primer" type="text" class="form-control" v-model="form.primer">
        </div>
        <div class="col-sm-2">
          <label for="cycle" class="control-label">循环数</label>
          <input id="cycle" type="text" class="form-control" v-model="form.cycle">
        </div>
        <div class="col-sm-2">
          <label for="c" class="control-label">浓度</label>
          <input id="c" type="text" class="form-control" v-model="form.c">
        </div>
        <div class="col-sm-2">
          <label for="v" class="control-label">体积</label>
          <input id="v" type="text" class="form-control" v-model="form.v">
        </div>
        <div class="col-sm-2">
          <label for="e_map" class="control-label">电泳结果</label>
          <input id="e_map" type="text" class="form-control" v-model="form.e_map">
        </div>
        <div class="col-sm-2">
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
        primer: 0,
        cycle: 0,
        c: 0,
        v: 0,
        e_map: ''
      }
    }
  },
  computed: {
    ...mapState({
      analysises: state => state.Experiments.analysises
    }),
    isEditing () {
      return this.form.id > 0
    },
    isValid () {
      return true
    },
    showCreateForm () {
      return this.$route.name === 'analysises.new'
    },
    experiment_id () {
      return this.$route.params.analysis_id
    }
  },
  mounted () {
    this.fetch()
  },
  watch: {
    $route: 'fetch'
  },
  methods: {
    ...mapActions(['analysisesSetData', 'setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      this.setFetching({ fetching: true })
      this.$http.get(`experiments/${this.experiment_id}`).then(({ data }) => {
        let analysises = data.data
        if (typeof (analysises.quality) === 'object') {
          this.form = {...analysises.quality}
        } else {
          let data = JSON.parse(analysises.quality)
          console.log(data)
          this.form = {...data}
        }
      })
    },
    submit () {
      this.$http.put(`/experiments/${this.experiment_id}`, this.form).then(() => {
        this.$bus.$emit('analysises.updated')
        this.setFetching({
          fetching: false
        })
        this.setMessage({ type: 'success', message: '产物分析信息更新成功' })
        this.reset()
      })
    },
    reset () {
      this.form.primer = 0
      this.form.cycle = 0
      this.form.c = 0
      this.form.v = 0
      this.form.e_map = ''
    }
  }
}
</script>

<style lang="css">
</style>
