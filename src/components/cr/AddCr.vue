<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文物管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="!edit">添加文物</el-breadcrumb-item>
      <el-breadcrumb-item v-else>修改文物</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="文物信息" type="info" center show-icon :closable="false"></el-alert>

      <el-form :model="addForm" label-position="top" ref="addFormRef" label-width="100px" :rules="addFormRules">
        <!-- tab区域 -->
        <el-tabs :tab-position="'left'">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="文物编号" prop="CrId">
              <el-input v-model="addForm.CrId" :readonly="edit"></el-input>
            </el-form-item>
            <el-form-item label="文物名称" prop="CrName">
              <el-input v-model="addForm.CrName"></el-input>
            </el-form-item>
            <el-form-item label="文物年代" prop="CrAge">
              <el-input v-model="addForm.CrAge"></el-input>
            </el-form-item>
            <el-form-item label="详细参数" prop="CrParameter">
              <el-input v-model="addForm.CrParameter"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="文物属性" name="1">
            <el-form-item label="文物归属" prop="CrBelong">
              <el-radio v-model="addForm.CrBelong" label="0">自有</el-radio>
              <el-radio v-model="addForm.CrBelong" label="1">外借</el-radio>
            </el-form-item>
            <el-form-item label="文物分类" prop="CrClassifyId">
              <el-select v-model="addForm.CrClassifyId">
                <el-option v-for="item in crClassifyOptions" :key="item.CrClassifyId" :label="item.CrClassifyName" :value="item.CrClassifyId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="展览" prop="ExhibitionId">
              <el-select v-model="addForm.ExhibitionId">
                <el-option v-for="item in exhibitionOptions" :key="item.ExhibitionId" :label="item.ExhibitionName" :value="item.ExhibitionId"></el-option>
              </el-select>
            </el-form-item>           
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="2">
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="文物说明" name="3">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.CrIntro"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="addCr" v-if="!edit">添加文物</el-button>
            <el-button type="primary" class="btnAdd" @click="addCr" v-else>修改文物</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      addForm: {
        CrId: '',
        CrName: '',
        CrAge: '',
        CrClassifyId: '',
        CrBelong: '',
        CrIntro: '',
        CrParameter: '',
        CrPic: [],
        ExhibitionId: '',
        CrDirector: '',
      },
      uploadURL: 'http://127.0.0.1:3000/upload',
      //   图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false,
      addFormRules: {
        CrId: [{ required: true, message: '请输入文物编号', trigger: 'blur' }],
        CrName: [{ required: true, message: '请输入文物名称', trigger: 'blur' }],
        CrAge: [{ required: true, message: '请输入文物时代', trigger: 'blur' }],
        CrParameter: [{ required: true, message: '请输入文物参数', trigger: 'blur' }]
      },
      crClassifyOptions: [],
      exhibitionOptions: [],
      edit: false
    }
  },
  created() {
    this.init()
    this.getCrOptions(),
    this.getExhibitionOptions()
  },
  methods: {
    // 处理图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.CrPic.findIndex(x => x.pic === filePath)
      this.addForm.CrPic.splice(i, 1)
    },
    // 监听图片上传
    handleSuccess(response) {
      // 1.拼接得到一个图片信息对象
      // console.log(response)
      const picInfo = { pic: response.tmp_path }
      // 2.push到数组pics中
      this.addForm.CrPic.unshift(response.tmp_path)
    },
    // 初始化
    async init() {
      const id = this.$route.query.id
      if(id) {
        const { data: res } = await this.$http.get('editCr', {  
          params: {         
            editId: id 
          }
        })
        this.addForm = res.data[0][0]
        this.edit = true
      }
    },
    // 添加文物
    async addCr() {
      this.$refs.addFormRef.validate(async valid => {
        this.addForm.CrIntro = this.addForm.CrIntro.replace(/<[^>]+>|&[^>]+;/g, "")
        var params = new URLSearchParams()
        params.append('CrId', this.addForm.CrId)
        params.append('CrName', this.addForm.CrName)
        params.append('CrAge', this.addForm.CrAge)
        params.append('CrClassifyId', this.addForm.CrClassifyId)
        params.append('CrBelong', this.addForm.CrBelong)
        params.append('CrIntro', this.addForm.CrIntro)
        params.append('CrPic', this.addForm.CrPic)
        params.append('ExhibitionId', this.addForm.ExhibitionId)
        params.append('CrParameter', this.addForm.CrParameter)
        params.append('edit', this.edit)
        const { data: res } = await this.$http({
          method: 'post',
          url: 'addCr',
          data: params
        })
        if (res.meta.status !== 200) {
          return this.$message.error('添加文物失败')
        }
        this.$message.success('添加文物成功！')
        this.edit = false
        this.$router.push('/crs')
        
      })
      // console.log('没通过')
    },
    // 获取文物分类
    async getCrOptions() {
      const { data: res } = await this.$http.get('crClassify')
      this.crClassifyOptions = res.data[0];
    },
    // 获取展览分类
    async getExhibitionOptions() {
      console.log('a')
      const { data: res } = await this.$http.get('exhibition')
      this.exhibitionOptions = res.data[0];
    }
  }
}
</script>
<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
