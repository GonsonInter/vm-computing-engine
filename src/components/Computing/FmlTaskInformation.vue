<template>
  <div style="position: relative">
    <el-form ref="taskInfoForm" :model="info" :rules="rules" label-width="100px">
      <el-form-item label="选择组" prop="dbId">
        <el-cascader
            clearable
            v-model="info.groupId"
            :options="groupData"
            :props="groupProp"
            @change="handleGroupChange"></el-cascader>
      </el-form-item>

      <el-form-item label="选择公式" prop="dbId" v-if="hasGroup">
        <el-select placeholder="请选择公式" v-model="fmlTemplate" @change="selectFormulation" clearable>
          <el-option v-for="item in fmlList" :key="item.eqId"
                     :value="item.eqName" :label="item.eqName"></el-option>
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
                   @click="resetForm">
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

      hasGroup: false

    }
  },

  methods: {

    getGroupList() {
      this.$http.post('/eqTemplate/FindGroupInfo', {groupId: 'rootId'})
          .then(res => {
            if (res.hasOwnProperty('result')) {
              this.groupData = this.dataProcess(res.result).children;
            } else {
              this.$message.error('获取组列表失败,' + res.error.message);
            }
          }).catch(() => {
        this.$message.error('获取组列表失败, ' + res.error.message);
      })
    },

    handleGroupChange() {
      this.fmlTemplate = '';
      this.$http.post('/eqTemplate/FindEqInfo', {
        groupId: this.info.groupId[this.info.groupId.length - 1],
        eqId: '', eqName: ''
      }).then(res => {
        if (res.hasOwnProperty('result')) {
          this.fmlList = res.result.eqInfoList;
          // console.log(this.fmlList);

          this.hasGroup = true;
        } else {
          this.$message.error('查询该组下公式模板列表失败,' + res.error.message);
        }
      })
    },

    submit() {
      // console.log(this.info);
      delete this.info.dbName;
      if (this.info.groupId instanceof Array)
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
                  '修改失败' : '添加失败') + '，' + res.error.message);
            }
          })
        }
      })
    },

    dataProcess(data) {
      if (data.hasOwnProperty('children')) {
        if (!data.children.length)
          delete data.children;
        else
          data.children.forEach(child => {
            this.dataProcess(child);
          })
      }
      return data;
    },

    selectFormulation(e) {
      this.info.eqName = e.toString();
      this.info.eqContent += this.fmlList.reduce((pre, item) => {
        return item.eqName === e.toString() ? pre + item.eqContent + ' ' : pre;
      }, '');
    },

    resetForm() {
      this.$refs.taskInfoForm.resetFields();
      this.$message.info('已重置');
      this.info.groupId = '';
      this.fmlTemplate = '';
      this.hasGroup = false;
    }
  },

  watch: {},

  mounted() {
    // console.log(this.info);
    this.getGroupList();
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
