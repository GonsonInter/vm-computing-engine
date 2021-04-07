<template>
  <div>
    <div>
      <span class="info-label">数据库名称：</span>
      <span class="info-value">{{ information.dbName }}</span>
      <span style="margin-left: 50px" class="info-label">任务名称：</span>
      <span class="info-value">{{ information.taskName }}</span>
    </div>
    <div>
      <span class="info-label">开始时间：</span>
      <span class="info-value">{{ information.startTime }}</span>
      <span style="margin-left: 50px" class="info-label">结束时间：</span>
      <span class="info-value">{{ information.deadline }}</span>
    </div>

    <span class="info-label">公式列表</span>
    <el-table :data="information.eqInfoList" border>
      <el-table-column label="编号" type="index" width="60" :resizable="false"></el-table-column>
      <el-table-column prop="eqName" label="公式名称" width="180" :resizable="false"></el-table-column>
      <el-table-column prop="eqContent" label="公式内容" :resizable="false"></el-table-column>
      <el-table-column prop="description" label="描述" :resizable="false"></el-table-column>
      <el-table-column label="操作" :resizable="false" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="detailVisible = true;
              selectedDetail = scope.row">查看</el-button>
        </template>
      </el-table-column>
    </el-table>



    <el-dialog title="查看详情" :visible.sync="detailVisible"
               width="30%" :append-to-body="true">
      <p>公式名称：{{ selectedDetail.eqName }}</p>
      <p>公式内容：{{ selectedDetail.eqContent }}</p>
      <p>描述：{{ selectedDetail.description }}</p>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "details",
  props: ['taskId'],

  data() {
    return{
      information: {
        "taskName": "--",
        "dbId": "--",
        "startTime": "--",
        "deadline": "--",
        "state": 1,
        "dbName": "--",
        "eqList": [{
          "eqName": "wadas",
          "eqContent": "sads",
          "description": "awdd",
          "eqId": "esfd"
        }],
      },

      detailVisible: false,

      selectedDetail: {}
    }
  },

  methods: {
    getTaskDetails(){
      this.$http.post('/countManage/GetTaskInfo', { taskId: this.taskId })
        .then(res => {
          if (res.hasOwnProperty('result')) {
            this.information = res.result.taskInfo;
          } else {
            this.$message.error('查询任务详情失败');
            this.$emit('searchFailed');
          }
        }).catch(err => {
          setTimeout(() => {
            this.$message.error('查询任务详情失败');
            this.$emit('searchFailed');
          }, 2000);
      })
    }
  },

  mounted() {
    this.getTaskDetails();
  }
}
</script>

<style scoped>
.info-label {
  font-size: 16px;
  font-weight: bold;
}
.info-value {
  font-size: 16px;
  font-weight: normal;
}
.el-table {
  height: 400px;
}
</style>
