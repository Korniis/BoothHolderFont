<template>
  <div class="common-layout">
    <HeaderBar></HeaderBar>
    <el-container>
      <el-aside class="side-aside" router width="200px">
        <el-menu :default-active="activeMenu"  router class="side-menu" @seleuct="handleSelect">
          <el-menu-item index="/user/personal-info">个人信息</el-menu-item>
          <el-menu-item v-if="isAdmin" index="/user/mybooth" >我的摊位</el-menu-item>
          <el-menu-item index="3" :route="{ path: 'message-center' }">消息中心</el-menu-item>
          <el-menu-item index="4" :route="{ path: 'settings' }">设置</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import HeaderBar from '@/components/HeaderBar.vue';
import { useUserStore } from '@/stores/userstore';
import { jwtDecode } from 'jwt-decode';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeMenu = ref ('/user/personal-info'); // 默认选中第一个菜单


const isAdmin=ref('');


const handleSelect = (index) => {
  console.log(index); // 处理菜单项选择逻辑
  activeMenu.value=index
};

onMounted(()=>{
  console.log(route.path);
  activeMenu.value=route.path;
  const decodeJwt = jwtDecode(useUserStore().userinfo.token);
  const roles = decodeJwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // 获取用户角色
  isAdmin.value= roles && roles.includes("Admin"); // 检查 roles 数组中是否包含 'admin'
})
</script>

<style scoped>
.common-layout {

  width: 100%;
  background-image: url(../../../assets/images/background.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}
.side-aside {
  height: 100vh;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
}
.side-menu {
  flex-grow: 1;
  background-color: #f4f4f4;
}
</style>
