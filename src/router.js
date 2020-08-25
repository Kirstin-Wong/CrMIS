import Vue from 'vue'
import Router from 'vue-router'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Login.vue')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Home.vue')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Welcome.vue')
// import Login from './components/Login.vue'
// import Home from './components/Home.vue'
// import Welcome from './components/Welcome.vue'
const Crs = () => import(/* webpackChunkName:"login_home_welcome" */ './components/cr/Crs.vue')
const CrClassify = () => import(/* webpackChunkName:"login_home_welcome" */ './components/cr/CrClassify.vue')
const AddCr = () => import(/* webpackChunkName:"login_home_welcome" */ './components/cr/AddCr.vue')
// import Crs from './components/cr/Crs.vue'
// import CrClassify from './components/cr/CrClassify.vue'
// import AddCr from './components/cr/AddCr.vue'
const Exhibitions = () => import(/* webpackChunkName:"login_home_welcome" */ './components/exhibition/Exhibitions.vue')
const AddExhibition = () => import(/* webpackChunkName:"login_home_welcome" */ './components/exhibition/AddExhibition.vue')
// import Exhibitions from './components/exhibition/Exhibitions.vue'
// import AddExhibition from './components/exhibition/AddExhibition.vue'
const News = () => import(/* webpackChunkName:"login_home_welcome" */ './components/news/News.vue')
// import News from './components/news/News.vue'
const Admins = () => import(/* webpackChunkName:"login_home_welcome" */ './components/admin/Admins.vue')
const Rights = () => import(/* webpackChunkName:"login_home_welcome" */ './components/admin/Rights.vue')
// import Admins from './components/admin/Admins.vue'
// import Rights from './components/admin/Rights.vue'
const Reports = () => import(/* webpackChunkName:"login_home_welcome" */ './components/report/Reports.vue')
// import Reports from './components/report/Reports.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/news', component: News },
        { path: '/admins', component: Admins },
        { path: '/rights', component: Rights },
        { path: '/exhibitions', component: Exhibitions },
        { path: '/addExhibition', component: AddExhibition },
        { path: '/crs', component: Crs },
        { path: '/crClassify', component: CrClassify },
        { path: '/addCr', component: AddCr },
        { path: '/reports', component: Reports }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
