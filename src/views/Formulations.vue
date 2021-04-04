<template>
  <div class="main-page">

    <div class="operate-bar shadow-box">

      <p class="search-label">查询名称</p>

      <el-input class="search-input" placeholder="输入公式名查询"
                v-model="getFormulationInfo.eqName"></el-input>

      <!--      <p class="search-label">查询内容</p>-->
      <!--      <el-input class="search-input" style=""></el-input>-->

      <el-button class="search-button" type="warning" icon="el-icon-search" round
                 @click="getFormulationList">查询
      </el-button>

      <el-button class="add-button" type="primary"
                 icon="el-icon-plus" @click="openAdd">添加公式
      </el-button>

    </div>

    <div class="column-menu">

      <div class="shadow-box tree-pane">
        <!--        <el-button>添加分组</el-button>-->

        <div>
          <el-button type="text"
                     style="position: absolute;
                     bottom: 0; right: 10px"
                     @click="openAddGroup('', $event)">添加分组
          </el-button>
        </div>

        <div style="width: 100%; padding: 5px; box-sizing: border-box">
          <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText" suffix-icon="el-icon-search" clearable>
          </el-input>
        </div>

        <el-tree
            ref="tree"
            :data="treeData"
            class="filter-tree"
            node-key="groupId"
            :props="treeProps"
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="getFormulationList">
            <span class="custom-tree-node" slot-scope="{ node, treeData }">
              <span>{{ node.label }}</span>
              <span v-if="node.level <= 2">
                <el-button
                    type="text"
                    size="mini" style="font-size: 10px; right: 50px"
                    @click.stop="openAddGroup(node, $event)"
                    v-if="node.level <= 1">
                  添加
                </el-button>

                <el-button
                    type="text"
                    size="mini" style="font-size: 10px; right: 20px"
                    @click.stop="openEditGroup(node, $event)">
                  修改
                </el-button>

                <el-popconfirm placement="right"
                               confirm-button-text='不删除'
                               cancel-button-text='确定'
                               icon="el-icon-info"
                               icon-color="red"
                               title="确定要删除分组吗？"
                               @cancel="deleteGroup(node.data.groupId)">
                  <el-button
                      slot="reference"
                      type="text"
                      size="mini" style="font-size: 20px; line-height: 12px"
                      @click.stop=""
                  >
                    ×
                  </el-button>
                </el-popconfirm>

              </span>
            </span>
        </el-tree>

      </div>

      <div class="table-pane shadow-box" style="flex: 1">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="编号" type="index" width="60"></el-table-column>
          <el-table-column prop="eqId" label="公式ID" v-if="false"></el-table-column>
          <el-table-column prop="eqName" label="公式名称" width="180"></el-table-column>
          <el-table-column prop="groupName" label="组名" width="180"></el-table-column>
          <el-table-column prop="eqContent" label="公式预览" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="description" label="说明"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-monitor"
                         @click="openDetail(scope.row)">查看详情
              </el-button>
              <el-button size="mini" type="warning" icon="el-icon-edit"
                         @click="openEdit(scope.row)">修改
              </el-button>
              <el-popconfirm
                  title="确定删除这条公式模板吗？"
                  style="margin-left: 10px"
                  @confirm="deleteFormulation(scope.row.eqId)"
              >
                <el-button slot="reference" size="mini"
                           type="primary" icon="el-icon-delete">删除
                </el-button>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>


    <!--对话框-->
    <el-dialog
        title="添加一个分组"
        :visible.sync="addGroupVisible"
        width="30%"
        v-if="addGroupVisible">
      <el-form :model="addGroupInfo" ref="addGroupForm"
               :rules="{ groupName: [ {required: true, message: '请输入新的分组名称', trigger: 'blur'} ] }">
        <el-form-item prop="groupName">
          <span>在<b>{{ currentGroup.label }}</b>下添加组 </span>
          <el-input placeholder="请输入新增加的组名"
                    v-model="addGroupInfo.groupName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGroupVisible = false;">取 消</el-button>
        <el-button type="primary" @click="submitForm('addGroupForm', 'add')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="修改分组名"
        :visible.sync="editGroupVisible"
        width="30%"
        v-if="editGroupVisible">
      <el-form :model="editGroupInfo" ref="editGroupForm" label-width="100px"
               :rules="{ groupName: [ {required: true, message: '请输入新的分组名称', trigger: 'blur'} ] }">
        <el-form-item prop="groupName" label="修改组名">
          <el-input placeholder="请输入组名"
                    v-model="editGroupInfo.groupName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGroupVisible = false;">取 消</el-button>
        <el-button type="primary" @click="submitForm('editGroupForm', 'edit')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查看详情" :visible.sync="detailVisible" width="30%">
      <p>公式名称：{{ detailData.eqName }}</p>
      <p>组名称：{{ detailData.groupName }}</p>
      <p>公式内容：{{ detailData.eqContent }}</p>
      <p>描述：{{ detailData.description }}</p>
    </el-dialog>

    <el-dialog :visible.sync="fmlDialogVisible" width="30%"
               :title="fmlDialogName" v-if="fmlDialogVisible">
      <FLInformation :groupList="this.treeData" :info="formulationInfo"
                     :op-type="opType" @opFinished="opFinished"></FLInformation>
    </el-dialog>


  </div>
