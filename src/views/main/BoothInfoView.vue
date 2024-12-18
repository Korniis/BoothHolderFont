<template>
  <div v-if="booth" class="booth-container">
    <div class="booth-header">
      <div>
      <h2>{{ booth.boothName }}</h2>
      <p class="booth-location"><strong>位置:</strong> {{ booth.location }}</p>
      <p class="booth-price"><strong>日租金:</strong> ¥{{ booth.dailyRate }}</p>
    </div>
    <div>
   <span class="booth-location"> 可用时间：{{ booth.availableDate }}</span>
  </div>
    <div class="booth-order">

      <el-button type="success" round>点我预约</el-button>
    </div>
    </div>

    <div class="booth-info">
      <div class="booth-image-container">
        <img :src="booth.mediaUrl" alt="摊位图片" class="booth-image" />
      </div>

      <div class="booth-details">
        <p><strong>描述:</strong> {{ booth.description }}</p>
        <p><strong>是否可用:</strong> {{ booth.isAvailable ? '是' : '否' }}</p>

        <!-- 品牌信息展示 -->
        <div v-if="booth.brandType" class="brand-info">
          <h3>品牌信息</h3>
          <p><strong>品牌名称:</strong> {{ booth.brandType.brandTypeName }}</p>
          <p><strong>品牌描述:</strong> {{ booth.brandType.brandDescription }}</p>
        </div>

      </div>

    </div>
  </div>

  <div v-else>
    <p>加载中...</p>
  </div>
</template>

<script setup>
import { boothDetailsService } from '@/api/booth';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import { ElButton } from 'element-plus';

const route = useRoute();

// 响应式变量
const booth = ref({});
const boothId = ref('');

// 异步函数获取摊位信息
const getBooth = async () => {
  const id = boothId.value;
  try {
    const res = await boothDetailsService(id);
    booth.value = res.data;  // 返回的 data 包含摊位和品牌信息
  } catch (error) {
    console.error('获取摊位信息失败:', error);
    // 错误处理，可以跳转到错误页面或者显示提示
  }
};

onMounted(() => {
  if (route.query.id != null && route.query.id !== '') {
    boothId.value = route.query.id;
    getBooth(); // 获取摊位信息
  } else {
    router.push("/");  // 如果 id 为 null 或 空字符串，则重定向到主页
  }
});
</script>

<style scoped>
.booth-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.booth-header {
  background-color: #f8f8f8;
  padding: 20px;
  display: flex;
  justify-content:space-between;


  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.booth-header h2 {
  font-size: 28px;
  margin: 0;
}

.booth-location, .booth-price {
  font-size: 16px;
  color: #666;
}
.booth-order{

  margin:  auto 0;
}

.booth-info {
  display: flex;
  margin-top: 20px;
  gap: 20px;
}

.booth-image-container {
  flex: 1;
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.booth-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.booth-details {
  flex: 2;
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.booth-details p {
  font-size: 16px;
  margin: 10px 0;
}

.brand-info {
  margin-top: 20px;
}

.brand-info h3 {
  font-size: 22px;
  color: #333;
}

.brand-info p {
  font-size: 16px;
  margin: 5px 0;
}
</style>
