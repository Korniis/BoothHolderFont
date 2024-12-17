import { createRouter, createWebHistory } from 'vue-router'
import LayoutView from '@/views/main/LayoutView.vue'
import HomeView from '@/views/main/HomeView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:'/',component:LayoutView,redirect:'/home',
      //子路由
      children:[
          {path:'/home',component:HomeView},
      ]},
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/user/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/user/RegisterView.vue'),
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
  beforeRouteUpdate(to, from, next) {
    // 在路由更新时强制刷新
    this.$router.replace({ path: to.path, query: { refresh: Date.now() } });
    next();
  }
})
export default router
