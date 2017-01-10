<template lang="html">
  <div id="main">
    <div class="row">
      <div class="col-md-6">
        <h1>
          上机测序&nbsp;&nbsp;
          <a href="#" class="btn btn-primary btn-sm" v-show="multipleSelection.length" @click="pushToNext"><i class="fa fa-mail-forward"></i>&nbsp;&nbsp;确认完成所有实验</a>
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
            <th colspan="3">上机状态</th>
            <th rowspan="2">操作</th>
          </tr>
          <tr>
            <th>原浓度</th>
            <th>取样体积</th>
            <th>加水量</th>
            <th>终浓度</th>
          </tr>
        </thead>
        <tbody class="text-center">
          <tr v-for="sequence in sequences">
            <td>
              <input type="checkbox" v-show="canPush(sequence)" :value="sequence.id" v-model="multipleSelection">
            </td>
            <td>{{ sequence.sample_id }}</td>
            <td><i class="fa fa-circle" :style="{color: statusColor(sequence)}"></i></td>
            <td>{{ sequence.quality.ori_c }}</td>
            <td>{{ sequence.quality.sample_v }}</td>
            <td>{{ sequence.quality.water }}</td>
            <td>{{ sequence.quality.last_c }}</td>
            <td>
              <a href="#" class="btn btn-default btn-sm" @click="editSequence(sequence)"><i class="fa fa-edit"></i></a>
              <a href="#" class="btn btn-danger btn-sm" @click="askRemoveSequence(sequence)"><i class="fa fa-times"></i></a>
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
    this.$bus.$on('sequences.created', this.fetchSequences())
    this.$bus.$on('sequences.updated', this.fetchSequences())
    this.fetchSequences()
  },
  computed: {
    ...mapState({
      sequences: state => state.Experiments.sequences,
      sequences_pagination: state => state.Experiments.sequences_pagination
    }),
    currentPage () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pagination () {
      return this.sequences_pagination
    },
    isFormVisible () {
      return this.$route.name === 'sequences.new' || this.$route.name === 'sequences.edit'
    }
  },
  watch: {
    currentPage: 'fetchSequences',
    $route: 'fetchSequences'
  },
  beforeRouterLeave (to, from, next) {
    this.$bus.$off('sequences.created')
    this.$bus.$off('sequences.updated')
    next()
  },
  methods: {
    ...mapActions(['sequencesSetData', 'setFetching', 'setMessage']),
    fetchSequences () {
      this.setFetching({
        fetching: true
      })
      this.$http.get(`experiments/sequences?page=${this.currentPage}`)
        .then(({
          data
        }) => {
          console.log(data)
          this.sequencesSetData({
            sequences: data.data,
            sequences_pagination: data.meta.pagination
          })
          this.setFetching({
            fetching: false
          })
        })
    },
    canPush (sequence) {
      let status = sequence.status
      return status ? true : false
    },
    pushToNext () {
      swal({
        title: '确认吗？',
        text: '实验是否确认完成',
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
            this.fetchSequences()
          })
          .catch((error) => {
            this.setMessage({ type: 'error', 'message': error})
          })
        }
        swal('成功', `批次${inputValue}已被成功提交`)
      })
    },
    statusColor (sequence) {
      let status = sequence.status
      return status ? (status === 1 ? '#3097D1': '#8eb4cb') : '#bf5329'
    },
    clickAddMore () {
      this.addMore = !this.addMore
    },
    create () {
      this.$router.push({
        name: 'sequences.new',
        query: {
          page: this.currentPage
        }
      })
    },
    hide () {
      this.$router.push({
        name: 'sequences.index',
        query: {
          page: this.currentPage
        }
      })
    },
    editSequence (sequence) {
      let sequence_id = sequence.id
      this.$router.push({
        name: 'sequences.edit',
        params: {
          sequence_id
        }
      })
    },
    askRemoveSequence (sequence) {
      swal({
        title: '确定吗？',
        text: `该步样品${sequence.id}将会被废弃`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        confirmButtonText: '确定',
        closeOnConfirm: false
      }, () => this.removeSequence(sequence))
    },
    removeSequence (sequence) {
      this.$http.patch(`experiments/${sequence.id}/cancel`)
        .then(() => {
          swal('完成', '该步样品废弃成功', 'success')
          this.fetchSequences()
        })
    },
    navigate (obj) {
      this.$router.push({
        name: 'sequences.index',
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
