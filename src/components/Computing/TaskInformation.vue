<template>
  <div style="position: relative">
    <el-form ref="taskInfoForm" :model="info" :rules="rules" label-width="100px">
      <el-form-item label="任务名称" prop="taskName">
        <el-input placeholder="请输入任务名称" v-model="info.taskName" clearable></el-input>
      </el-form-item>
      <el-form-item label="数据库" prop="dbId">
        <el-select placeholder="请选择数据库" v-model="info.dbId" clearable>
          <el-option v-for="item in dbList" :key="item.dbId"
                     :value="item.dbId" :label="item.dbName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结束时间" prop="deadline">
        <el-date-picker placeholder="选择结束时间"
                        v-model="info.deadline"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time = "info.deadline"
                        clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="时间间隔" prop="interval">
        <div style="display: flex">
          <el-input-number v-model="info.interval" placeholder="请输入时间间隔"
            :min="0"></el-input-number>
          <span style="width: 60px; text-align: center">秒</span>
        </div>

      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" placeholder="请输入描述" v-model="info.description"></el-input>
      </el-form-item>
      <el-form-item class="button-item">
        <el-button type="primary" @click="submit">
          {{ opType ? '修改' : '添加' }}
        </el-button>
        <el-button type="info"
                   @click="$refs.taskInfoForm.resetFields();
                   $message.info('已重置')">
          重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "TaskInformation",

  props: [ 'info', 'opType', 'dbList' ],

  data() {

    return {
      // formInfo: {
      //   dbName: '',
      //   address: '',
      //   description: ''
      // },

      rules: {
        taskName: [
          {required: true, message: '请输入任务名称', trigger: 'blur'}
        ],
        dbId: [
          {required: true, message: '请选择数据库', trigger: 'blur'},
        ],
        interval: [
          {required: true, message: '请输入时间间隔', trigger: 'blue'}
        ],
        deadline: [
          { required: true, message: '请选择结束时间', trigger: 'blur'}
        ]
      },

    }
  },

  methods: {
    submit() {
      // console.log(this.info);
      delete this.info.dbName;
      this.$refs.taskInfoForm.validate(valid => {
        if (valid) {
          let url = this.opType ?
              '/countManage/UpdateCountTask' : '/countManage/AddCountTask';

          this.info.interval = parseInt(this.info.interval);
          this.$http.post(url, this.info).then(res => {
            if (res.hasOwnProperty('result')) {
              this.$message.success(this.opType ?
                  '修改成功' : '添加成功');
              this.$emit('opFinished', true);
            }

            if (res.hasOwnProperty('error')) {
              this.$message.error((this.opType ?
                  '修改失败' : '添加失败') + '，' + res.error.message);
            }

          })
        }
      })
    },
  },

  watch: {

  },

  mounted() {
    // console.log(this.info);
  }
}
</script>

<style scoped>
.button-item {
  float: right;
  margin: 20px 0 0 0;
}

.el-form::after {
  content: '';
  display: block;
  clear: both;
}

.test-pane {
  position: absolute;
  bottom: 0;
  height: 30px;
  width: 100px;
}


#instruction-light {
  display: inline-block;
  height: 10px;
  width: 10px;
  background-color: #bdb7b7;
  border: 2px solid #cdbcbc;
  border-radius: 50%;
  position: absolute;
  bottom: 3px;
  right: 20px;
}

.el-icon-loading {
  color: #3726c6;
  z-index: 1;
  position: absolute;
  bottom: 3px;
  right: 20px;
}

</style>

