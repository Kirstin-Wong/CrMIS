<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/header-logo2.png" alt="" />
        <span>博物馆文物官网后台管理系统</span>
      </div>
      <el-button type="info" @click="logout" size="small">退出</el-button></el-header
    >
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" 
        unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [
        { authName: '文物管理', children: [
          { authName: '文物列表', children: [], id: 110, order: null, path: 'crs' },
          { authName: '文物分类', children: [], id: 123, order: null, path: 'CrClassify' },], id: 105, order: 1, path: 'crs' },
        { authName: '展览管理', children: [{ authName: '展览列表', children: [], id: 110, order: null, path: 'exhibitions' }], id: 106, order: 1, path: 'exhibitions' },
        { authName: '管理员管理', children: [{ authName: '管理员列表', children: [], id: 110, order: null, path: 'admins' },
        { authName: '权限列表', children: [], id: 123, order: null, path: 'rights' }], id: 100, order: 1, path: 'admins' },
        { authName: '新闻管理', children: [{ authName: '新闻列表', children: [], id: 110, order: null, path: 'news' }], id: 104, order: 1, path: 'news' },
        { authName: '数据统计', children: [{ authName: '数据报表', children: [], id: 110, order: null, path: 'reports' }], id: 103, order: 1, path: 'reports' },
       
        
      ],
      iconsObj: {
        '100': 'iconfont icon-yonghu',
        '101': 'iconfont icon-yonghu1',
        '102': 'iconfont icon-liuyan',
        '103': 'iconfont icon-shujutongji',
        '104': 'iconfont icon-xinwen',
        '105': 'iconfont icon-wenwu',
        '106': 'iconfont icon-zhanlan',
      },
      isCollapse: false,
      activePath: ''
    }
  },
  // 生命周期函数
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout: function() {
      window.sessionStorage.clear()
      this.$router.push('/')
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      margin-left: 5px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  color: #fff;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
