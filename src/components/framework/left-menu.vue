<template>
  <el-menu
      :default-active="activeName"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router>
      <el-menu-item index="/dbmanage">数据库管理</el-menu-item>
      <el-menu-item index="/formulations">公式管理</el-menu-item>
      <el-menu-item index="/computing">计算管理</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "left-menu",

  data() {
    return {
      activeName: '/dbmanage',
    }
  }
}
</script>

<style scoped lang="scss">
  .el-menu {
    height: 100%;
    border-right: none;

    .el-menu-item {
      padding: 0 0 !important;
    }
  }
</style>
