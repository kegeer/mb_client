<template lang="html">
  <form @submit.prevent="submit" class="well">
    <div class="form-group">
      <label for="client_id" class="control-label">客户方</label>
      <select class="form-control" id="client_id" v-model="form.client_id">
        <option>1</option>
        <option value="0">其他</option>
        <option value="1">haha</option>
        <option value="2">hahasdfa</option>
      </select>
    </div>
    <div class="form-group">
      <label for="sample_type" class="control-label">样品类型</label>
      <select class="form-control" id="sample_type" v-model="form.sample_type">
        <option label="其他" value="0"></option>
        <option label="粪便" value="1"></option>
        <option label="脑脊液" value="2"></option>
        <option label="DNA" value="3"></option>
        <option label="土壤" value="4"></option>
        <option label="发酵品" value="5"></option>
      </select>
    </div>
    <div class="form-group">
      <label for="client_id" class="control-label">Client</label>
      <select class="form-control" id="client_id" v-model="form.client_id">
        <option>1</option>
      </select>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
import { pick } from 'lodash'
export default {
  name: 'BatchesForm',
  data () {
    return {
      form: {
        id: 0,
        client_id: 0,
        sample_type: 0,
        sender: '',
        sender_contact: '',
        send_time: '',
        arrive_status: 0,
        store_location: 0,
        arrive_time: '',
        recipients: 0,
        express_num: '',
        note: ''
      }
    }
  },
  watch: {
    $route: 'fetch'
  },
  mounted () {
    this.fetch()
  },
  computed: {
    isEditing () {
      return this.form.id > 0
    },
    isValid () {
      return true
    }
  },
  methods: {
    ...mapActions(['setFetching', 'resetMessages', 'setMessage']),
    fetch () {
      const id = this.$route.params.id
      if (id !== undefined) {
        this.setFetching({ fetching: true })
        this.$http.get(`batches/${id}`)
        .then(({ data }) => {
          let  batch = data.data
          this.form = {...batch}
          this.setFetching({ fetching: false })
        })
      }
    },
    submit () {
      if (this.isValid) {
        this.setFetching({ fetching: true })
        if (this.isEditing) {
          this.update()
        } else {
          this.save()
        }
      }
    },
    save () {
      this.$http.post('batches', pick(this.form, ['client_id', 'sample_type', 'sender', 'sender_contact', 'send_time', 'arrive_status', 'store_location', 'arrive_time', 'recipients', 'express_num', 'note']))
      .then(() => {
        this.$bus.$emit('batches.created')
        this.setFetching({ fetching: false })
        this.setMessage({ type: 'success', message: '新批次录入成功'})
        this.reset()
      })
    },
    update () {
      this.$http.put(`batches/${this.form.id}`, this.form)
      .then(() => {
        this.$bus.$emit('batches.updated')
        this.setMessage({ type:'success', message: '批次信息更新成功' })
      })
    },
    reset () {
      this.client_id = 0
      this.sample_type = 0
      this.sender = ''
      this.sender_contact = ''
      this.send_time = ''
      this.arrive_status = 0
      this.store_location = 0
      this.arrive_time = ''
      this.recipients = 0
      this.express_num = ''
      this.note = ''
    }
  }
}
</script>

<style lang="css">
</style>
