<template lang="html">
  <div>
    <form class="well">

      <div class="row">
        <div class="col-sm-2">
          <label for="library" class="control-label">文库编号</label>
          <input id="library" type="text" class="form-control" v-model="form.library">
        </div>
        <div class="col-sm-2">
          <label for="qubit" class="control-label">Qubit</label>
          <input id="qubit" type="text" class="form-control" v-model="form.qubit">
        </div>
        <div class="col-sm-2">
          <label for="index" class="control-label">Index 1</label>
          <input id="index" type="text" class="form-control" v-model="form.index">
        </div>
        <div class="col-sm-2">
          <label for="index" class="control-label">Index 2</label>
          <input id="index" type="text" class="form-control" v-model="form.index">
        </div>
        <div class="col-sm-2">
          <label for="f_size" class="control-label">片段大小</label>
          <input id="f_size" type="text" class="form-control" v-model="form.f_size">
        </div>
        <div class="col-sm-2">
          <label for="m_c" class="control-label">M浓度</label>
          <input id="m_c" type="text" class="form-control" v-model="form.m_c">
        </div>
      </div>

      <div class="row">
        <div class="col-sm-2">
          <label for="sample_v" class="control-label">取样体积</label>
          <input id="sample_v" type="text" class="form-control" v-model="form.sample_v">
        </div>
        <div class="col-sm-2">
          <label for="water" class="control-label">加水量</label>
          <input id="water" type="text" class="form-control" v-model="form.water">
        </div>
        <div class="col-sm-2">
          <label for="data" class="control-label">数据量</label>
          <input id="data" type="text" class="form-control" v-model="form.data">
        </div>
        <div class="col-sm-2">
          <label for="ratio" class="control-label">比例</label>
          <input id="ratio" type="text" class="form-control" v-model="form.ratio">
        </div>
        <div class="col-sm-2">
          <label for="mix_v" class="control-label">混样体积</label>
          <input id="mix_v" type="text" class="form-control" v-model="form.mix_v">
        </div>
        <div class="col-sm-2">
          <label for="note" class="control-label">备注</label>
          <input id="note" type="text" class="form-control" v-model="form.note">
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
        library: '',
        qubit: '',
        index: [],
        f_size: 0,
        m_c: 0,
        sample_v: 0,
        water: 0,
        data: 0,
        ratio: 0,
        mix_v: 0,
        note: 0
      }
    }
  },
  computed: {
    ...mapState({
      sequences: state => state.Experiments.sequences
    }),
    isEditing () {
      return this.form.id > 0
    },
    isValid () {
      return true
    },
    showCreateForm () {
      return this.$route.name === 'sequences.new'
    },
    experiment_id () {
      return this.$route.params.sequence_id
    }
  },
  mounted () {
    this.fetch()
  },
  watch: {
    $route: 'fetch'
  },
  methods: {
    ...mapActions(['sequencesSetData', 'setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      this.setFetching({ fetching: true })
      this.$http.get(`experiments/${this.experiment_id}`).then(({ data }) => {
        let sequence = data.data
        if (typeof (sequence.quality) === 'object') {
          this.form = {...sequence.quality}
        } else {
          let data = JSON.parse(sequence.quality)
          console.log(data)
          this.form = {...data}
        }
      })
    },
    submit () {
      this.$http.put(`/experiments/${this.experiment_id}`, this.form).then(() => {
        this.$bus.$emit('sequences.updated')
        this.setFetching({
          fetching: false
        })
        this.setMessage({ type: 'success', message: '分装信息更新成功' })
        this.reset()
      })
    },
    reset () {
      this.form.library = ''
      this.form.qubit = ''
      this.form.index = []
      this.form.f_size = 0
      this.form.m_c = 0
      this.form.sample_v = 0
      this.form.water = 0
      this.form.data = 0
      this.form.ratio = 0
      this.form.mix_v = 0
      this.form.note = 0
    }
  }
}
</script>

<style lang="css">
</style>
