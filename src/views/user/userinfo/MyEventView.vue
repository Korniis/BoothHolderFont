<template>
  <div>
    <el-table :data="events" style="width: 100%">
      <el-table-column prop="name" label="活动名称" width="180"></el-table-column>
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="location" label="地点" ></el-table-column>

    </el-table>



  </div>
</template>

<script setup>
import {  MyEvevtGetService } from '@/api/event';

import { onMounted, ref } from 'vue';


const events = ref([
  { id: 1, name: '开幕式', date: '2024-12-25', location: '会议中心' },
  { id: 2, name: '技术讲座', date: '2024-12-26', location: '实验室' },
  { id: 3, name: '交流会', date: '2024-12-27', location: '展览厅' },
]);




const getevent = async () => {

  const res = await MyEvevtGetService();
  if (res) {
    events.value = res.data;
  }



}

onMounted(() => {


  getevent();

})


</script>
