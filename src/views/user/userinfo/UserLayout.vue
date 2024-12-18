
<template>
  <div class="common-layout">
    <HeaderBar></HeaderBar>
    <el-container>
      <el-aside class="side-aside " width="200px">
        <el-menu :default-active="activeMenu" class="side-menu" @select="handleSelect">
          <el-menu-item index="1">个人信息</el-menu-item>
          <el-menu-item index="2">我的订单</el-menu-item>
          <el-menu-item index="3">消息中心</el-menu-item>
          <el-menu-item index="4">设置</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main><RouterView></RouterView></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import HeaderBar from '@/components/HeaderBar.vue';


</script>
<style>
.common-layout{
  height: 100vh;
  background-image:url(../../../assets/images/background.jpg) ;
   background-repeat: no-repeat;
   background-size: cover;
}
.side-aside {
  height: 100vh; /* 让左侧菜单区域高度为屏幕高度 */
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column; /* 使菜单垂直排列 */
}
.side-menu {
  flex-grow: 1; /* 让菜单填充剩余的垂直空间 */
  background-color: #f4f4f4;
}
</style>
