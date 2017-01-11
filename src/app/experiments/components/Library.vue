<template lang="html">
  <div id="main">
    <div class="row">
      <div class="col-md-6">
        <h1>
          文库制备&nbsp;&nbsp;
          <a href="#" class="btn btn-primary btn-sm" v-show="multipleSelection.length" @click="pushToNext"><i class="fa fa-mail-forward"></i>&nbsp;&nbsp;确认推送到下一流程</a>
        </h1>

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
        <thead>
          <tr>
            <th rowspan="3"></th>
            <th rowspan="3">样品编号</th>
            <th rowspan="3">目前状态</th>
            <th colspan="2">建库前</th>
            <th colspan="5">建库后</th>
            <th rowspan="3">操作</th>
          </tr>
          <tr>
            <th>体积</th>
            <th>浓度</th>
            <th>Index</th>
            <th>体积</th>
            <th>浓度</th>
            <th>电泳结果</th>
            <th>文库片断大小</th>
          </tr>
        </thead>
        <tbody class="text-center">
          <tr v-for="library in libraries">
            <td>
              <input type="checkbox" v-show="canPush(library)" :value="library.id" v-model="multipleSelection">
            </td>
            <td>{{ library.sample_id }}</td>
            <td><i class="fa fa-circle" :style="{color: statusColor(library)}"></i></td>
            <td>{{ library.quality.pre_v }}</td>
            <td>{{ library.quality.pre_c }}</td>
            <td>{{ library.quality.after_index }}</td>
            <td>{{ library.quality.after_v }}</td>
            <td>{{ library.quality.after_c }}</td>
            <td>{{ library.quality.after_e_map }}</td>
            <td>{{ library.quality.after_library_size }}</td>
            <td>
              <a href="#" class="btn btn-default btn-sm" @click="editDilution(library)"><i class="fa fa-edit"></i></a>
              <a href="#" class="btn btn-danger btn-sm" @click="askRemoveDilution(library)"><i class="fa fa-times"></i></a>
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
      multipleSelection: []
    }
  },
  mounted () {
    this.$bus.$on('navigate', obj => this.navigate(obj)),
    this.$bus.$on('libraries.created', () => this.fetchDilutions())
    this.$bus.$on('libraries.updated', () => this.fetchDilutions())
    this.fetchDilutions()
  },
  computed: {
    ...mapState({
      libraries: state => state.Experiments.libraries,
      libraries_pagination: state => state.Experiments.libraries_pagination
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.libraries_pagination
    },
    isFormVisible () {
      return this.$route.name === 'libraries.new' || this.$route.name === 'libraries.edit'
    }
  },
  watch: {
    currentPage: 'fetchDilutions',
    $route: 'fetchDilutions'
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('libraries.created')
    this.$bus.$off('libraries.updated')
    next()
  },
  methods: {
    ...mapActions(['librariesSetData', 'setFetching', 'setMessage']),
    fetchDilutions () {
      this.setFetching({
        fetching: true
      })
      this.$http.get(`experiments/libraries?page=${this.currentPage}`)
        .then(({
          data
        }) => {
          console.log(data)
          this.librariesSetData({
            libraries: data.data,
            libraries_pagination: data.meta.pagination
          })
          this.setFetching({
            fetching: false
          })
        })
    },
    canPush (library) {
      let status = library.status
      return status ? true : false
    },
    pushToNext () {
      swal({
        title: '确认吗？',
        text: '确认后该实验会流入下一步走',
        type: 'info',
        showCancelButton: 'true',
        closeOnConfirm: false,
        animation: 'slide-from-top'
      }, () => {
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.multipleSelection[i]
          let id = this.multipleSelection[i]
          this.$http.patch(`experiments/${id}`, {'next': true})
          .then(() => {
            this.fetchDilutions()
          })
          .catch((error) => {
            this.setMessage({ type: 'error', 'message': error})
          })
        }
        swal('成功', `批次${inputValue}已被成功提交`)
      })
    },
    statusColor (library) {
      let status = library.status
      return status ? (status === 1 ? '#3097D1': '#8eb4cb') : '#bf5329'
    },
    clickAddMore () {
      this.addMore = !this.addMore
    },
    create () {
      this.$router.push({
        name: 'libraries.new',
        query: {
          page: this.currentPage
        }
      })
    },
    hide () {
      this.$router.push({
        name: 'libraries.index',
        query: {
          page: this.currentPage
        }
      })
    },
    editDilution (library) {
      let library_id = library.id
      this.$router.push({
        name: 'libraries.edit',
        params: {
          library_id
        }
      })
    },
    askRemoveDilution (library) {
      swal({
        title: '确定吗？',
        text: `该步样品${library.id}将会被废弃`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.removeDilution(library))
    },
    removeDilution (library) {
      this.$http.patch(`experiments/${library.id}/cancel`)
        .then(() => {
          swal('完成', '该步样品废弃成功', 'success')
          this.fetchDilutions()
        })
    },
    navigate (obj) {
      this.$router.push({
        name: 'libraries.index',
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
