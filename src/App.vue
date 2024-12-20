<template>
<router-view :key="componentKey"></router-view>
</template>
<script setup>
// 在组件加载时检查 token 是否存在
import { onMounted, ref } from 'vue';

const componentKey = ref(0);
// const  getuserinfo= async (token)=>{
//   if (userStore.userinfo.token) {
//   const res =   await  userInfoService(token);
//    console.log(res);
//    if (res && res.data) {
//         userStore.setUserInfo(res.data.username, res.data.useravatar);
//       }
//     }
// }
// watch(() => router.currentRoute.value, () => {
//     if(!userStore.userinfo.username)
//   {
//     getuserinfo(userStore.userinfo.token)
//   }
// });
onMounted(() => {

    // 如果 token 存在，可以通过 token 获取用户信息
    // 假设有一个 API 调用来获取用户信息

});
</script>
<style scoped>

</style>
