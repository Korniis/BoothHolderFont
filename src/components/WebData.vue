<template>
    <el-card class="webdatashow" :style="customStyle">
        <div class="card-content">
            <div class="data-block">
                <span class="data-title">今日成交</span>
                <span class="data-value">23</span>
            </div>
            <div class="data-block">
                <span class="data-title">商场客流</span>
                <span class="data-value">23</span>
            </div>
            <div class="data-block">
                <span class="data-title">活动</span>
                <span class="data-value">32</span>
            </div>
            <div class="data-block">
                <span class="data-title">空闲店铺</span>
                <span class="data-value">3</span>
            </div>
        </div>
    </el-card>
</template>
<script setup>
import { onMounted } from 'vue';
defineProps({
  customStyle: Object, // 接受父组件传来的样式对象
});
onMounted(() => {
})
</script>
<style>
.webdatashow {
    max-width: 300px;
    border-radius: 20px;
    display: block;
    padding: 10px;
    border: 0;
    /* 确保背景图片覆盖整个卡片 */
    background-position: center;
    /* 居中对齐背景图片 */
    background-repeat: no-repeat;
    /* 防止背景图片重复 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.card-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.data-block:hover {
    transform: translateY(-5px);
}
.data-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}
.data-value {
    font-size: 24px;
    font-weight: bold;
    color: #409eff;
    /* Element Plus 默认主题颜色 */
}
.data-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease;
}
</style>
