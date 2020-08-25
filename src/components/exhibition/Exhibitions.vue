<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>展览管理</el-breadcrumb-item>
      <el-breadcrumb-item>展览列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加与搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入展览名称" clearable @clear="getExhibitions" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getExhibitions"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddExhibition">添加展览</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="exhibitionsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="编号" prop="ExhibitionId" width="80px"></el-table-column>
        <el-table-column label="名称" prop="ExhibitionName" width="200px"></el-table-column>
        <el-table-column label="照片">
            <template slot-scope="scope">
                <img :src="baseUrl + scope.row.ExhibitionPic[0].split(',')[0]" style="width: 90px;height: 120px" />
            </template>
        </el-table-column>
        <el-table-column label="展厅">
            <template slot-scope="scope">
            <div v-for="(showroom, index) in showroomOptions" :key="index">
                <div v-for="(ShowroomId, index) in scope.row.ShowroomId.split(',')" :key="index">
                     <span v-if=" showroom.ShowroomId == ShowroomId">{{ showroom.Location }}</span>
                </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="展期" prop="ShowTime" width="150px"></el-table-column>
        <el-table-column label="类型" width="150px">
          <template slot-scope="scope">
            <div v-for="(exhibitionClassify, index) in exhibitionClassifyOptions" :key="index">
              <span v-if="exhibitionClassify.ExhibitionClassifyId == scope.row.ExhibitionClassifyId">{{ exhibitionClassify.ExhibitionClassifyName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="介绍" width="350px">
          <template slot-scope="scope">
            <span>{{ scope.row.ExhibitionIntro | ellipsis }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editExhibitionById(scope.row.ExhibitionId)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeExhibitionById(scope.row.ExhibitionId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      exhibitionsList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      baseUrl: 'http://127.0.0.1:3000/',
      showroomOptions: [],
      exhibitionClassifyOptions: []
    }
  },
  created() {
    this.getExhibitions()
    this.getShowroomOptions()
    this.getExhibitionClassifyOptions()
  },
  methods: {
    async getExhibitions() {
        const { data: res } = await this.$http.get('exhibitions', {
            params: this.queryInfo
        })
        if (res.meta.status !== 200) {
            return this.$message.error('展览列表获取失败！')
        }
        this.$message.success('展览列表获取成功！')
        this.exhibitionsList = res.data[0]
        this.total = res.total
    },
    goAddExhibition() {
      this.$router.push('/addExhibition')
    },
    async removeExhibitionById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该展览, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      var params = new URLSearchParams()
      params.append('ExhibitionId', id)
      const { data: res } = await this.$http({
        method: 'post',
        url: 'delExhibition',
        data: params
      })
      if (res.meta.status !== 200) {
        return this.$message.error('展厅删除获取失败！')
      }
      this.$message.success('展厅删除获取成功！')
      this.getExhibitions()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getExhibitions()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getExhibitions()
    },
    editExhibitionById(id) {
      this.$router.push({ path: '/addExhibition', query: { id: id } })
    },
    // 获取文物分类
    async getShowroomOptions() {
      const { data: res } = await this.$http.get('showrooms')
      this.showroomOptions = res.data[0];
    },
    // 获取展览分类
    async getExhibitionClassifyOptions() {
        const { data: res } = await this.$http.get('exhibitionClassify')
        this.exhibitionClassifyOptions = res.data[0]
    }
  }
}
</script>
<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>
