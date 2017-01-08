<template lang="html">
  <div>
    <router-view></router-view>
        <h3>管理所有样品</h3>
        <a href="#" class="btn btn-primary" @click.prevent="add">添加样品</a>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sample in samples">
            <td>{{ sample.id }}</td>
          </tr>
        </tbody>
      </table>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      samples: state => state.Batches.samples,
      pagination: state => state.Batches.samples_pagination
    })
  },
  mounted () {
    this.fetch()
  },
  watch: {
    $route: 'fetch'
  },
  methods: {
    ...mapActions(['samplesSetData']),
    fetch () {
      this.$http.get(`batches/${this.$route.params.id}/samples`)
      .then(({ data }) => {
        this.samplesSetData({
          samples: data.data,
          pagination: data.meta.pagination
        })
      })
    },
    add () {
      this.$router.push({
        name: 'samples.new'
      })
    }
  }
}
</script>

<style lang="css">
</style>
