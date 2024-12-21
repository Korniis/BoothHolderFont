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
        <span class="data-title">营业额
        </span>
          <!-- 处理可能为 undefined 的情况 -->

        <span class="data-value">
          ¥{{ revenue && revenue !== undefined ? revenue.toFixed(2) : '0.00' }}

        </span>
      </div>
      <div class="data-block">
        <span class="data-title">收益率</span>
        <!-- 处理可能为 undefined 的情况 -->
        <span class="data-value">
          {{ coi && coi !== undefined ? (coi * 100).toFixed(2) : '0.00' }}%
        </span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { CoiGetService } from '@/api/booth';
import { onMounted, ref } from 'vue';

// 接受父组件传来的样式对象
defineProps({
  customStyle: Object,
});

const revenue = ref(0);  // 默认值设置为 0
const coi = ref(0);  // 默认值设置为 0

// 数据加载函数
const getData = async () => {
  try {
    const res = await CoiGetService();

    // 如果 API 返回正确，赋值给组件状态
    if (res && res.data) {
      revenue.value = res.data.revenue || 0;  // 如果没有数据，设置为 0
      coi.value = res.data.coi || 0;  // 如果没有数据，设置为 0
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    revenue.value = 0;  // 出现错误时设置为默认值
    coi.value = 0;  // 出现错误时设置为默认值
  }
};

// 组件挂载后调用 getData
onMounted(() => {
  getData();
});
</script>

<style>
.webdatashow {
  max-width: 300px;
  border-radius: 20px;
  display: block;
  padding: 10px;
  border: 0;
  background-position: center;
  background-repeat: no-repeat;
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
