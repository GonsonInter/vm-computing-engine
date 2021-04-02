<template>
  <div style="position: relative">
    <el-form ref="dbInfoForm" :model="info" :rules="rules" label-width="100px">
      <el-form-item label="数据库名称" prop="dbName">
        <el-input placeholder="请输入数据库名称" v-model="info.dbName" clearable></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input placeholder="请输入数据库地址(IP:端口号)" v-model="info.address" clearable></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" placeholder="请输入描述" v-model="info.description"></el-input>
      </el-form-item>
      <el-form-item class="button-item">
        <el-button type="primary" @click="submit">
          {{ opType ? '修改' : '添加' }}
        </el-button>
        <el-button type="info"
                   @click="$refs.dbInfoForm.resetFields();
                   $message.info('已重置')">
          重置</el-button>
      </el-form-item>
    </el-form>

    <div class="test-pane">
      <el-button class="test-btn" type="text" @click="testConnection">测试链接</el-button>

      <i class="el-icon-loading" v-show="isLoading"></i>

      <div id="instruction-light" v-show="!isLoading"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DBInformation",

  props: [ 'info', 'opType' ],

  data() {

    let checkAddress = (rule, value, callback) => {
      let reg = /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?):\d+/
      if (!reg.test(value))
        callback(new Error('请输入正确的地址(IP:端口号)，IP每位最大为255'));
      else callback();
    }

    return {
      // formInfo: {
      //   dbName: '',
      //   address: '',
      //   description: ''
      // },

      rules: {
        dbName: [
          {required: true, message: '请输入数据库名称', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入地址(IP:端口号)', trigger: 'blur'},
          {validator: checkAddress, trigger: 'blur'}
        ]
      },

      testConnectionInfo: {
        address: '',
        dbId: ''
      },

      isLoading: false
    }
  },

  methods: {
    submit() {
      // console.log(this.info);

      this.$refs.dbInfoForm.validate(valid => {
        if (valid) {
          let url = this.opType ?
              '/dbConfig/UpdateDbInfo' : '/dbConfig/AddDbInfo';
          this.$http.post(url, this.info).then(res => {

            console.log(res)
            if (res.hasOwnProperty('result')) {
              this.$message.success(this.opType ?
                  '修改成功' : '添加成功');
              this.$emit('opFinished', true);
            }

            if (res.hasOwnProperty('error')) {
              this.$message.error((this.opType ?
                  '修改失败' : '添加失败') + '，' + res.error.message + '。');
            }

          })
        }
      })
    },

    testConnection() {
      this.isLoading = true;
      this.testConnectionInfo.address = this.info.address;
      this.testConnectionInfo.dbId = this.info.dbId;
      this.$http.post('/dbConfig/ConnectVMTest', this.testConnectionInfo)
        .then(res => {
          if (res.hasOwnProperty('result')) {
            this.$message.success('测试成功');
            this.isLoading = false;

            this.info.state = res.result.state;
            document.getElementById('instruction-light')
                .style.backgroundColor = this.info.state === 0 ? '#bdb7b7' : '#83ef7e';
          }
        }).catch(err => {
          setTimeout(() => {
            this.isLoading = false;
            this.$message.error('测试链接失败');
          }, 2000);
      })
    }

  },

  watch: {

  },

  mounted() {
    document.getElementById('instruction-light')
        .style.backgroundColor = this.info.state === 0 ? '#bdb7b7' : '#83ef7e'
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
