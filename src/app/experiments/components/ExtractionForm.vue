<template lang="html">
  <div>
    <form class="well">
      <div class="row">
        <div class="col-sm-2">
          <label for="c" class="control-label">浓度</label>
          <input id="c" type="text" class="form-control" v-model="form.c">
        </div>
        <div class="col-sm-2">
          <label for="v" class="control-label">体积</label>
          <input id="v" type="text" class="form-control" v-model="form.v">
        </div>
        <div class="col-sm-2">
          <label for="total" class="control-label">总量</label>
          <input id="total" type="text" class="form-control" v-model="form.total">
        </div>
        <div class="col-sm-2">
          <label for="result" class="control-label">电泳结果</label>
          <input id="result" type="text" class="form-control" v-model="form.result">
        </div>
        <div class="col-sm-4">
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
        c: 0,
        v: 0,
        total: 0,
        result: 0
      }
    }
  },
  computed: {
    ...mapState({
      extractions: state => state.Experiments.extractions
    }),
    isEditing () {
      return this.form.id > 0
    },
    isValid () {
      return true
    },
    showCreateForm () {
      return this.$route.name === 'extractions.new'
    },
    experiment_id () {
      return this.$route.params.extraction_id
    }
  },
  mounted () {
    this.fetch()
  },
  watch: {
    $route: 'fetch'
  },
  methods: {
    ...mapActions(['extractionsSetData', 'setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      this.setFetching({ fetching: true })
      this.$http.get(`experiments/${this.experiment_id}`).then(({ data }) => {
        let extraction = data.data
        if (typeof (extraction.quality) === 'object') {
          this.form = {...extraction.quality}
        } else {
          let data = JSON.parse(extraction.quality)
          console.log(data)
          this.form = {...data}
        }
      })
    },
    submit () {
      this.$http.put(`/experiments/${this.experiment_id}`, this.form).then(() => {
        this.$bus.$emit('extractions.updated')
        this.setFetching({
          fetching: false
        })
        this.setMessage({ type: 'success', message: '分装信息更新成功' })
        this.reset()
      })
    },
    reset () {
      this.form.c = 0
      this.form.v = 0
      this.form.total = 0
      this.form.result = 0
    }
  }
}
</script>

<style lang="css">
</style>
