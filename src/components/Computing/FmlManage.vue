<template>
  <div>
    <div class="label-container">
      <div style="display: inline-block">
        <span class="info-label">数据库名称：</span>
        <span class="info-value">{{ information.dbName }}</span>
      </div>
      <div style="display: inline-block; position: absolute; left: 50%">
        <span class="info-label">任务名称：</span>
        <span class="info-value">{{ information.taskName }}</span>
      </div>
    </div>
    <div>
      <div style="display: inline-block">
        <span class="info-label">开始时间：</span>
        <span class="info-value">{{ information.startTime }}</span>
      </div>
      <div style="display: inline-block; position: absolute; left: 50%">
        <span class="info-label">结束时间：</span>
        <span class="info-value">{{ information.deadline }}</span>
      </div>
    </div>
    <div style="position: relative; margin-top: 10px">
      <span class="info-label">公式列表:</span>

      <el-button type="primary" size="mini"
                 style="position: absolute; right: 0"
                 @click="fmlInfoVisible = true; opTitle = '添加公式'; opType = 0">添加公式
      </el-button>
      <el-table :data="information.eqInfoList" border height="450px">
        <el-table-column label="编号" type="index" width="60" :resizable="false"></el-table-column>
        <el-table-column prop="eqName" label="公式名称" width="180" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="eqContent" label="公式内容" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="description" label="描述" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" :resizable="false" width="240">
          <template slot-scope="scope">
            <el-button type="info" size="mini" @click="detailData = scope.row; detailVisible = true">查看</el-button>
            <el-button type="warning" size="mini" @click="editFormula(scope.row)" :disabled="new Set([1, 2]).has(information.state)">编辑</el-button>

            <el-popconfirm
                title="确定删除这条公式吗？"
                style="margin-left: 10px"
                @confirm="deleteFormulation(scope.row.eqId)"
            >
              <el-button slot="reference" type="danger" size="mini" :disabled="new Set([1, 2]).has(information.state)">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog :visible.sync="fmlInfoVisible" v-if="fmlInfoVisible"
               width="30%" :title="opTitle" :append-to-body="true" :close-on-click-modal="false">
      <FmlTaskInformation :info="fmlInfo" :opType="opType" @opFinished="opFinished"></FmlTaskInformation>
    </el-dialog>

    <el-dialog title="查看详情" :visible.sync="detailVisible"
               width="30%" :append-to-body="true">
      <p>公式名称：{{ detailData.eqName }}</p>
      <p>公式内容：{{ detailData.eqContent }}</p>
      <p>描述：{{ detailData.description }}</p>
    </el-dialog>

  </div>
</template>

<script>
import FmlTaskInformation from "@/components/Computing/FmlTaskInformation";

export default {

  name: "FmlManage",

  components: {FmlTaskInformation},

  props: ['taskId'],

  data() {
    return {
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

      fmlInfoVisible: false,

      opTitle: '添加公式',

      opType: 0,

      fmlInfo: {
        taskId: this.taskId,
        eqName: '',
        eqContent: '',
        description: '',
        interval: ''
      },

      detailData: {},

      detailVisible: false
    }
  },

  methods: {

    getTaskDetails() {
      this.$http.post('/countManage/GetTaskInfo', {taskId: this.taskId})
          .then(res => {
            if (res.hasOwnProperty('result')) {
              this.information = res.result.taskInfo;
            } else {
              this.$message.error('查询任务详情失败,' + res.error.message);
              this.$emit('searchFailed');
            }
          }).catch(err => {
        setTimeout(() => {
          this.$message.error('查询任务详情失败,' + res.error.message);
          this.$emit('searchFailed');
        }, 2000);
      })
    },

    editFormula(row) {
      Object.assign(this.fmlInfo, row);
      this.opType = 1;
      this.opTitle = '修改公式';
      this.fmlInfoVisible = true;
    },

    deleteFormulation(eqId) {
      this.$http.post('/countManage/DeleteEquationInfo', { taskId: this.taskId, eqId})
        .then(res => {
          if (res.hasOwnProperty('result')) {
            this.getTaskDetails();
            this.$message.success('删除成功');
          } else {
            this.$message.error('删除失败,' + res.error.message);
          }
        })
    },

    opFinished(flag) {
      if (flag) {
        this.fmlInfoVisible = false;
        this.getTaskDetails();
      }
    }

  },

  watch: {
    fmlInfoVisible(newVal) {
      if (!newVal) {
        this.fmlInfo = {
          taskId: this.taskId,
          eqName: '',
          eqContent: '',
          description: '',
          interval: ''
        }
      }
    }
  },

  mounted() {
    this.getTaskDetails();
    // console.log(this.taskId);
  }
}
</script>

<style scoped>
.info-label {
  font-size: 16px;
  font-weight: bold;
  line-height: 30px;
}

.info-value {
  font-size: 16px;
  font-weight: normal;
}

.el-table {
  height: 400px;
  margin-top: 20px;
}
</style>
