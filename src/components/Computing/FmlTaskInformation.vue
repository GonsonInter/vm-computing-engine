<template>
  <div style="position: relative">
    <el-form ref="taskInfoForm" :model="info" :rules="rules" label-width="100px">
      <el-form-item label="选择组" prop="dbId">
        <el-cascader
            v-model="info.groupId"
            :options="groupData"
            :props="groupProp"
            @change="handleGroupChange"></el-cascader>
      </el-form-item>

      <el-form-item label="选择公式" prop="dbId">
        <el-select placeholder="请选择公式" v-model="fmlTemplate" clearable>
          <el-option v-for="item in fmlList" :key="item.eqId"
                     :value="item.eqContent" :label="item.eqName"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="自定义名称" prop="eqName">
        <el-input placeholder="请输入自定义公式名称" v-model="info.eqName" clearable></el-input>
      </el-form-item>


      <el-form-item label="公式编辑" prop="eqContent">
        <el-input type="textarea" placeholder="请输入公式" v-model="info.eqContent"></el-input>
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
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "FmlTaskInformation",

  props: ['info', 'opType'],

  data() {

    return {
      groupData: [{
        groupId: 1,
        groupName: '一级 1',
        children: [{
          groupId: 4,
          groupName: '二级 1-1',
        }]
      }, {
        groupId: 2,
        groupName: '一级 2',
        children: [{
          groupId: 5,
          groupName: '二级 2-1',
        }, {
          groupId: 6,
          groupName: '二级 2-2',
        }]
      }, {
        groupId: 3,
        groupName: '一级 3',
        children: [{
          groupId: 7,
          groupName: '二级 3-1',
        }, {
          groupId: 8,
          groupName: '二级 3-2',
        }]
      }],

      fmlList: [],

      fmlTemplate: '',

      groupProp: {
        expandTrigger: 'hover',
        value: 'groupId',
        label: 'groupName',
        children: 'children'
      },

      rules: {
        eqName: [
          {required: true, message: '请输入自定义名称', trigger: 'blur'}
        ],
        eqContent: [
          {required: true, message: '请编辑公式', trigger: 'blue'}
        ]
      },
    }
  },

  methods: {

    getGroupList() {
      this.$http.post('/eqTemplate/FindGroupInfo', { groupId: '' })
          .then(res => {
            if (res.hasOwnProperty('result')) {
              this.groupData = res.result.groupInfo;
            } else {
              this.$message.error('获取组列表失败')
            }
          }).catch(() => {
        this.$message.error('获取组列表失败')
      })
    },

    handleGroupChange() {
      this.$http.post('/eqTemplate/FindEqInfo', {
        groupId: this.info.groupId[this.info.groupId.length - 1],
        eqId: '', eqName: ''
      }).then(res => {
        if (res.hasOwnProperty('result')) {
          this.fmlList = res.result.eqList;
        } else {
          this.$message.error('查询该组下公式模板列表失败');
        }
      })
    },

    submit() {
      // console.log(this.info);
      delete this.info.dbName;
      if ( this.info.groupId instanceof Array)
        this.info.groupId = this.info.groupId[this.info.groupId.length - 1];
      this.$refs.taskInfoForm.validate(valid => {
        if (valid) {
          let url = this.opType ?
              '/countManage/UpdateEquationInfo' : '/countManage/AddEquationInfo';
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
  },

  watch: {},

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
