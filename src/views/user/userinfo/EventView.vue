<template>
  <div>
    <el-table :data="events" style="width: 100%">
      <el-table-column prop="name" label="活动名称" width="180"></el-table-column>
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="location" label="地点" width="180"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="submitBooking(row.id)" size="small" type="primary">预约</el-button>
        </template>
      </el-table-column>
    </el-table>



  </div>
</template>

<script setup>
import { EvevtGetService } from '@/api/event';
import { addEvevtService } from '@/api/user';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';


const events = ref([
  { id: 1, name: '开幕式', date: '2024-12-25', location: '会议中心' },
  { id: 2, name: '技术讲座', date: '2024-12-26', location: '实验室' },
  { id: 3, name: '交流会', date: '2024-12-27', location: '展览厅' },
]);


async function submitBooking(id) {

  try {
    const res = await addEvevtService(id);
    if (res) {
      ElMessage.success(res.data);
    }
  } catch {
    ElMessage.error("预约异常 您可能已经预约过")
  }



};

const getevent = async () => {

  const res = await EvevtGetService();
  if (res) {
    events.value = res.data;
  }



}

onMounted(() => {


  getevent();

})


</script>
