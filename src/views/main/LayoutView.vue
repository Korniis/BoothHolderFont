<template>
  <div ref="vantaElement" class="app-main">
    <el-container>
      <el-header class="home-header">
        <HeaderBar>
        </HeaderBar>
      </el-header>
      <el-main class="home-main">
        <router-view :key="componentKey"></router-view>
        <footer class="footer">
    <div class="footer-content">
        <p>&copy; 2024.EnBoWer All rights reserved.</p>

    </div>
</footer>
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
/* 基础样式 */
.footer {
    background-color: #282828;
    color: #fff;
    padding: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
}

/* 内容区域 */
.footer-content {
    max-width: 1200px;
    margin: 0 auto;
}

/* 链接样式 */
.footer a {
    color: #fff;
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 3px;
}

.footer a:hover {
    background-color: #555;
}

/* 导航列表样式 */
.footer nav ul {
    list-style-type: none;
    padding: 0;
}

.footer nav ul li {
    display: inline;
    margin: 0 15px;
}

/* 响应式布局 */
@media (max-width: 768px) {
    .footer-content {
        padding: 10px;
    }

    .footer nav ul li {
        display: block;
        margin: 10px 0;
    }
}

</style>
