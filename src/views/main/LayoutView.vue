<template>
  <div ref="vantaElement" class="app-main">
    <el-container>
      <el-header class="home-header">
        <HeaderBar>
        </HeaderBar>
      </el-header>
      <el-main class="home-main">
        <router-view :key="componentKey"></router-view>
        <footer>Footerhell'</footer>
      </el-main>
    </el-container>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import HeaderBar from '../../components/HeaderBar.vue'
import { RouterView } from 'vue-router';
const componentKey = ref(0); // 用来触发 router-view 的刷新
onMounted(() => {
  // 更新 key 触发 router-view 刷新
  componentKey.value++;
});
</script>
<style scoped>
@import url(../../assets/css/mainapp.css);
</style>
