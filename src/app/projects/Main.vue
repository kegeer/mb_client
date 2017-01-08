<template lang="html">
  <div>
    <div id="list">
      <h3>所有批次</h3>
      <a href="#" class="btn btn-primary" @click.prevent="addNew()">
        <i class="fa fa-plus"></i>添加新批次
      </a>
      <span class="dropdown" :class="{ open: addMore }">
        <a href="#" class="btn btn-default" @click.prevent="clickAddMore()">
          <i class="fa fa-arrow-down"></i>其余功能
        </a>
        <ul class="dropdown-menu">
          <li><a href="#" @click.prevent="newRecipient"></a></li>
          <li><a href="#" @click.prevent="newLocation"></a></li>
        </ul>
      </span>

      <div class="table-content">
        <table class="table table-striped">
          <thead><tr><th>ID</th><th>客户编号</th><th>操作</th></tr></thead>
          <tbody><tr v-fo="b in batches">
            <td>{{ b.id }}</td>
            <td>{{ b.client_id }}</td>
            <td>
              <a href="#" class="btn btn-primary btn-sm" @click="samples(b)"><i class="fa fa-eye"></i></a>
              <a href="#" class="btn btn-default btn-sm" @click="editBatch(b)"><i class="fa fa-edit"></i></a>
              <a href="#" class="btn btn-danger btn-sm" @click="askRemoveBatch(b)"><i class="fa fa-delete"></i></a>
            </td>
          </tr></tbody>
        </table>
          <pagination :paginationData="pagination" :currentPage="currentPage" :maxItems="pagination.total"></pagination>
      </div>
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
                  <a href="#" class="btn btn-sm btn-default" class="editRecipoent(r)"><i class="fa fa-edit"></i></a>
                  <a href="#" class="btn btn-sm btn-warning" class="deleteRecipient(r)"><i class="fa fa-delete"></i></a>
                </td>
              </tr>
              <tr>
                <form @submit.prevent="addNewRecipient()">
                  <td><input type="text" v-model="recipient.name" class="form-control" placeholder="姓名"></td>
                  <td><button class="btn btn-primary" @click.prevent="addNewRecipient"></button></td>
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
                  <a href="#" class="btn btn-sm btn-default" class="editLocation(l)"><i class="fa fa-edit"></i></a>
                  <a href="#" class="btn btn-sm btn-warning" class="deleteLocation(l)"><i class="fa fa-delete"></i></a>
                </td>
              </tr>
              <tr>
                <form @submit.prevent="addNewLocation()">
                  <td><input type="text" v-model="location.name" class="form-control" placeholder="姓名"></td>
                  <td><button class="btn btn-primary" @click.prevent="addNewLocation"></button></td>
                </form>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
    fetchRecipients () {
      this.$http.get('recipients')
      .then(({ data }) => {
        this.recipientsSetData({
          recipients: data.data
        })
      }
    },
    fetchLocations () {
      this.$http.get('locations')
      .then(({ data }) => {
        this.locationsSetData({
          locations: data.data
        })
      }
    },
    clickAddMore () {
      this.addMore = !this.addMore
    },
    addNew () {
      this.$router.push({
        name: 'projects.new',
        query: {
          page: currentPage
        }
      })
    },
    samples (b) {
      let id = b.id
      this.$router.push({
        name: 'batch.samples.index',
        params: { id }
      })
    }
    editBatch (b) {
      let id = b.id
      this.$router.push({
        name: 'batches.edit',
        params: { id }
      })
    },
    askRemoveBatch (b) {
      swal({
        title: '确定吗？',
        text: `批次${b.id}将会被删除`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.deleteBatch(b))
    },
    deleteBatch (b) {
      this.$http.delete(`batches/${b.id}`)
      .then(() => {
        swal('完成', '批次删除成功'， ‘success’)
      })
    },
    newRecipient () {
      this.fetchRecipients()
      #('#recipientForm').modal('show')
    },
    newLocation () {
      this.fetchLocations()
      #('#locationForm').modal('show')
    },
    addNewRecipient () {

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
  }
}
</script>

<style lang="css">
</style>
