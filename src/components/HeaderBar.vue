<template>
  <div class="header-content">
    <div class="header-logo">
      <a style="height: 60px;" href="/">
        <img style="height: 60px; width: auto;" src="/public/Logo/Logo.ico" />
      </a>
    </div>
    <div class="gradient-text">
      家居商场摊位招商宣介平台
    </div>
    <div>
    <div  v-if="userstore.userinfo.token" class="header-menu">
        {{ userstore.userinfo.username }}
        <div class="header-avatar">
          <el-avatar
            style="margin: 5px"
            :size="size"
            :src="userstore.userinfo.useravatar"
          ></el-avatar>
        </div>
        <div class="header-button">
          <el-button type="text"  @click="goToProfile">个人主页</el-button>
          <el-button type="text">活动时间</el-button>
          <el-button type="text"  @click="goToBooth">商场摊位</el-button>
          <el-button type="text"  @click="goExit">退出</el-button>
        </div>
      </div>
      <div v-else>
        <el-button type="text" @click="goToLogin">登录</el-button>
        <el-button type="text" @click="goToRegister">注册</el-button>
    </div>
  </div>
  </div>
</template>
<script setup>
import { userInfoService } from '@/api/user';
import { useUserStore } from '@/stores/userstore';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const userstore = useUserStore();
const router = useRouter();
const size = 'medium';
function goToLogin() {
  router.push('/login');
}
function goToRegister() {
  router.push('/register');
}

function goToBooth() {
  router.push('/booth');
}
function goToProfile() {
  router.push('/user');
}
function goExit(){

  userstore.clearUserInfo();
  router.push('/');
}
const  getuserinfo= async (token)=>{
  if (userstore.userinfo.token) {
  const res =   await  userInfoService(token);
   console.log(res);
   if (res && res.data) {
        userstore.setUserInfo(res.data.username, res.data.useravatar);
      }
    }
}
onMounted(()=>{


  getuserinfo(userstore.userinfo.token)

})
</script>
<style>
@import url(../assets/css/headerbar.css);
</style>
