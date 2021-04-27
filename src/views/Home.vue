<template>
  <el-container class="home-container">
    <el-header>
      <h1>
        时序数据库二次计算引擎
      </h1>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <leftmenu></leftmenu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>

import leftmenu from '@/components/framework/left-menu';

export default {
  name: 'Home',
  components: { leftmenu }
}
</script>

<style scoped lang="scss">

@import "src/assets/css/base";

</style>
