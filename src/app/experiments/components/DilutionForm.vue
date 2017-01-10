<template lang="html">
  <div>
    <form class="well">
      <div class="row">
        <div class="col-sm-2">
          <label for="ori_c" class="control-label">原浓度</label>
          <input id="ori_c" type="text" class="form-control" v-model="form.ori_c">
        </div>
        <div class="col-sm-2">
          <label for="sample_v" class="control-label">取样体积</label>
          <input id="sample_v" type="text" class="form-control" v-model="form.sample_v">
        </div>
        <div class="col-sm-2">
          <label for="water" class="control-label">加水量</label>
          <input id="water" type="text" class="form-control" v-model="form.water">
        </div>
        <div class="col-sm-2">
          <label for="last_c" class="control-label">终浓度</label>
          <input id="last_c" type="text" class="form-control" v-model="form.last_c">
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
        ori_c: 0,
        sample_v: 0,
        water: 0,
        last_c: 0
      }
    }
  },
  computed: {
    ...mapState({
      dilutions: state => state.Experiments.dilutions
    }),
    isEditing () {
      return this.form.id > 0
    },
    isValid () {
      return true
    },
    showCreateForm () {
      return this.$route.name === 'dilutions.new'
    },
    experiment_id () {
      return this.$route.params.dilution_id
    }
  },
  mounted () {
    this.fetch()
  },
  watch: {
    $route: 'fetch'
  },
  methods: {
    ...mapActions(['dilutionsSetData', 'setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      this.setFetching({ fetching: true })
      this.$http.get(`experiments/${this.experiment_id}`).then(({ data }) => {
        let dilution = data.data
        if (typeof (dilution.quality) === 'object') {
          this.form = {...dilution.quality}
        } else {
          let data = JSON.parse(dilution.quality)
          console.log(data)
          this.form = {...data}
        }
      })
    },
    submit () {
      this.$http.put(`/experiments/${this.experiment_id}`, this.form).then(() => {
        this.$bus.$emit('dilutions.updated')
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
