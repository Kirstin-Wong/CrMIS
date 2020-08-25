<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- table表格区域 -->
      <el-table :data="positions" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="职位名称" prop="PositionName"></el-table-column>
        <el-table-column label="职位描述" prop="Description"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 分配权限 -->
            <el-button type="danger" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
    title="分配权限"
    :visible.sync="setRightDialogVisible"
    width="50%" @close="setRightDialogClosed">
        <!-- 树形控件 -->
        <el-tree ref="treeRef" :data="rightsList" :props="treeProps" show-checkbox node-key="rightId" default-expand-all :default-checked-keys="defKeys"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      positions: [],
      setRightDialogVisible: false,
      roleId: '',
      // 获取所有权限的数据
      rightsList: [],
      treeProps: {
          label: 'rightName',
          children: 'children'
      },
      defKeys: [],
    }
  },
  created() {
    this.getPositions()
  },
  methods: {
    async getPositions() {
      const { data: res } = await this.$http.get('positions')
      this.positions = res.data[0]
    },
    async showSetRightDialog(role) {
        this.roleId = role.PositionId
        // 获取所有权限的数据
        const { data: res } = await this.$http.get('rights')
        if (res.meta.status !== 200) {
            return this.$message.error('获取权限数据失败')
        }
        this.rightsList = res.data[0]
        // 获得递归三级节点的id
        this.getLeafKeys(role,this.defKeys)
        this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
        if(!node.children){
            return arr.push(node.rightId)
        }
        node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭
    setRightDialogClosed() {
        this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
        const keys = [ ...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys() ]
        // const idStr = keys.join(',')
        // console.log(idStr)
        var params = new URLSearchParams()
        params.append('rids', keys)
        const{ data: res } = await this.$http({
          method: 'post',
          url: `positions/${this.roleId}/rights`,
          data: params
        })
        if (res.meta.status !== 200) {
            return this.$message.error('分配权限失败')
        }
        this.$message.success('分配权限成功！')
        this.getPositions()
        this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped></style>