</template>

<script>
import FLInformation from "@/components/FormuComponents/FLInformation";

export default {
  name: "Formulations",

  components: {FLInformation},

  data() {
    const rawData = [{
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
    }];
    return {
      // treeData: JSON.parse(JSON.stringify(rawData)),
      treeData: [],

      filterText: '',

      tableData: [
        {
          eqId: 'wadwa',
          eqName: 'awda',
          groupName: 'dsfa',
          groupId: 4,
          eqContent: 'wad',
          description: 'j7i6'
        }, {}, {}],

      getGroupInfo: {
        groupId: 'rootId',
      },

      treeProps: {
        label: 'groupName',
        children: 'children',
        realId: 'groupId'
      },

      getFormulationInfo: {
        groupId: '',
        eqId: '',
        eqName: '',
      },

      addGroupVisible: false,

      editGroupVisible: false,

      addGroupInfo: {
        groupName: '',
        pGroupId: ''
      },

      editGroupInfo: {
        pGroupId: '',
        groupId: '',
        groupName: ''
      },

      currentGroup: '',

      detailVisible: false,

      detailData: {
        name: 123
      },

      fmlDialogVisible: false,

      fmlDialogName: '添加公式模板',

      formulationInfo: {
        eqName: "",
        eqContent: "",
        description: "",
        eqId: "",
        groupId: "",
        groupName: ""
      },

      opType: 0
    }
  },

  watch: {
    addGroupVisible(newVal) {
      if (!newVal) {
        this.addGroupInfo.groupName = '';
        this.resetForm('addGroupForm');
      }
    },

    editGroupVisible(newVal) {
      if (!newVal) {
        this.addGroupInfo.pGroupId = '';
        this.addGroupInfo.groupName = '';
      }
    },

    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  methods: {
    getGroupList() {
      this.$http.post('/eqTemplate/FindGroupInfo', this.getGroupInfo)
          .then(res => {
            if (res.hasOwnProperty('result')) {
              // 把没有子节点的Children属性去掉
              this.treeDataProcess(res.result);
              this.treeData = res.result.children;
            } else {
              this.$message.error('获取组列表失败')
            }
          })
    },

    openAddGroup(node, event) {
      // event.stopPropagation();
      // console.log(node);

      if (node === '') {
        this.addGroupInfo.pGroupId = 'rootId';
        this.currentGroup = {
          label: '根组'
        };
      } else {
        this.currentGroup = Object.assign(node);
        this.addGroupInfo.pGroupId = node.data.groupId;
      }

      this.addGroupVisible = true;
    },

    openEditGroup(node, event) {
      // event.stopPropagation();

      // console.log(node);
      this.editGroupInfo.pGroupId = node.parent.data.groupId;
      this.editGroupInfo.groupId = node.data.groupId;
      this.editGroupInfo.groupName = node.label;
      // console.log(node)
      this.editGroupVisible = true;
    },

    submitForm(formName, type) {
      let postData = {};
      let url = '';
      if (type === 'add') {
        postData = this.addGroupInfo;
        url = '/eqTemplate/AddGroupInfo';
      } else if (type === 'edit') {
        postData = this.editGroupInfo;
        url = '/eqTemplate/UpdateGroupInfo';
      }

      // console.log(postData)

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(url, postData).then(res => {
            if (res.hasOwnProperty('result')) {
              this.$message.success(type === 'add' ? '添加分组成功' : '修改分组成功');
              this.getGroupList();
              this.addGroupVisible = false;
              this.editGroupVisible = false;
            } else {
              this.$message.error(type === 'add' ? '添加分组失败' : '修改分组失败');
              this.addGroupVisible = false;
              this.editGroupVisible = false;
            }
          })
              .catch(err => {
                this.$message.error(type === 'add' ? '添加分组失败' : '修改分组失败');
                this.addGroupVisible = false;
                this.editGroupVisible = false;
              })
        } else return false;
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    deleteGroup(groupId, event) {
      // event.stopPropagation();
      this.$http.post('/eqTemplate/DeleteGroupInfo', {groupId: groupId})
          .then(res => {
            if (res.hasOwnProperty('result')) {
              this.$message.success('删除分组成功');
              this.getGroupList();
            } else
              this.$message.error('删除分组失败');
          }).catch(err => {
        this.$message.error('删除分组失败');
      })
    },

    getFormulationList(groupId) {

      if (arguments[0] && arguments[0].hasOwnProperty('groupId')) {
        let node = arguments[0]
        this.getFormulationInfo.groupId = node.groupId;
      } else
        this.getFormulationInfo.groupId = '';

      this.$http.post('/eqTemplate/FindEqInfo', this.getFormulationInfo)
          .then(res => {
            if (res.hasOwnProperty('result')) {
              this.tableData = res.result.EqInfoList;
            } else {
              this.$message.error('获取公式列表失败')
            }
          }).catch(() => {
        this.$message.error('获取公式列表失败');
      })
    },

    deleteFormulation(eqId) {
      this.$http.post('/eqTemplate/DeleteEqInfo', {eqId})
          .then(res => {
            if (res.hasOwnProperty('result')) {
              this.$message.success('删除成功');
              this.getFormulationList();
            } else
              this.$message.error('删除失败');
          }).catch(err => this.$message.error('删除失败'))
    },

    openDetail(row) {
      this.detailVisible = true;
      this.detailData = row;
      console.log(this.detailData);
    },

    openAdd() {
      this.opType = 0;
      this.fmlDialogName = '添加公式模板';
      this.formulationInfo = {
        eqName: "",
        eqContent: "",
        description: "",
        eqId: "",
        groupId: "",
        groupName: ""
      }
      this.fmlDialogVisible = true;
    },

    openEdit(row) {
      this.opType = 1;
      this.fmlDialogName = '修改公式模板';
      console.log(row)
      this.formulationInfo = JSON.parse(JSON.stringify(row));
      this.fmlDialogVisible = true;
    },

    opFinished(flag) {
      if (flag) {
        this.getFormulationList();
        this.fmlDialogVisible = false;
      }

    },

    treeDataProcess(data) {
      if (!data.children.length) {
        delete data.children;
        return;
      }
      data.children.forEach(child => this.treeDataProcess(child));
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.groupName.indexOf(value) !== -1;
    }
  },

  mounted() {
    this.getGroupList();
    this.getFormulationList();
  },

  render(createElement, context) {
    return createElement('div', {
      class: {

      }
    })
  }

}
</script>

<style scoped lang="scss">

</style>
