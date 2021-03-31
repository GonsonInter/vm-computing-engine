<template>
  <div class="main-page">
    <div class="operate-bar shadow-box">

      <p class="search-label">查询数据库</p>
      <el-input class="search-input" style=""></el-input>

      <p class="search-label">查询任务名</p>
      <el-input class="search-input" style=""></el-input>

      <el-button class="search-button" type="warning" icon="el-icon-search" round>查询</el-button>

      <el-button class="add-button" type="primary" icon="el-icon-plus">添加任务</el-button>

    </div>

    <div class="column-menu">

      <div class="shadow-box tree-pane">
        <!--        <el-button>添加分组</el-button>-->

        <div style="width: 100%; padding: 5px; box-sizing: border-box">
          <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText" suffix-icon="el-icon-search">
          </el-input>
        </div>


        <el-tree
            :data="treeData"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                    v-if="node.level <= 2"
                    type="text"
                    size="mini" style="font-size: 14px"
                    @click="() => remove(node, data)">
                  ×
                </el-button>
          </span>
         </span>
        </el-tree>

      </div>

      <div class="table-pane shadow-box" style="flex: 1">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="编号" type="index" width="180" :resizable="false"></el-table-column>
          <el-table-column prop="数据库名称" label="数据库名称" width="180" :resizable="false"></el-table-column>
          <el-table-column prop="address" label="任务名称" :resizable="false"></el-table-column>
          <el-table-column prop="address" label="开始时间" :resizable="false"></el-table-column>
          <el-table-column prop="address" label="结束时间" :resizable="false"></el-table-column>
          <el-table-column prop="address" label="说明" :resizable="false"></el-table-column>
          <el-table-column prop="address" label="运行状态" :resizable="false"></el-table-column>
          <el-table-column prop="address" label="操作" width="500" :resizable="false">
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-monitor">查看详情</el-button>
              <el-button size="mini" type="info" icon="el-icon-edit">修改</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting">公式管理</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              <el-button size="mini" type="primary" icon="el-icon-tickets">查看日志</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Computings",
  data() {
    return {
      tableData: [{},{},{}]
    }
  }
}
</script>

<style scoped>

</style>
