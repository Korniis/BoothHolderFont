import { createRouter, createWebHistory } from 'vue-router'
import LayoutView from '@/views/main/LayoutView.vue'
import HomeView from '@/views/main/HomeView.vue'
import BoothListView from '@/views/main/BoothListView.vue';
import BoothInfoView from '@/views/main/BoothInfoView.vue';
import UserInfoView from '@/views/user/userinfo/UserInfoView.vue';
import UserLayoutView from '@/views/user/userinfo/UserLayout.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:'/',component:LayoutView,redirect:'/home',
      //子路由
      children:[
          {path:'/home',component:HomeView},

          {path:'/booth',component:BoothListView},
          {path:'/booth/details',component:BoothInfoView},

      ]},
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
    {path:'/user',component:UserLayoutView,redirect:'/user/profile',
      children:[
        {path:'profile',component:UserInfoView},
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
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // 或 sessionStorage.getItem('token')

  // 判断目标路由是否是 /user 下的路由
  if (to.path.startsWith('/user') && !token) {
    // 如果没有 token，重定向到登录页面
    next('/login');
  } else {
    // 有 token 或者不是 /user 路由，允许继续访问
    next();
  }
});
export default router
