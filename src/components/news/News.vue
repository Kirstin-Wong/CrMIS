<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>新闻管理</el-breadcrumb-item>
      <el-breadcrumb-item>新闻列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加与搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加新闻</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="newsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="标题" prop="title" width="200px"></el-table-column>
        <el-table-column label="内容" prop="content"></el-table-column>
        <el-table-column label="时间" prop="time" width="200px"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editNews(scope.row)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeNewsById(scope.row.newsId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog :title="`${isEdit == true? '修改':'添加'}新闻`" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <el-form :model="addForm" label-position="top" ref="addFormRef" label-width="100px" :rules="addFormRules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" type="text"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-input v-model="addForm.time" type="date" placeholder="请选择日期" suffix-icon="el-icon-date"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="addForm.content" type="textarea" placeholder="请输入内容" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNews">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      newsList: [],
      addDialogVisible: false,
      addForm: {
        newsId: '',
        title: '',
        content: '',
        time: ''
      },
      addFormRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        time: [{ required: true, message: '请输入时间', trigger: 'blur' }]
      },
      isEdit: false
    }
  },
  created() {
    this.getNewsList()
  },
  methods: {
    async getNewsList() {
      const { data: res } = await this.$http.get('news')
      if (res.meta.status !== 200) {
        return this.$message.error('新闻列表获取失败！')
      }
      this.$message.success('新闻列表获取成功！')
      this.newsList = res.data[0]
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    async removeNewsById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      var params = new URLSearchParams()
      params.append('newsId', id)
      const { data: res } = await this.$http({
        method: 'post',
        url: 'removeNews',
        data: params
      })
      if (res.meta.status !== 200) {
        return this.$message.error('删除管理员失败')
      }
      this.$message.success('删除管理员成功！')
      this.getNewsList()
    },
    async addNews() {
      this.$refs.addFormRef.validate(async valid => {
        console.log(this.isEdit)
        var params = new URLSearchParams()
        params.append('newsId', this.addForm.newsId)
        params.append('title', this.addForm.title)
        params.append('content', this.addForm.content)
        params.append('time', this.addForm.time.split('-').join('/'))
        params.append('isEdit', this.isEdit)
        const { data: res } = await this.$http({
          method: 'post',
          url: 'addNews',
          data: params
        })
        if (res.meta.status !== 200) {
          return this.$message.error('添加管理员失败')
        }
        this.$message.success('添加管理员成功！')
        this.addDialogVisible = false
        this.isEdit = false
        this.getNewsList()
      })
    },
    editNews(news) {
      this.isEdit = true
      this.addForm = news
      this.addForm.time = news.time.split('/').join('-')
      this.addDialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
.el-form {
  width: 580px;
  margin: 0 auto;
}
</style>
