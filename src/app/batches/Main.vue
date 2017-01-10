<template lang="html">
  <div>
    <div id="list">
      <h3>所有批次</h3>
      <a href="#" class="btn btn-primary" @click.prevent="addNew()">
        <i class="fa fa-plus"></i>添加新批次
      </a>
      <span class="dropdown" :class="{ open: addMore }">
        <a href="#" class="btn btn-default dropdown-toggle" @click.prevent="clickAddMore()">
          其余功能<i class="fa fa-angle-down"></i>
        </a>
        <ul class="dropdown-menu">
          <li><a href="#" @click.prevent="newClient">添加新客户</a></li>
          <li><a href="#" @click.prevent="newRecipient">添加新收样人</a></li>
          <li><a href="#" @click.prevent="newLocation">添加新存储位置</a></li>
        </ul>
      </span>

      <div class="table-content">
        <table class="table table-striped">
          <thead><tr><th>ID</th><th>客户编号</th><th>操作</th></tr></thead>
          <tbody><tr v-for="batch in batches">
            <td>{{ batch.id }}</td>
            <td>{{ batch.client_id }}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-primary" @click.prevent="samples(batch)"><i class="fa fa-eye"></i></button>
                <button class="btn btn-default" @click.prevent="editBatch(batch)"><i class="fa fa-edit"></i></button>
                <button class="btn btn-danger" @click.prevent="askRemoveBatch(batch)"><i class="fa fa-times"></i></button>
              </div>

            </td>
          </tr></tbody>
        </table>
      </div>
      <pagination :paginationData="pagination" :currentPage="currentPage" :maxItems="pagination.total"></pagination>
    </div>
    <!-- 样品接收人管理 -->
    <div class="modal fade" id="recipientForm" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-md">
        <div class="modal-content">
          <table class="table">
            <thead>
              <tr><th>姓名</th><th>操作</th></tr>
            </thead>
            <tbody>
              <tr v-for="r in recipients">
                <td>{{ r.name }}</td>
                <td>
                  <a href="#" class="btn btn-sm btn-default" @click="editRecipient(r)"><i class="fa fa-edit"></i></a>
                  <a href="#" class="btn btn-sm btn-warning" @click="deleteRecipient(r)"><i class="fa fa-times"></i></a>
                </td>
              </tr>
              <tr>
                <form @submit.prevent="addNewRecipient()">
                  <td><input type="text" v-model="recipient.name" class="form-control" placeholder="姓名"></td>
                  <td><button class="btn btn-primary" @click.prevent="addNewRecipient">添加</button></td>
                </form>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 客户管理 -->
    <div class="modal fade" id="clientForm" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-md">
        <div class="modal-content">
          <table class="table">
            <thead>
              <tr><th>姓名</th><th>操作</th></tr>
            </thead>
            <tbody>
              <tr v-for="client in clients">
                <td>{{ client.name }}</td>
                <td>
                  <a href="#" class="btn btn-sm btn-default" @click="editClient(client)"><i class="fa fa-edit"></i></a>
                  <a href="#" class="btn btn-sm btn-warning" @click="deleteClient(client)"><i class="fa fa-times"></i></a>
                </td>
              </tr>
              <tr>
                <form @submit.prevent="addNewClient()">
                  <td><input type="text" v-model="client.name" class="form-control" placeholder="姓名"></td>
                  <td><button class="btn btn-primary" @click.prevent="addNewClient">添加</button></td>
                </form>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 样品存储位置管理 -->
    <div class="modal fade" id="locationForm" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-md">
        <div class="modal-content">
          <table class="table">
            <thead>
              <tr><th>姓名</th><th>操作</th></tr>
            </thead>
            <tbody>
              <tr v-for="l in locations">
                <td>{{ l.name }}</td>
                <td>
                  <a href="#" class="btn btn-sm btn-default" @click="editLocation(l)"><i class="fa fa-edit"></i></a>
                  <a href="#" class="btn btn-sm btn-warning" @click="deleteLocation(l)"><i class="fa fa-times"></i></a>
                </td>
              </tr>
              <tr>
                <form @submit.prevent="addNewLocation()">
                  <td><input type="text" v-model="location.name" class="form-control" placeholder="姓名"></td>
                  <td><button class="btn btn-primary" @click.prevent="addNewLocation">添加</button></td>
                </form>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- main container form router-view -->
    <div id="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      recipient: { name: '' },
      location: { name: '' },
      addMore: false
    }
  },
  mounted () {
    this.$bus.$on('navigate', obj => this.navigate(obj)),
    this.$bus.$on('batches.created', () => this.fetchBatches)
    this.$bus.$on('batches.update', () => this.fetchBatches)
    this.$bus.$on('haha', obj => console.log(obj))
    this.fetchBatches()
  },
  computed: {
    ...mapState({
      batches: state => state.Batches.batches,
      batches_pagination: state => state.Batches.batches_pagination,
      recipients: state => state.Batches.recipients,
      locations: state => state.Batches.locations
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.batches_pagination
    }
  },
  watch: {
    currentPage: 'fetchBatches',
    $route: 'fetchBatches'
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('batches.created')
    this.$bus.$off('batches.updated')
    next()
  },
  methods: {
    ...mapActions(['batchesSetData', 'recipientsSetData', 'locationsSetData']),
    fetchBatches () {
      this.$http.get(`batches?page=${this.currentPage}`)
      .then(({ data }) => {
        this.batchesSetData({
          batches: data.data,
          batches_pagination: data.meta.pagination
        })
      })
    },
    clickAddMore () {
      this.addMore = !this.addMore
    },
    addNew () {
      this.$router.push({
        name: 'batches.new',
        query: {
          page: this.currentPage
        }
      })
    },
    samples (batch) {
      let id = batch.id
      this.$router.push({
        name: 'batch.samples.index',
        params: { id }
      })
    },
    editBatch (batch) {
      let id = batch.id
      this.$router.push({
        name: 'batches.edit',
        params: { id }
      })
    },
    askRemoveBatch (batch) {
      swal({
        title: '确定吗？',
        text: `批次${batch.id}将会被删除`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.deleteBatch(batch))
    },
    deleteBatch (batch) {
      this.$http.delete(`batches/${batch.id}`)
      .then(() => {
        swal('完成', '批次删除成功', 'success')
        this.fetchBatches()
      })
    },
    newClient () {
      this.fetchClients()
      this.clickAddMore()
      $('#clientForm').modal('show')
    },
    newRecipient () {
      this.fetchRecipients()
      this.clickAddMore()
      $('#recipientForm').modal('show')
    },
    newLocation () {
      this.fetchLocations()
      this.clickAddMore()
      $('#locationForm').modal('show')
    },
    addNewRecipient () {
      this.$http.post('recipients', this.recipients)
      .then(() => {
        this.fetchRecipients
      })
    },
    fetchClients () {
      this.$http.get('clients')
      .then(({ data }) => {
        this.clientsSetData ({
          clients: data.data
        })
      })
    },
    fetchRecipients () {
      this.$http.get('recipients')
      .then(({ data }) => {
        this.recipientsSetData({
          recipients: data.data
        })
      })
    },
    fetchLocations () {
      this.$http.get('locations')
      .then(({ data }) => {
        this.locationsSetData({
          locations: data.data
        })
      })
    },
    editRecipient (r) {

    },
    deleteRecipient (r) {

    },
    addNewLocation () {

    },
    editLocation (l) {

    },
    deleteLocation (l) {

    },
    navigate (obj) {
      this.$router.push({ name: 'batches.index', query:{ page: obj.page }})
    }
  }
}
</script>

<style lang="css">
</style>
