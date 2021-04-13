<template>
  <div class="main-page">
    <div class="operate-bar shadow-box">

      <p class="search-label">查询数据库</p>
      <el-input class="search-input" v-model="getTaskInfo.dbName" clearable></el-input>

      <p class="search-label">查询任务名</p>
      <el-input class="search-input" v-model="getTaskInfo.taskName" clearable></el-input>

      <p class="search-label">查询状态</p>
      <el-select class="search-input" v-model="getTaskInfo.state" placeholder="请选择">
        <el-option v-for="item in stateOptions" :key="item.value"
                   :value="item.value" :label="item.label"></el-option>
      </el-select>

      <el-button class="search-button" type="warning" icon="el-icon-search"
                 round @click="getTaskList">查询
      </el-button>

      <el-button class="add-button" type="primary"
                 icon="el-icon-plus" @click="taskInformationVisible = true;
                  taskInfoTitle='添加计算任务'; taskOpType = 0">添加任务
      </el-button>

    </div>

    <div class="column-menu">

      <div class="shadow-box tree-pane">
        <!--        <el-button>添加分组</el-button>-->

        <!--        <div style="width: 100%; padding: 5px; box-sizing: border-box">-->
        <!--          <el-input-->
        <!--              placeholder="输入关键字进行过滤"-->
        <!--              v-model="filterText" suffix-icon="el-icon-search">-->
        <!--          </el-input>-->
        <!--        </div>-->


        <el-tree
            :data="dbList"
            :props="treeProp"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }"
                  @click="treeNodeClick(node.data.dbId)">
              <span>{{ node.label }}</span>
            </span>
        </el-tree>

      </div>

      <div class="table-pane shadow-box" style="flex: 1">
        <el-table :data="shownData" border style="width: 100%" :height="tableHeight">
          <el-table-column label="编号" type="index" width="60" :resizable="false"></el-table-column>
          <el-table-column prop="dbName" label="数据库名称" width="180" :resizable="false"></el-table-column>
          <el-table-column prop="taskName" label="任务名称" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="startTime" label="开始时间" :resizable="false"></el-table-column>
          <el-table-column prop="deadline" label="结束时间" :resizable="false"></el-table-column>
          <el-table-column prop="interval" label="时间间隔" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="description" label="描述" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="state" label="运行状态" :resizable="false">
            <template v-slot="scope">
              <span v-if="scope.row.state === 0">未运行</span>
              <span v-if="scope.row.state === 1">正在运行</span>
              <span v-if="scope.row.state === 2">异常运行</span>
              <span v-if="scope.row.state === 3">异常停止</span>
              <span v-if="scope.row.state === 4">停止</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="600" :resizable="false">
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-monitor"
                         @click="selectTaskId = scope.row.taskId; detailVisible = true">查看详情
              </el-button>
              <el-button size="mini" type="info" icon="el-icon-edit"
                         :disabled="new Set([1, 2, 3, 4]).has(scope.row.state)"
                         @click="editOpen(scope.row)">修改</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting"
                         @click="selectTaskId = scope.row.taskId; fmlManageVisible = true">公式管理</el-button>
              <el-popconfirm class="confirm" style="margin: 0 10px"
                             title="确定要删除这个任务吗？" @confirm="deleteTask(scope.row)">
                <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete"
                           :disabled="new Set([1, 2]).has(scope.row.state)">删除</el-button>
              </el-popconfirm>
              <el-button size="mini" type="primary" icon="el-icon-tickets"
                         @click="checkLog(scope.row.taskId)">查看日志</el-button>
              <el-button size="mini" type="primary" circle
                         icon="el-icon-video-play"
                         :disabled="new Set([1, 2]).has(scope.row.state)"
                         @click="startOrStopTask(scope.row, true)"></el-button>
              <el-button size="mini" type="danger"
                         circle icon="el-icon-video-pause"
                         :disabled="new Set([0, 3, 4]).has(scope.row.state)"
                         @click="startOrStopTask(scope.row, false)"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            @size-change="handleSizeChange(tableData)"
            @current-change="handleCurrentChange(tableData)"
            :current-page.sync="currentPage"
            :page-sizes="[5, 10, 20, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total.sync="totalNum">
        </el-pagination>
      </div>
    </div>


    <!--对话框-->
    <!--查看详情-->
    <el-dialog :visible.sync="detailVisible" title="任务详情"
               destroy-on-close>
      <Details :task-id="selectTaskId" @searchFailed="detailVisible = false"></Details>
    </el-dialog>

    <!--添加或修改计算任务-->
    <el-dialog :visible.sync="taskInformationVisible" width="30%"
               destroy-on-close :title="taskInfoTitle" :close-on-click-modal="false">
      <TaskInformation :info="taskInfo" :op-type="taskOpType"
                       :dbList="dbList" @opFinished="taskInfoFinished"></TaskInformation>
    </el-dialog>

    <!--公式管理对话框-->
    <el-dialog :visible.sync="fmlManageVisible"
               title="公式管理"
               destroy-on-close
               :append-to-body="true"
              width="80%" :close-on-click-modal="false">
      <FmlManage :task-id="selectTaskId"></FmlManage>
    </el-dialog>

    <el-dialog title="日志信息" :visible.sync="logVisible">
      <el-card id="log-card">
        {{ logInfo }}
      </el-card>
    </el-dialog>

  </div>
</template>

