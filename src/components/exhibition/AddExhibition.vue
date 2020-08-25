<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>展览管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="!edit">添加展览</el-breadcrumb-item>
      <el-breadcrumb-item v-else>修改展览</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="展览信息" type="info" center show-icon :closable="false"></el-alert>

      <el-form :model="addForm" label-position="top" ref="addFormRef" label-width="100px" :rules="addFormRules">
        <!-- tab区域 -->
        <el-tabs :tab-position="'left'">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="展览编号" prop="ExhibitionId">
              <el-input v-model="addForm.ExhibitionId" :readonly="edit"></el-input>
            </el-form-item>
            <el-form-item label="展览名称" prop="ExhibitionName">
              <el-input v-model="addForm.ExhibitionName"></el-input>
            </el-form-item>
            <el-form-item label="展厅" prop="ShowroomId">
              <el-select v-model="addForm.ShowroomId" multiple>
                <el-option v-for="item in showroomOptions" :key="item.ShowroomId" :label="item.Location" :value="item.ShowroomId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型" prop="ExhibitionClassifyId">
              <el-select v-model="addForm.ExhibitionClassifyId">
                <el-option v-for="item in exhibitionClassifyOptions" :key="item.ExhibitionClassifyId" :label="item.ExhibitionClassifyName" :value="item.ExhibitionClassifyId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="展期" prop="ShowTime">
              <el-input v-model="addForm.ShowTime"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="Director">
              <el-input v-model="addForm.Director"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="1">
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="文物说明" name="2">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.ExhibitionIntro"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="addExhibition" v-if="!edit">添加展览</el-button>
            <el-button type="primary" class="btnAdd" @click="addExhibition" v-else>修改展览</el-button>
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
        ExhibitionId: '',
        ExhibitionName: '',
        ExhibitionIntro: '',
        ExhibitionClassifyId: '',
        ShowroomId: [],
        ExhibitionPic: [],
        ShowTime: '',
        Director: ''
      },
      uploadURL: 'http://127.0.0.1:3000/upload',
      //   图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false,
      addFormRules: {
        ExhibitionId: [{ required: true, message: '请输入展览编号', trigger: 'blur' }],
        ExhibitionName: [{ required: true, message: '请输入展览名称', trigger: 'blur' }],
      },
      showroomOptions: [],
      exhibitionClassifyOptions: [],
      edit: false
    }
  },
  created() {
    this.init()
    this.getShowroomOptions(),
    this.getExhibitionClassifyOptions()
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
      const i = this.addForm.ExhibitionPic.findIndex(x => x.pic === filePath)
      this.addForm.ExhibitionPic.splice(i, 1)
    },
    // 监听图片上传
    handleSuccess(response) {
      // 1.拼接得到一个图片信息对象
      // console.log(response)
      const picInfo = { pic: response.tmp_path }
      // 2.push到数组pics中
      this.addForm.ExhibitionPic.unshift(response.tmp_path)
    },
    // 初始化
    async init() {
      const id = this.$route.query.id
      if(id) {
        const { data: res } = await this.$http.get('editExhibition', {  
          params: {         
            editId: id 
          }
        })
        this.addForm = res.data[0][0]
        this.edit = true
      }
    },
    // 添加文物
    async addExhibition() {
      this.$refs.addFormRef.validate(async valid => {
        this.addForm.ExhibitionIntro = this.addForm.ExhibitionIntro.replace(/<[^>]+>|&[^>]+;/g, "")
        var params = new URLSearchParams()
        params.append('ExhibitionId', this.addForm.ExhibitionId)
        params.append('ExhibitionName', this.addForm.ExhibitionName)
        params.append('ExhibitionClassifyId', this.addForm.ExhibitionClassifyId)
        params.append('ExhibitionIntro', this.addForm.ExhibitionIntro)
        params.append('ShowroomId', this.addForm.ShowroomId.toString())
        params.append('ExhibitionPic', this.addForm.ExhibitionPic)
        params.append('ShowTime', this.addForm.ShowTime)
        params.append('Director', this.addForm.Director)
        params.append('edit', this.edit)
        const { data: res } = await this.$http({
          method: 'post',
          url: 'addExhibition',
          data: params
        })
        if (res.meta.status !== 200) {
          return this.$message.error('添加商品失败失败')
        }
        this.$message.success('添加商品成功！')
        this.edit = false
        this.$router.push('/exhibitions')
        console.log(res)
        
      })
      // console.log('没通过')
    },
    // 获取文物分类
    async getShowroomOptions() {
      const { data: res } = await this.$http.get('showrooms')
      this.showroomOptions = res.data[0];
    },
    // 获取展览分类
    async getExhibitionClassifyOptions() {
        console.log('a')
        const { data: res } = await this.$http.get('exhibitionClassify')
        this.exhibitionClassifyOptions = res.data[0];
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
