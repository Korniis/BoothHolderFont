<template>
  <el-card class="userdatashow">
    <div v-if="userdata.userinfo.token">
    <div class="avatar-container">
      <el-avatar :size="100" :src=userdata.userinfo.useravatar></el-avatar>
    </div>
    <div class="user-info">
      <h3 class="username">{{ userdata.userinfo.username }}</h3>
    </div>
    <div class="user-links">
      <el-button class="link-btn" @click="goToProfile">个人主页</el-button>
      <el-button class="link-btn" @click="goToStore">查看摊位</el-button>
      <el-button class="link-btn" @click="goToActivities">我的活动</el-button>
      <el-button class="link-btn" @click="goToStore">我的店铺</el-button>
    </div>
  </div>
  <div style="margin: 10px auto ; display: flex; justify-content: center " v-else>

<el-button class="link-btn" @click="goToLogin" > 请登录 </el-button>
  </div>
    <div class="user-scroll">
    <vue3-seamless-scroll  step=0.1 :list="list" class="scroll">
    <div class="item" v-for="(item, index) in list" :key="index">
      <span style="color: black;"> {{item.title}}</span>
      <span style="color: black;">{{item.date}}</span>
    </div>
  </vue3-seamless-scroll>
</div>
  </el-card>
</template>
<script setup>
import { onMounted ,ref} from 'vue';
import { useUserStore } from '@/stores/userstore';
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import router from '@/router';
// 动态数据绑定
const userdata = useUserStore()
const list = ref([
     {
    title: "摊位A 成交",
    date: new Date().toLocaleDateString('zh-CN'),
  },
  {
    title: "摊位B 成交",
    date: new Date().toLocaleDateString('zh-CN'),
  },
  {
    title: "摊位C 成交",
    date: new Date().toLocaleDateString('zh-CN'),
  },
  {
    title: "摊位D 成交",
    date: new Date().toLocaleDateString('zh-CN'),
  },
  {
    title: "摊位E 成交",
    date: new Date().toLocaleDateString('zh-CN'),
  }
    ]);



function goToProfile() {
  router.push('/user');
  }

  function goToLogin() {
  router.push('/login');
  }
const goToStore=()=>{

        router.push("/booth");
    };
onMounted(() => {
  // 可以在这里加载用户信息
});
</script>
<style scoped>
.userdatashow {
  max-width: 480px;
  border-radius: 20px;
  display: block;
  padding: 10px;
  background-image: url("/public/background/CardBg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  color: white;
}
.avatar-container {
  text-align: center;
  margin-bottom: 15px;
}
.scroll {
  max-height: 270px;
  overflow: hidden;
  margin: auto;
}
.scroll .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
}
.user-links {
  display: flex;
  /* 水平排列 */
  justify-content: space-around;
  /* 按照均匀间距排列按钮 */
  align-items: center;
  /* 垂直居中 */
  flex-wrap: wrap;
  gap: 10px;
  /* 按钮之间的间距 */
}
.link-btn {
  min-width: 80px;
  margin: auto;
  /* 设置按钮宽度 */
}
.username {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333030;
  margin: auto;
}
</style>
