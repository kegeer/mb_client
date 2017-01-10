<template lang="html">
  <div>
    <form class="well">
      <div class="row">
        <div class="col-sm-4">
          <label for="volumn" class="control-label">体积</label>
          <input id="volumn" type="text" class="form-control" v-model="form.v">
        </div>
        <div class="col-sm-4">
          <label for="mass" class="control-label">质量</label>
          <input id="mass" type="text" class="form-control" v-model="form.m">
        </div>
        <div class="col-sm-4">
          <label for="left" class="control-label">剩余</label>
          <input id="left" type="text" class="form-control" v-model="form.left">
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
        m: 0,
        v: 0,
        left: 0
      }
    }
  },
  computed: {
    ...mapState({
      splits: state => state.Experiments.splits
    }),
    isEditing () {
      return this.form.id > 0
    },
    isValid () {
      return true
    },
    showCreateForm () {
      return this.$route.name === 'splits.new'
    },
    experiment_id () {
      return this.$route.params.split_id
    }
  },
  mounted () {
    this.fetch()
  },
  watch: {
    $route: 'fetch'
  },
  methods: {
    ...mapActions(['splitsSetData', 'setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      this.setFetching({ fetching: true })
      this.$http.get(`experiments/${this.experiment_id}`).then(({ data }) => {
        let split = data.data
        if (typeof (split.quality) === 'object') {
          this.form = {...split.quality}
        } else {
          let data = JSON.parse(split.quality)
          console.log(data)
          this.form = {...data}
        }
      })
    },
    submit () {
      this.$http.put(`/experiments/${this.experiment_id}`, this.form).then(() => {
        this.$bus.$emit('splits.updated')
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
