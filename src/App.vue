<template>
<router-view :key="componentKey"></router-view>
</template>
<script setup>
import { useUserStore } from '@/stores/userstore';
// 在组件加载时检查 token 是否存在
import { onMounted, ref } from 'vue';
import {userInfoService } from  '@/api/user.js';
import { watch } from 'vue';
import router from './router';
const userStore = useUserStore();
const componentKey = ref(0);
const  getuserinfo= async (token)=>{
  const res =   await  userInfoService(token);
   console.log(res);
   if (res && res.data) {
        userStore.setUserInfo(res.data.username, res.data.useravatar);
      }
}
watch(() => router.currentRoute.value, () => {
  componentKey.value++; // 每次路由变化时增加 key，强制刷新 <router-view>
    getuserinfo(userStore.userinfo.token)
});
onMounted(() => {
  if (userStore.userinfo.token) {
    // 如果 token 存在，可以通过 token 获取用户信息
    // 假设有一个 API 调用来获取用户信息
    getuserinfo(userStore.userinfo.token)
  }
});
</script>
<style scoped>
</style>
