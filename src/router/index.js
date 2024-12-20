import { createRouter, createWebHistory } from 'vue-router'
import LayoutView from '@/views/main/LayoutView.vue'
import HomeView from '@/views/main/HomeView.vue'
import BoothListView from '@/views/main/BoothListView.vue';
import BoothInfoView from '@/views/main/BoothInfoView.vue';
import UserInfoView from '@/views/user/userinfo/UserInfoView.vue';
import UserLayoutView from '@/views/user/userinfo/UserLayout.vue'
import UserOrderView from '@/views/user/userinfo/UserOrderView.vue';
import { jwtDecode } from 'jwt-decode';
import { ElMessage } from 'element-plus';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', component: LayoutView, redirect: '/home',
      //子路由
      children: [
        { path: '/home', component: HomeView },

        { path: '/booth', component: BoothListView },
        { path: '/booth/details', component: BoothInfoView },

      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/user/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/user/auth/RegisterView.vue'),
    },
    {
      path: '/user', component: UserLayoutView, redirect: '/user/personal-info',
      children: [
        { path: 'personal-info', component: UserInfoView },
        { path: 'mybooth', component: UserOrderView },
      ]
    },



    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/main/AboutView.vue'),
    },
  ],

})
// 全局路由守卫
// 全局路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // 或 sessionStorage.getItem('token')



  if (!token) {
    if (to.path.startsWith('/user')) {
      next('/login'); // 如果访问的是 /user 路由，重定向到登录页面
    } else {

      next(); // 其他路由继续访问
    }
    return; // 提前返回，避免继续执行后续逻辑
  }

  const decodeJwt = jwtDecode(token);
  const roles = decodeJwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // 获取用户角色
  const isAdmin = roles && roles.includes("Admin"); // 检查 roles 数组中是否包含 'admin'

  // 权限检查：如果访问的是需要管理员权限的路由A
  if (to.path.startsWith("/user/mybooth") && !isAdmin) {
    ElMessage.error("无权限");
    next('/'); // 没有权限时重定向到首页或其他页面
  } else {
    next(); // 其他情况继续访问
  }

});
export default router
