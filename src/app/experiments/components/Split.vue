<template lang="html">
  <div id="main">
    <div class="row">
      <div class="col-md-6">
        <h1>
          样品分装&nbsp;&nbsp;
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
            <th rowspan="2"></th>
            <th rowspan="2">样品编号</th>
            <th rowspan="2">目前状态</th>
            <th colspan="3">记录</th>
            <th rowspan="2">操作</th>
          </tr>
          <tr>
            <th>质量</th>
            <th>体积</th>
            <th>剩余</th>
          </tr>
        </thead>
        <tbody class="text-center">
          <tr v-for="split in splits">
            <td>
              <input type="checkbox" v-show="canPush(split)" :value="split.id" v-model="multipleSelection">
            </td>
            <td>{{ split.sample_id }}</td>
            <td><i class="fa fa-circle" :style="{color: statusColor(split)}"></i></td>
            <td>{{ split.quality.v }}</td>
            <td>{{ split.quality.m }}</td>
            <td>{{ split.quality.left }}</td>
            <td>
              <a href="#" class="btn btn-default btn-sm" @click="editSplit(split)"><i class="fa fa-edit"></i></a>
              <a href="#" class="btn btn-danger btn-sm" @click="askRemoveSplit(split)"><i class="fa fa-times"></i></a>
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
    this.$bus.$on('splits.created', this.fetchSplits())
    this.$bus.$on('splits.updated', this.fetchSplits())
    this.fetchSplits()
  },
  computed: {
    ...mapState({
      splits: state => state.Experiments.splits,
      splits_pagination: state => state.Experiments.splits_pagination
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.splits_pagination
    },
    isFormVisible () {
      return this.$route.name === 'splits.new' || this.$route.name === 'splits.edit'
    }
  },
  watch: {
    currentPage: 'fetchSplits',
    $route: 'fetchSplits'
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('splits.created')
    this.$bus.$off('splits.updated')
    next()
  },
  methods: {
    ...mapActions(['splitsSetData', 'setFetching', 'setMessage']),
    fetchSplits () {
      this.setFetching({
        fetching: true
      })
      this.$http.get(`experiments/splits?page=${this.currentPage}`)
        .then(({
          data
        }) => {
          console.log(data)
          this.splitsSetData({
            splits: data.data,
            splits_pagination: data.meta.pagination
          })
          this.setFetching({
            fetching: false
          })
        })
    },
    canPush (split) {
      let status = split.status
      return status ? true : false
    },
    pushToNext () {
      swal({
        title: '请输入',
        text: '请填写本实验的批次号',
        type: 'input',
        showCancelButton: 'true',
        closeOnConfirm: false,
        animation: 'slide-from-top',
        inputPlaceHolder: '比如：PC1'
      }, (inputValue) => {
        console.log(inputValue)
        if (inputValue === false) {
          return false
        }
        if (inputValue === '') {
          swal.showInputError('必须填写才能够提交本实验')
          return false
        }
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.multipleSelection[i]
          let id = this.multipleSelection[i]
          this.$http.patch(`experiments/${id}`, {'next': true, 'batch_num': inputValue})
          .then(() => {
            this.fetchSplits()
          })
          .catch((error) => {
            this.setMessage({ type: 'error', 'message': error})
          })
        }
        swal('成功', `批次${inputValue}已被成功提交`)
      })
    },
    statusColor (split) {
      let status = split.status
      return status ? (status === 1 ? '#3097D1': '#8eb4cb') : '#bf5329'
    },
    clickAddMore () {
      this.addMore = !this.addMore
    },
    create () {
      this.$router.push({
        name: 'splits.new',
        query: {
          page: this.currentPage
        }
      })
    },
    hide () {
      this.$router.push({
        name: 'splits.index',
        query: {
          page: this.currentPage
        }
      })
    },
    editSplit (split) {
      let split_id = split.id
      this.$router.push({
        name: 'splits.edit',
        params: {
          split_id
        }
      })
    },
    askRemoveSplit (split) {
      swal({
        title: '确定吗？',
        text: `该步样品${split.id}将会被废弃`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.removeSplit(split))
    },
    removeSplit (split) {
      this.$http.patch(`experiments/${split.id}/cancel`)
        .then(() => {
          swal('完成', '该步样品废弃成功', 'success')
          this.fetchSplits()
        })
    },
    navigate (obj) {
      this.$router.push({
        name: 'splits.index',
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
