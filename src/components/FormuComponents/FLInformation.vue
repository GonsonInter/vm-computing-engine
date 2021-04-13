<template>

  <el-form ref="dbInfoForm" :model="info" :rules="rules" label-width="120px">
    <el-form-item label="选择组" prop="groupId">
      <el-cascader ref="groupCas"
          :options="groupList" v-model="info.groupId"
                   :props="cascadeProp" clearable :disabled="opType !== 0"></el-cascader>
    </el-form-item>
    <el-form-item label="公式模板名称" prop="eqName">
      <el-input placeholder="请输入公式模板名称" v-model="info.eqName" clearable></el-input>
    </el-form-item>
    <el-form-item label="公式模板编辑" prop="eqContent">
      <el-input placeholder="请编辑公式模板" v-model="info.eqContent"
                type="textarea" clearable></el-input>
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
        重置
      </el-button>
    </el-form-item>
  </el-form>

</template>

<script>
export default {
  name: "FLInformation",

  props: ['groupList', 'info', 'opType'],

  data() {

    return {
      // formInfo: {
      //   dbName: '',
      //   address: '',
      //   description: ''
      // },

      rules: {
        groupId: [
          {required: true, message: '请选择组', trigger: 'blur'}
        ],
        eqName: [
          {required: true, message: '请输入公式模板名称', trigger: 'blur'}
        ],
        eqContent: [
          {required: true, message: '请输入公式模板', trigger: 'blur'},
        ]
      },

      cascadeProp: {
        value: 'groupId',
        label: 'groupName',
        children: 'children'
      }

    }
  },

  methods: {
    submit() {
      // console.log(this.info);

      this.$refs.dbInfoForm.validate(valid => {
        if (valid) {
          if (this.info.groupId instanceof Array)
            this.info.groupId = this.info.groupId[this.info.groupId.length - 1];

          this.info.groupName = this.$refs.groupCas.inputValue;

          let url = this.opType ?
              '/eqTemplate/UpdateEqInfo' : '/eqTemplate/AddEqInfo';
          this.$http.post(url, this.info).then(res => {

            console.log(res)
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

  watch: {},

  mounted() {
    // console.log(this.groupList)
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
