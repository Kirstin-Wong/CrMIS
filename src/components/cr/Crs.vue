<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文物管理</el-breadcrumb-item>
      <el-breadcrumb-item>文物列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加与搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入文物名称" v-model="queryInfo.query" clearable @clear="getCrsList">
            <el-button slot="append" icon="el-icon-search" @click="getCrsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddCr">添加文物</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- table表格区域 -->
    <el-table :data="crsList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="编号" prop="CrId" width="60px"></el-table-column>
      <el-table-column label="名称" prop="CrName" width="100px"></el-table-column>
      <el-table-column label="照片">
        <template slot-scope="scope">
          <img :src="baseUrl + scope.row.CrPic[0].split(',')[0]" style="width: 90px;height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="分类">
        <template slot-scope="scope" >
          <div v-for="(crClassify, index) in crClassifyOptions" :key="index">
            <span  v-if="crClassify.CrClassifyId == scope.row.CrClassifyId">{{ crClassify.CrClassifyName }}</span>
          </div>      
        </template>
      </el-table-column>
      <el-table-column label="年代" prop="CrAge"></el-table-column>
      <el-table-column label="归属" width="60px">
        <template slot-scope="scope">
          <span v-if="scope.row.CrBelong == 0" size="mini">自有</span>
          <span v-if="scope.row.CrBelong == 1" size="mini" type="danger">外借</span>
        </template>
      </el-table-column>
      <el-table-column label="参数" prop="CrParameter"></el-table-column>
      <el-table-column label="展览" prop="ExhibitionId">
        <template slot-scope="scope">
          <div v-for="(exhibition, index) in exhibitionOptions" :key="index">
            <span  v-if="exhibition.ExhibitionId == scope.row.ExhibitionId">{{ exhibition.ExhibitionName }}</span>
          </div>      
        </template>
      </el-table-column>
      <el-table-column label="介绍" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.CrIntro | ellipsis }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCrsById(scope.row.CrId)"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCrsById(scope.row.CrId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      crsList: [],
      total: 0,
      baseUrl: 'http://127.0.0.1:3000/',
      crClassifyOptions: [],
      exhibitionOptions: [],
    }
  },
  created() {
    this.getCrOptions(),
    this.getExhibitionOptions(),
    this.getCrsList()
  },
  methods: {
    async getCrsList() {
      const { data: res } = await this.$http.get('crs', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('文物列表获取失败！')
      }
      this.$message.success('文物列表获取成功！')
      this.crsList = res.data[0]
      this.total = res.total
    },
    goAddCr() {
      this.$router.push('/addCr')
    },
    async removeCrsById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文物, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      var params = new URLSearchParams()
      params.append('CrId', id)
      console.log(id)
      const { data: res } = await this.$http({
        method: 'post',
        url: 'delCr',
        data: params
      })
      if (res.meta.status !== 200) {
        return this.$message.error('文物删除获取失败！')
      }
      this.$message.success('文物删除获取成功！')
      this.getCrsList()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCrsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCrsList()
    },
    editCrsById(id) {
      this.$router.push({ path: '/addCr', query: { id: id } })
    },
    // 获取文物分类
    async getCrOptions() {
      const { data: res } = await this.$http.get('crClassify')
      this.crClassifyOptions = res.data[0]
    },
    // 获取展览
    async getExhibitionOptions() {
      const { data: res } = await this.$http.get('exhibition')
      this.exhibitionOptions = res.data[0]
    }
  },
}
</script>
<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>
