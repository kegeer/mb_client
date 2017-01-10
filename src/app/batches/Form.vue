<template lang="html">
  <div>
    <div class="row">
      <div class="col-md-6">
        <h1>{{ formTitle }}</h1>
      </div>
    </div>

    <div class="divider"></div>
    <form>
      <div class="row">
        <div class="col-sm-10 col-sm-offset-1">
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label for="client_id" class="control-label">客户方</label>
                <select class="form-control" id="client_id" v-model="form.client_id">
                  <option label="其他" value="0"></option>
                  <option label="乐土" value="1"></option>
                </select>
              </div>
            </div>
            <div class="col-sm-6">
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
            </div>
          </div>

          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <label for="sender" class="control-label">寄送人</label>
                <input type="text" id="sender" class="form-control" v-model="form.sender">
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <label for="sender_contact" class="control-label">寄送人联系方式</label>
                <input type="text" id="sender_contact" class="form-control" v-model="form.sender_contact">
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <label for="sender_time" class="control-label">寄送时间</label>
                <input type="date" id="sender_time" class="form-control" v-model="form.sender_time">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label for="arrive_status" class="control-label">到样状态</label>
                <select class="form-control" id="arrive_status" v-model="form.arrive_status">
                  <option label="其他" value="0"></option>
                  <option label="干冰冻存" value="1"></option>
                  <option label="冰袋冻存" value="2"></option>
                  <option label="室温" value="3"></option>
                  <option label="异常" value="4"></option>
                </select>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="store_location" class="control-label">贮存位置</label>
                <select class="form-control" id="store_location" v-model="form.store_location">
                  <option label="其他" value="0"></option>
                  <option label="一号冰箱" value="1"></option>
                </select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <label for="recipient" class="control-label">接样人</label>
                <select class="form-control" id="recipient" v-model="form.recipient">
                  <option label="其他" value="0"></option>
                  <option label="黄光灿" value="1"></option>
                </select>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <label for="arrive_time" class="control-label">到样时间</label>
                <input type="date" id="arrive_time" class="form-control" v-model="form.arrive_time">
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <label for="express_num" class="control-label">快递单号</label>
                <input type="text" id="express_num" class="form-control" v-model="form.express_num">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <div class="form-group">
                <label for="note" class="control-label">意外情况</label>
                <textarea id="note" class="form-control" v-model="form.note"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-4 col-sm-offset-4">
          <!-- <button type="button" class="btn btn-primary full-width"  @click.native.prevent="submit">提交</button> -->
          <a href="#" class="btn btn-default full-width" @click.prevent="submit">提交</a>
          <a href="#" @click="eventOn">Ceshi</a>
        </div>
      </div>
    </form>
  </div>

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
        recipient: 0,
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
    },
    formTitle () {
      return this.form.id > 0 ? '修改批次信息': '新增批次'
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
    eventOn () {
      this.$bus.$emit('haha', { hha: 0})
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
      this.$http.post('batches', pick(this.form, ['client_id', 'sample_type', 'sender', 'sender_contact', 'send_time', 'arrive_status', 'store_location', 'arrive_time', 'recipient', 'express_num', 'note'])).then(() => {
        // this.$bus.$emit('haha', { hha: 0})
        this.$bus.$emit('batches.created')
        // this.$bus.$emit('batches.created')
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
        this.reset()
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
      this.recipient = 0
      this.express_num = ''
      this.note = ''
      this.$router.push({
        name: 'batches.index'
      })
    }
  }
}
</script>

<style lang="css">
</style>
