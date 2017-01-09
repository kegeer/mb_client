<template lang="html">
  <div>
    <form class="well">
      <table style="width:100%;">
        <thead>
          <tr>
            <th>谱元编号</th>
            <th>原始编号</th>
            <th>样品类型</th>
            <th>样品量</th>
            <th>样品状态/特征</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sample in form" class="table-form">
            <td>
              <input type="text" class="form-control" v-model="sample.ori_num">
            </td>
            <td>
              <input type="text" class="form-control" v-model="sample.py_num">
            </td>
            <td width="70">
              <input type="checkbox" v-model="sample.sample_amount_type"><p>是否固体</p>
            </td>
            <td>
              <input type="text" class="form-control" v-model="sample.sample_amount">
            </td>
            <td>
              <input type="text" class="form-control" v-model="sample.sample_status">
            </td>
            <td v-show="showCreateForm">
              <a href="#" class="btn btn-danger" @click="removeLine(sample)"><i class="fa fa-times"></i></a>
            </td>
          </tr>
          <tr>
            <td colspan="4" v-show="showCreateForm">
              <a href="#" class="btn btn-info" @click="addLine()"><i class="fa fa-plus"></i></a>
            </td>
            <td>
              <a href="#" class="btn btn-primary full-width" @click="submit">保存</a>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      form: [
        {
          batch_id: this.$route.params.id,
          id: 0,
          ori_num: '',
          py_num: '',
          sample_amount_type: 0,
          sample_amount: 0,
          sample_status: ''
        }
      ]
    }
  },
  computed: {
    isEditing () {
      return this.form[0].id > 0
    },
    isValid () {
      return true
    },
    showCreateForm () {
      return this.$route.name === 'batch.samples.new'
    }
  },
  mounted () {
    this.fetch()
  },
  watch: {
    $route: 'fetch'
  },
  methods: {
    ...mapActions(['setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      const id = this.$route.params.sample_id
      if (id !== undefined) {
        this.setFetching({ fetching: true })
        this.$http.get(`samples/${id}`).then(({ data }) => {

          this.form[0] = {...data.data}
          console.log(this.form)
        })
      }
    },
    addLine () {
      this.form.push({
        batch_id: this.$route.params.id,
        id: 0,
        ori_num: '',
        py_num: '',
        sample_amount_type: 0,
        sample_amount: 0,
        sample_status: ''
      })
    },
    removeLine (sample) {
      let index = this.form.indexOf(sample)
      this.form.splice(index, 1)
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
      this.$http.put(`samples/${this.form[0].id}`, this.form[0]).then(() => {
        this.$bus.$emit('samples.updated')
        this.setFetching({
          fetching: false
        })
        this.setMessage({ type: 'success', message: '样品更新成功' })
        this.reset()
      })
    },
    save () {
      this.$http.post('samples', this.form).then(() => {
        this.$bus.$emit('samples.created')
        this.setFetching({
          fetching: false
        })
        this.setMessage({ type: 'success', message: '样品添加成功' })
        this.reset()
      })
    },
    reset () {
      this.form = [
        {
          batch_id: this.$route.params.id,
          id: 0,
          ori_num: '',
          py_num: '',
          sample_amount_type: 0,
          sample_amount: 0,
          sample_status: ''
        }
      ]
    }
  }
}
</script>

<style lang="css">
</style>
