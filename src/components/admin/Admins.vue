<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加与搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加管理员</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="adminsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="工号" prop="AdminId" width="80px"></el-table-column>
        <el-table-column label="姓名" prop="AdminName" width="200px"></el-table-column>
        <el-table-column label="手机号" prop="Mobile" width="350px"></el-table-column>
        <el-table-column label="邮箱" prop="Email"></el-table-column>
        <el-table-column label="职位">
          <template slot-scope="scope">
            <div v-for="position in positions" :key="position.PositionId">
              <span v-if="position.PositionId == scope.row.Position">{{ position.PositionName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="地址" prop="Address"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAdminById(scope.row.AdminId)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAdminById(scope.row.AdminId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="`${isEdit == true? '修改':'添加'}管理员信息`" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addAdminFormRef" label-width="70px">
        <el-form-item label="工号" prop="AdminId" label-width="100px">
          <el-input v-model="addForm.AdminId"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="AdminName" label-width="100px">
          <el-input v-model="addForm.AdminName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="AdminPwd" label-width="100px">
          <el-input v-model="addForm.AdminPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="Mobile" label-width="100px">
          <el-input v-model="addForm.Mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="Email" label-width="100px">
          <el-input v-model="addForm.Email"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="Position" label-width="100px">
          <el-select v-model="addForm.Position">
            <el-option v-for="item in positions" :key="item.PositionId" :label="item.PositionName" :value="item.PositionId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="Address" label-width="100px">
          <el-cascader expandTrigger="hover" v-model="addForm.Address" :options="citys" :props="cityProps"></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdmin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //   验证邮箱的校验规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        //   合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    //   验证手机号规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        //   合法的手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      adminsList: [],
      addDialogVisible: false,
      addFormRules: {
        AdminId: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        AdminName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        AdminPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 至 15 个字符', trigger: 'blur' }
        ],
        Mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        Email: [{ validator: checkEmail, trigger: 'blur' }]
      },
      addForm: {
        AdminId: '',
        AdminName: '',
        AdminPwd: '',
        Mobile: '',
        Email: '',
        Position: '',
        Address: []
      },
      edit: false,
      positions: [],
      cityProps: {
        label: 'name',
        value: 'name',
        children: 'city'
      },
      citys: [],
      isEdit: false,
    }
  },
  created() {
    this.getAdminsList()
    this.getPositions()
    this.getCitys()
  },
  methods: {
    async getAdminsList() {
      const { data: res } = await this.$http.get('admins')
      if (res.meta.status !== 200) {
        return this.$message.error('管理员列表获取失败！')
      }
      this.$message.success('管理员列表获取成功！')
      this.adminsList = res.data[0]
    },
    async removeAdminById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      var params = new URLSearchParams()
      params.append('AdminId', id)
      const { data: res } = await this.$http({
        method: 'post',
        url: 'removeAdmin',
        data: params
      })
      if (res.meta.status !== 200) {
        return this.$message.error('删除管理员失败')
      }
      this.$message.success('删除管理员成功！')
      this.getAdminsList()
    },
    addDialogClosed() {
      this.$refs.addAdminFormRef.resetFields()
      this.isEdit = false
    },
    addAdmin() {
      this.$refs.addAdminFormRef.validate(async valid => {
        var params = new URLSearchParams()
        params.append('AdminId', this.addForm.AdminId)
        params.append('AdminName', this.addForm.AdminName)
        params.append('AdminPwd', this.addForm.AdminPwd)
        params.append('Mobile', this.addForm.Mobile)
        params.append('Email', this.addForm.Email)
        params.append('Position', this.addForm.Position)
        params.append('Address', this.addForm.Address)
        params.append('isEdit', this.isEdit)
        const { data: res } = await this.$http({
          method: 'post',
          url: 'addAdmin',
          data: params
        })
        if (res.meta.status !== 200) {
          return this.$message.error('添加管理员失败')
        }
        this.$message.success('添加管理员成功！')
        this.addDialogVisible = false
        this.isEdit = false
        this.getAdminsList()
      })
    },
    async getPositions() {
      const { data: res } = await this.$http.get('positions')
      this.positions = res.data[0]
    },
    async getCitys() {
      const { data: res } = await this.$http.get('citys')
      this.citys = res.data[0]
    },
    async editAdminById(id) { 
      this.isEdit = true
      this.addDialogVisible = true
      const { data: res } = await this.$http.get('admin', {
        params: {
          editId: id
        }
      })
      this.addForm = res.data[0]
      this.addForm.Address = this.changeDetSelect(res.data[0].Address[0].split(',')[1],this.citys) 
    },
    changeDetSelect(key, treeData) {
      let arr = [] // 在递归时操作的数组
      let returnArr = [] // 存放结果的数组
      let depth = 0 // 定义全局层级
      // 定义递归函数
      function childrenEach(childrenData, depthN) {
        for (var j = 0; j < childrenData.length; j++) {
          depth = depthN // 将执行的层级赋值 到 全局层级
          arr[depthN] = childrenData[j].name
          if (childrenData[j].name == key) {
            returnArr = arr.slice(0, depthN + 1) //将目前匹配的数组，截断并保存到结果数组，
            console.log(returnArr)
            break
          } else {
            if (childrenData[j].city) {
              depth++
              childrenEach(childrenData[j].city, depth)
            }
          }
        }
        return returnArr
      }
      return childrenEach(treeData, depth)
    }
  }
}
</script>
<style lang="less" scoped></style>
