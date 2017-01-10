<template lang="html">
  <div>
    <form class="well">
      <div class="row">
        <div class="col-sm-4">
          <label for="ori_c" class="control-label">位置</label>
          <input id="ori_c" type="text" class="form-control" v-model="form.ori_c">
        </div>
        <div class="col-sm-4">
          <label for="sample_v" class="control-label">96孔板流水号</label>
          <input id="sample_v" type="text" class="form-control" v-model="form.sample_v">
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
        position: 0,
        plate_num: 0
      }
    }
  },
  computed: {
    ...mapState({
      distributions: state => state.Experiments.distributions
    }),
    isEditing () {
      return this.form.id > 0
    },
    isValid () {
      return true
    },
    showCreateForm () {
      return this.$route.name === 'distributions.new'
    },
    experiment_id () {
      return this.$route.params.distribution_id
    }
  },
  mounted () {
    this.fetch()
  },
  watch: {
    $route: 'fetch'
  },
  methods: {
    ...mapActions(['distributionsSetData', 'setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      this.setFetching({ fetching: true })
      this.$http.get(`experiments/${this.experiment_id}`).then(({ data }) => {
        let distribution = data.data
        if (typeof (distribution.quality) === 'object') {
          this.form = {...distribution.quality}
        } else {
          let data = JSON.parse(distribution.quality)
          console.log(data)
          this.form = {...data}
        }
      })
    },
    submit () {
      this.$http.put(`/experiments/${this.experiment_id}`, this.form).then(() => {
        this.$bus.$emit('distributions.updated')
        this.setFetching({
          fetching: false
        })
        this.setMessage({ type: 'success', message: '分装信息更新成功' })
        this.reset()
      })
    },
    reset () {
      this.form.position = 0
      this.form.plate_num = 0
    }
  }
}
</script>

<style lang="css">
</style>