<script>
import TaskInformation from "@/components/Computing/TaskInformation";
import Details from "@/components/Computing/Details";
import FmlManage from "@/components/Computing/FmlManage";
import tableHeightControl from "@/mixins/tableHeightControl";
import pageControl from "@/mixins/pageControl";

export default {
  name: "Computings",
  mixins: [ tableHeightControl, pageControl ],
  components: {TaskInformation, Details, FmlManage},
  data() {
    return {
      tableData: [],

      dbList: [
        // {dbId: 132, dbName: 'wadad'},
        // {dbId: 55, dbName: 'jikkik'},
        // {dbId: 88, dbName: 'sfgfdhtfd12s1gr'}
      ],

      treeProp: {
        label: 'dbName',
        value: 'dbId'
      },

      stateOptions: [
        {value: -1, label: '全部'},
        {value: 0, label: '未运行'},
        {value: 1, label: '正在运行'},
        {value: 2, label: '异常运行'},
        {value: 3, label: '异常停止'},
        {value: 4, label: '停止'}
      ],

      getTaskInfo: {
        dbName: '',
        taskName: '',
        state: -1
      },

      taskInformationVisible: false,

      taskInfoTitle: '添加计算任务',

      taskInfo: {
        taskName: '',
        dbId: '',
        deadline: '',
        interval: 0,
        description: ''
      },

      taskOpType: 0,

      selectTaskId: '',

      detailVisible: false,

      fmlManageVisible: false,

      logInfo: '',

      logVisible: false,

      stateMap: new Map(),

      stateQuery: ''

    }
  },

  methods: {
    getDBList() {
      this.$http.post('/countManage/FindConnectedDb', {}).then(res => {
        if (res.hasOwnProperty('result'))
          this.dbList = res.result.DbInfoList;
        else
          this.$message.error('获取数据库信息失败,' + res.error.message);
      })
    },

    getTaskList() {
      this.$http.post('/countManage/FindCountTask', this.getTaskInfo)
          .then(res => {
            if (res.hasOwnProperty('result')) {
              this.tableData = res.result.taskInfoList;
              this.totalNum = this.tableData.length;
              this.handleFirstShow(this.tableData);
              this.stateQuery = setInterval(this.getStatus, 5000);
            }

            else
              this.$message.error(`查询任务列表失败，${res.error.message}`)
          })
    },

    editOpen(row) {
      this.taskOpType = 1;
      this.taskInfoTitle = '修改计算任务';
      Object.assign(this.taskInfo, row);
      this.taskInfo.interval = parseInt(this.taskInfo.interval.substring(0, this.taskInfo.interval.length));
      this.taskInformationVisible = true;
    },

    taskInfoFinished(flag) {
      if (flag) {
        this.getTaskList();
        this.taskInformationVisible = false;
      }
    },

    deleteTask(row) {
      this.$http.post('/countManage/DeleteCountTask', {taskId: row.taskId})
          .then(res => {
            if (res.hasOwnProperty('result')) {
              this.$message.success('删除成功');
              this.getTaskList();
            } else {
              this.$message.error('删除失败,' + res.error.message);
            }
          })
    },

    startOrStopTask(row, flag) {
      let url = flag ? '/countManage/StartCountTask' : '/countManage/StopCountTask'
      this.$http.post(url, { taskId: row.taskId })
        .then(res => {
          if (res.hasOwnProperty('result')) {
            this.$message.success(`任务${row.taskName}${flag ? '启动' : '停止'}成功`);
            this.getTaskList();
          } else {
            this.$message.error(`任务${row.taskName}${flag ? '启动' : '停止'}失败, ${res.error.message}`);
          }
        }).catch(err => {
          setTimeout(() => this.$message.error(`任务${row.taskName}${flag ? '启动' : '停止'}失败`), 2000);
      })
    },

    async checkLog(taskId) {
      let { result } = await this.$http.post('/countManage/FindLogInfo', { taskId });
      this.logInfo = result.logInfo;
      // console.log(this.logInfo);
      this.logVisible = true;
    },

    getStatus() {
      this.$http.post('/countManage/FindTaskState', {}).then(res => {
        if (res.hasOwnProperty('result')) {
          this.stateMap.clear();
          res.result.taskStateInfoList.forEach(item => {
            this.stateMap.set(item.taskId, item.state);
          });
          this.tableData.forEach(item => {
            item.state = this.stateMap.get(item.taskId);
          })
        }

      })
    },

    treeNodeClick(dbId) {
      this.$http.post('/countManage/FindConnectedTaskInfo', { dbId })
        .then(res => {
          if (res.hasOwnProperty('result')) {
            this.tableData = res.result.taskInfoList;
            this.totalNum = this.tableData.length;
            this.handleFirstShow(this.tableData);
          }
        })
    }
  },

  watch: {
    taskInformationVisible(newVal) {
      if (!newVal)
        this.taskInfo = {
          taskName: '',
          dbId: '',
          deadline: '',
          interval: 0,
          description: ''
        }
    }
  },

  mounted() {
    this.getDBList();
    this.getTaskList();
  },

  beforeDestroy() {
    clearTimeout(this.stateQuery);
  }
}
</script>

<style scoped lang="scss">
.el-card {
  height: 500px;
  overflow: auto;
  white-space: pre;
}

.operate-bar {
  .search-input {
    width: 10px;
  }
}
</style>
