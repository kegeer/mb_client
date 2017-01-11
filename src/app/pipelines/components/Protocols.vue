<template lang="html">
  <div id="main">
    <div class="row">
      <div class="col-md-6">
        <h1>实验方法管理</h1>
      </div>
      <div class="col-md-6 text-right">
        <div class="button-within-header">
          <a href="#" class="btn btn-default btn-sm" v-show="!isFormVisible" @click="create"><i class="fa fa-plus"></i></a>
          <a href="#" class="btn btn-default btn-sm" v-show="isFormVisible" @click="hide"><i class="fa fa-minus"></i></a>
        </div>
      </div>
    </div>
    <div class="divider"></div>

    <transition name="fade">
      <router-view></router-view>
    </transition>

    <div class="table-content">
      <table class="table table-striped">
        <thead><tr><th>所属流程</th><th>名称</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="protocol in protocols">
          <td>{{ protocol.procedure }}</td>
          <td>{{ protocol.name }}</td>
          <td>
            <a href="#" class="btn btn-default btn-sm" @click="editProtocol(protocol)"><i class="fa fa-edit"></i></a>
            <a href="#" class="btn btn-danger btn-sm" @click="askRemoveProtocol(protocol)"><i class="fa fa-times"></i></a>
          </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pagination :paginationData="pagination" :currentPage="currentPage" :maxItems="pagination.total"></pagination>
  </div>
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'
export default {
  data () {
    return {
      addMore: false
    }
  },
  mounted () {
    this.$bus.$on('navigate', obj => this.navigate(obj)),
    this.$bus.$on('protocols.created', () => this.fetchProtocols())
    this.$bus.$on('protocols.updated', () => this.fetchProtocols())
    this.fetchProtocols()
  },
  computed: {
    ...mapState({
      protocols: state => state.Pipelines.protocols,
      protocols_pagination: state => state.Pipelines.protocols_pagination
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.protocols_pagination
    },
    isFormVisible () {
      return this.$route.name === 'protocols.new' || this.$route.name === 'protocols.edit'
    }
  },
  watch: {
    currentPage: 'fetchProtocols',
    $route: 'fetchProtocols'
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('protocols.created')
    this.$bus.$off('protocols.updated')
    next()
  },
  methods: {
    ...mapActions(['protocolsSetData', 'setFetching', 'setMessage']),
    fetchProtocols () {
      this.setFetching({
        fetching: true
      })
      this.$http.get(`protocols?page=${this.currentPage}`)
        .then(({
          data
        }) => {
          this.protocolsSetData({
            protocols: data.data,
            protocols_pagination: data.meta.pagination
          })
          this.setFetching({
            fetching: false
          })
        })
    },
    clickAddMore () {
      this.addMore = !this.addMore
    },
    create () {
      this.$router.push({
        name: 'protocols.new',
        query: {
          page: this.currentPage
        }
      })
    },
    hide () {
      this.$router.push({
        name: 'protocols.index',
        query: {
          page: this.currentPage
        }
      })
    },
    editProtocol (protocol) {
      let protocol_id = protocol.id
      this.$router.push({
        name: 'protocols.edit',
        params: {
          protocol_id
        }
      })
    },
    askRemoveProtocol (protocol) {
      swal({
        title: '确定吗？',
        text: `实验方法${protocol.name}将会被删除`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.deleteProtocol(protocol))
    },
    deleteProtocol (protocol) {
      this.$http.delete(`protocols/${protocol.id}`)
        .then(() => {
          swal('完成', '实验方法删除成功', 'success')
          this.fetchProtocols()
        })
    },
    navigate (obj) {
      this.$router.push({
        name: 'protocols.index',
        query: {
          page: obj.page
        }
      })
    }
  }

}
</script>

<style lang="css">
</style>
