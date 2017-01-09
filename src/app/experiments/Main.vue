<template lang="html">
  <div>
    <div id="list">
      <ul class="list-group">
        <router-link :to="{ name: 'splits.index' }" tag="li" class="list-group-item"><i class="fa fa-user"></i>样品分装</router-link>
        <router-link :to="{ name: 'extractions.index' }" tag="li" class="list-group-item">核酸提取</router-link>
        <router-link :to="{ name: 'dilutions.index' }" tag="li" class="list-group-item">模板稀释</router-link>
        <router-link :to="{ name: 'distributions.index' }" tag="li" class="list-group-item">样品分布</router-link>
        <router-link :to="{ name: 'analysises.index' }" tag="li" class="list-group-item">产物分析</router-link>
        <router-link :to="{ name: 'poolings.index' }" tag="li" class="list-group-item">产物Pooling</router-link>
        <router-link :to="{ name: 'libraries.index' }" tag="li" class="list-group-item">文库构建</router-link>
        <router-link :to="{ name: 'sequences.index' }" tag="li" class="list-group-item">上机测序</router-link>
      </ul>
    </div>
    <div id="main">
      <router-view></router-view>
    </div>
  </div>

</template>

<script>
export default {
}
</script>

<style lang="css">
  li.list-group-item {
    cursor: pointer;
  }
</style>
