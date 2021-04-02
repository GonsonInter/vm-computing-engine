<template>
  <div class="main-page">
    <div class="operate-bar shadow-box">

      <p class="search-label">查询数据库</p>
      <el-input class="search-input" v-model="getTaskInfo.dbName"></el-input>

      <p class="search-label">查询任务名</p>
      <el-input class="search-input" v-model="getTaskInfo.taskName"></el-input>

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
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
            </span>
        </el-tree>

      </div>

      <div class="table-pane shadow-box" style="flex: 1">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="编号" type="index" width="60" :resizable="false"></el-table-column>
          <el-table-column prop="dbName" label="数据库名称" width="180" :resizable="false"></el-table-column>
          <el-table-column prop="taskName" label="任务名称" :resizable="false"></el-table-column>
          <el-table-column prop="startTime" label="开始时间" :resizable="false"></el-table-column>
          <el-table-column prop="deadline" label="结束时间" :resizable="false"></el-table-column>
          <el-table-column prop="interval" label="时间间隔" :resizable="false"></el-table-column>
          <el-table-column prop="description" label="描述" :resizable="false"></el-table-column>
          <el-table-column prop="state" label="运行状态" :resizable="false"></el-table-column>
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
                <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </el-popconfirm>
              <el-button size="mini" type="primary" icon="el-icon-tickets">查看日志</el-button>
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
      </div>
    </div>


    <!--对话框-->
    <!--查看详情-->
    <el-dialog :visible.sync="detailVisible" title="任务详情" v-if="detailVisible">
      <Details :task-id="selectTaskId" @searchFailed="detailVisible = false"></Details>
    </el-dialog>

    <!--添加或修改计算任务-->
    <el-dialog :visible.sync="taskInformationVisible"
               v-if="taskInformationVisible" :title="taskInfoTitle">
      <TaskInformation :info="taskInfo" :op-type="taskOpType"
                       :dbList="dbList" @opFinished="taskInfoFinished"></TaskInformation>
    </el-dialog>

    <!--公式管理对话框-->
    <el-dialog :visible.sync="fmlManageVisible"
               title="公式管理"
               v-if="fmlManageVisible"
               :append-to-body="true"
              width="80%">
      <FmlManage :task-id="selectTaskId"></FmlManage>
    </el-dialog>

  </div>
</template>

<script>
import TaskInformation from "@/components/Computing/TaskInformation";
import Details from "@/components/Computing/Details";
import FmlManage from "@/components/Computing/FmlManage";

export default {
  name: "Computings",
  components: {TaskInformation, Details, FmlManage},
  data() {
    return {
      tableData: [{
        "dbId": 55,
        "dbName": "waad",
        "taskName": "wadaw",
        "startTime": "2021-04-02 00:00:00",
        "deadline": "2021-04-02 00:00:00",
        'interval': 20,
        "description": "wefwf",
        "state": 1,
        "taskId": "wqdd"
      }, {
        "dbId": 132,
        "dbName": "1111",
        "taskName": "2222",
        "startTime": "2021-04-02 00:00:00",
        "deadline": "2021-04-02 00:00:00",
        'interval': 15,
        "description": "bbbb",
        "state": 0,
        "taskId": "jhkukhkhu"
      }, {}],

      dbList: [
        {dbId: 132, dbName: 'wadad'},
        {dbId: 55, dbName: 'jikkik'},
        {dbId: 88, dbName: 'sfgfdhtfd12s1gr'}
      ],

      treeProp: {
        label: 'dbName',
        value: 'dbId'
      },

      stateOptions: [
        {value: 0, label: '未运行'},
        {value: 1, label: '正在运行'},
        {value: 2, label: '异常'},
        {value: 3, label: '停止'},
        {value: 4, label: '已完成'},
      ],

      getTaskInfo: {
        dbName: '',
        taskName: '',
        state: ''
      },

      taskInformationVisible: false,

      taskInfoTitle: '添加计算任务',

      taskInfo: {
        taskName: '',
        dbId: '',
        startTime: '',
        deadline: '',
        description: ''
      },

      taskOpType: 0,

      selectTaskId: '',

      detailVisible: false,

      fmlManageVisible: false

    }
  },

  methods: {
    getDBList() {
      this.$http.post('/countManage/FindConnectedDb', {}).then(res => {
        if (res.hasOwnProperty('result'))
          this.dbList = res.result.dbInfoList;
        else
          this.$message.error('获取数据库信息失败');
      })
    },

    getTaskList() {
      this.$http.post('/countManage/FindCountTask', this.getTaskInfo)
          .then(res => {
            if (res.hasOwnProperty('result'))
              this.tableData = res.result.taskInfoList;
          })
    },

    editOpen(row) {
      this.taskOpType = 1;
      Object.assign(this.taskInfo, row);
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
              this.$message.error('删除失败');
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
            this.$message.error(`任务${row.taskName}${flag ? '启动' : '停止'}失败`);
          }
        }).catch(err => {
          setTimeout(() => this.$message.error(`任务${row.taskName}${flag ? '启动' : '停止'}失败`), 2000);
      })
    }
  },

  watch: {
    taskInformationVisible(newVal) {
      if (!newVal)
        this.taskInfo = {
          taskName: '',
          dbId: '',
          startTime: '',
          deadline: '',
          interval: '',
          description: ''
        }
    }
  },

  mounted() {
    this.getDBList();
    this.getTaskList();
  }
}
</script>

<style scoped>

</style>
