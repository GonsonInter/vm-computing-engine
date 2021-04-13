<template>
  <div class="main-page">
    <div class="operate-bar shadow-box">

      <p class="search-label">查询名称</p>
      <el-input class="search-input" v-model = "dbGetInfo.dbName"
                clearable placeholder="输入数据库名查询"></el-input>

      <p class="search-label">查询地址</p>
      <el-input class="search-input" v-model = "dbGetInfo.address"
                clearable placeholder="输入数据库地址查询"></el-input>

      <el-button class="search-button" type="warning" icon="el-icon-search" round
        @click="getDBList()">查询</el-button>

      <el-button class="add-button" type="primary" icon="el-icon-plus"
        @click="openAdd">添加数据库</el-button>

    </div>

    <div class="table-pane shadow-box">
      <el-table :data="shownData" border style="width: 100%;" :height="tableHeight">
        <el-table-column label="编号" type="index" width="60"></el-table-column>
<!--        <el-table-column prop="dbId" label="if" v-if="false"></el-table-column>-->
        <el-table-column prop="dbName" label="数据库名称" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="state" label="连接状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === 1" type="success">已连接</el-tag>
            <el-tag v-if="scope.row.state === 2" type="danger">未测试</el-tag>
            <el-tag v-if="scope.row.state === 0" type="info">未连接</el-tag>

            (上次测试时间{{ scope.row.connectionTime }})
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" icon="el-icon-edit"
              @click="openEdit(scope.row)">修改</el-button>
              <el-popconfirm class="confirm"
                  title="确定要删除这个数据库吗？" @confirm="deleteDB(scope.row)">
                <el-button slot="reference" icon="el-icon-delete"
                           size="mini">删除</el-button>
              </el-popconfirm>
            <el-button size="mini" type="primary" icon="el-icon-key"
                @click="connectionTest(scope.row)"
                       :id='`test_${scope.row.dbId}`' :loading="false">测试连接</el-button>
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

    <el-dialog :visible.sync="dialogVisible" width="30%"
     :title="dialogName" :close-on-click-modal="false" destroy-on-close>
      <DBInformation :info="dbInfomation" v-if="dialogVisible"
                     :opType="opType" @opFinished="opFinished"></DBInformation>
    </el-dialog>


  </div>
</template>

<script>
import DBInformation from "@/components/DBManageComponents/DBInformation";
import tableHeightControl from "@/mixins/tableHeightControl";
import pageControl from "@/mixins/pageControl";

export default {

  name: "dbManage",

  mixins: [ tableHeightControl, pageControl ],

  components: { DBInformation },

  data() {
    return {
      tableData: [],

      dbGetInfo: {
        dbName: '',
        address: ''
      },

      dbDeleteInfo: {
        dbId: ''
      },

      connectionTestInfo: {
        address: '',
        dbId: ''
      },

      dialogVisible: false,

      dialogName: '',

      dbInfomation: '',

      opType: 0,
    }
  },

  methods: {
    getDBList() {

      this.$http.post('/dbConfig/FindDbInfo', this.dbGetInfo)
          .then(res => {
            // console.log(res)
        if (res.hasOwnProperty('result')) {
          this.tableData = res.result.dbInfoList;
          this.totalNum = this.tableData.length;
          this.handleFirstShow(this.tableData);
        }
        else
          this.$message.error('获取数据库列表失败,' + res.error.message);
      })
    },

    openAdd() {
      this.opType = 0;
      this.dialogName = '添加数据库';
      this.dbInfomation = {
        "dbName": "",
        "address": "",
        "state": 0,
        "connectionTime": "",
        "description": "",
        "dbId": ""
      };
      this.dialogVisible = true;
    },

    openEdit(row) {
      this.opType = 1;
      this.dialogName = '修改数据库';
      this.dbInfomation = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },

    opFinished(flag) {
      if (flag) {
        this.getDBList();
        this.dialogVisible = false;
      }
    },

    deleteDB(row) {
      this.dbDeleteInfo.dbId = row.dbId;
      console.log(this.dbDeleteInfo)
      this.$http.post('/dbConfig/DeleteDbInfo', this.dbDeleteInfo)
        .then(res => {
          if (res.hasOwnProperty('result')) {
            this.getDBList();
            this.$message.success('删除成功');
          }
        })
    },

    connectionTest(row) {
      let target = document.getElementById(`test_${row.dbId}`);
      console.log(target)
      target.classList.add('is-loading');

      this.connectionTestInfo.address = row.address;
      this.connectionTestInfo.dbId = row.dbId;
      this.$http.post('/dbConfig/ConnectVMTest', this.connectionTestInfo)
        .then(res => {
          if (res.hasOwnProperty('result')) {
            this.$message.success('测试成功');
            row.state = res.result.state;
            row.connectionTime = res.result.connectionTime;
            target.classList.remove('is-loading');
          }  else {
            this.$message.error('测试连接失败,' + res.error.message);
            target.classList.remove('is-loading');
          }
        }).catch(err => {
        setTimeout(() => {
          target.classList.remove('is-loading');
          this.$message.error('测试连接失败')
        }, 2000);
      })
    }

  },

  watch: {
    dialogVisible(newVal) {
      if (!newVal)
        this.dbInfomation = {
          "dbName": "",
          "address": "",
          "state": 0,
          "connectionTime": "",
          "description": "",
          "dbId": ""
        }
    }
  },

  mounted() {

    this.dbInfomation = {
      "dbName": "",
      "address": "",
      "state": 0,
      "connectionTime": "",
      "description": "",
      "dbId": ""
    };

    this.getDBList();
  },

}
</script>

<style scoped>
  .confirm {
    display: inline-block !important;
    margin: 0 15px !important;
  }

</style>
