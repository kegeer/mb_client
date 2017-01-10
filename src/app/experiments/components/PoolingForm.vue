<template lang="html">
  <div>
    <form class="well">
      <div class="row">
        <div class="col-sm-2">
          <label for="primer" class="control-label">引物</label>
          <input id="primer" type="text" class="form-control" v-model="form.primer">
        </div>
        <div class="col-sm-2">
          <label for="c" class="control-label">浓度</label>
          <input id="c" type="text" class="form-control" v-model="form.c">
        </div>
        <div class="col-sm-2">
          <label for="cycle" class="control-label">循环数</label>
          <input id="cycle" type="text" class="form-control" v-model="form.cycle">
        </div>
        <div class="col-sm-2">
          <label for="sample_v" class="control-label">取样体积</label>
          <input id="sample_v" type="text" class="form-control" v-model="form.sample_v">
        </div>
        <div class="col-sm-2">
          <label for="sampel_w" class="control-label">取样量</label>
          <input id="sampel_w" type="text" class="form-control" v-model="form.sampel_w">
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
        c: 0,
        cycle: 0,
        sample_v: 0,
        sampel_w: 0
      }
    }
  },
  computed: {
    ...mapState({
      poolings: state => state.Experiments.poolings
    }),
    isEditing () {
      return this.form.id > 0
    },
    isValid () {
      return true
    },
    showCreateForm () {
      return this.$route.name === 'poolings.new'
    },
    experiment_id () {
      return this.$route.params.pooling_id
    }
  },
  mounted () {
    this.fetch()
  },
  watch: {
    $route: 'fetch'
  },
  methods: {
    ...mapActions(['poolingsSetData', 'setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      this.setFetching({ fetching: true })
      this.$http.get(`experiments/${this.experiment_id}`).then(({ data }) => {
        let pooling = data.data
        if (typeof (pooling.quality) === 'object') {
          this.form = {...pooling.quality}
        } else {
          let data = JSON.parse(pooling.quality)
          console.log(data)
          this.form = {...data}
        }
      })
    },
    submit () {
      this.$http.put(`/experiments/${this.experiment_id}`, this.form).then(() => {
        this.$bus.$emit('poolings.updated')
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
