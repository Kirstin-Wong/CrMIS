<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文物管理</el-breadcrumb-item>
      <el-breadcrumb-item>文物分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="时代" name="time">
          <tree-table :data="crTimeList" :columns="columns" :expand-type="false" :selection-type="false" 
            show-index index-text="#" border :show-row-hover="false">
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.CrTimeClassifyLevel== '0'" size="mini">一级</el-tag>
                    <el-tag v-else-if="scope.row.CrTimeClassifyLevel== '1'"  size="mini" type="success">二级</el-tag>
                    <el-tag v-else size="mini" type="warning">三级</el-tag>
                </template>
            </tree-table>
        </el-tab-pane>
        <el-tab-pane label="用途" name="use">
          <el-button type="primary" size="mini" @click="addDialogVisible = true">添加分类</el-button>
          <el-table :data="crClassifyList" border stripe>
            <el-table-column type="index" width="50px"></el-table-column>
            <el-table-column label="分类编号" prop="CrClassifyId"></el-table-column>
            <el-table-column label="分类名称" prop="CrClassifyName"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addCrClassifyFormRef" label-width="70px">
        <el-form-item label="分类编号" prop="CrClassifyId" label-width="100px">
          <el-input v-model="addForm.CrClassifyId" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="CrClassifyName" label-width="100px">
          <el-input v-model="addForm.CrClassifyName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClassify">确 定</el-button>
      </span>
    </el-dialog>
    

  </div>
</template>
<script>
export default {
  data() {
    return {
      crClassifyList: [],
      addDialogVisible: false,
      addForm: {},
      total: '',
      activeName: 'time',
      addFormRules: {
        CrClassifyName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
      },
      crTimeList: [],
      columns: [
        {
            label: '分类名称',
            prop: 'CrTimeClassifyName'
        },{
            label: "排序",
            // 表示当前列定义为模板列
            type: "template",
            // 表示当前列使用的模板名称
            template: "order"
        }
      ],
    }
  },
  created() {
    this.getCrClassifyList()
    this.getCrTimeClassifyList()
  },
  methods: {
    async getCrClassifyList() {
      const { data: res } = await this.$http.get('crClassify')
      if (res.meta.status !== 200) {
        return this.$message.error('文物分类列表获取失败！')
      }
      this.$message.success('文物分类列表获取成功！')
      this.crClassifyList = res.data[0]
      this.total = res.data[0].length
      this.addForm.CrClassifyId = Number(this.total) + 1 < 10 ? '0' + (Number(this.total) + 1) : Number(this.total) + 1
    },
    addClassify() {
      this.$refs.addCrClassifyFormRef.validate(async valid => {
        if (!valid) return
        var params = new URLSearchParams()
        params.append('CrClassifyId', this.addForm.CrClassifyId)
        params.append('CrClassifyName', this.addForm.CrClassifyName)
        const { data: res } = await this.$http({
          method: 'post',
          url: 'addCrClassify',
          data: params
        })
        if (res.meta.status !== 200) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功！')
        this.addDialogVisible = false
        this.getCrClassifyList()
        
      })
    },
    addDialogClosed() {
      this.$refs.addCrClassifyFormRef.resetFields()
    },
    // 获取时代分类
    async getCrTimeClassifyList() {
      const { data: res } = await this.$http.get('crTimeClassify')
      if (res.meta.status !== 200) {
        return this.$message.error('文物分类列表获取失败！')
      }
      this.$message.success('文物分类列表获取成功！')
      this.crTimeList = res.data[0]
      console.log(this.crTimeList)
    },
    async deleteCrTimeClassify(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      var params = new URLSearchParams()
      params.append('CrTimeClassifyId', id)
      console.log(params)
      const { data: res } = await this.$http({
        method: 'post',
        url: 'crTimeClassify',
        data: params
      })
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除分类成功！')
      
    }
  }
}
</script>
<style lang="less" scoped></style>
