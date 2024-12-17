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
          <el-button type="text">个人主页</el-button>
          <el-button type="text">活动时间</el-button>
          <el-button type="text">商场摊位</el-button>
          <el-button type="text">点我预约</el-button>
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
import { useUserStore } from '@/stores/userstore';
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
</script>
<style>
@import url(../assets/css/headerbar.css);
</style>
