<template lang="html">
  <div>
    <div id="list">
      <ul class="list-group experiments">
        <router-link :to="{ name: 'splits.index' }" tag="li" class="list-group-item"><i class="fa fa-balance-scale"></i>样品分装<i class="fa fa-angle-right pull-right"></i></router-link>
        <router-link :to="{ name: 'extractions.index' }" tag="li" class="list-group-item"><i class="fa fa-eyedropper"></i>核酸提取<i class="fa fa-angle-right pull-right"></i></router-link>
        <router-link :to="{ name: 'dilutions.index' }" tag="li" class="list-group-item"><i class="fa fa-cubes"></i>模板稀释<i class="fa fa-angle-right pull-right"></i></router-link>
        <router-link :to="{ name: 'distributions.index' }" tag="li" class="list-group-item"><i class="fa fa-braille"></i>样品分布<i class="fa fa-angle-right pull-right"></i></router-link>
        <router-link :to="{ name: 'analysises.index' }" tag="li" class="list-group-item"><i class="fa fa-bar-chart"></i>产物分析<i class="fa fa-angle-right pull-right"></i></router-link>
        <router-link :to="{ name: 'poolings.index' }" tag="li" class="list-group-item"><i class="fa fa-tachometer"></i>产物Pooling<i class="fa fa-angle-right pull-right"></i></router-link>
        <router-link :to="{ name: 'libraries.index' }" tag="li" class="list-group-item"><i class="fa fa-tags"></i>文库构建<i class="fa fa-angle-right pull-right"></i></router-link>
        <router-link :to="{ name: 'sequences.index' }" tag="li" class="list-group-item"><i class="fa fa-qrcode"></i>上机测序<i class="fa fa-angle-right pull-right"></i></router-link>
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
  .experiments li {
    width: 80%;
  }
  .experiments li i {
    font-size: 1.2em;
    padding: 10px 15px;
  }
</style>
