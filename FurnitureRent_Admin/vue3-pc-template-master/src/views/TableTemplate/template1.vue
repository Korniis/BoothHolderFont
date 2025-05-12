<template>
  <el-card>
    <h2>投诉记录</h2>
    <el-table :data="complaints" stripe border style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="userName" label="投诉人" />
      <el-table-column prop="content" label="投诉内容" />
      <el-table-column prop="status" label="状态" :formatter="formatStatus" />
      <el-table-column prop="createTime" label="提交时间" />
      <el-table-column prop="handlerRemark" label="处理备注" />
      <el-table-column prop="handledTime" label="处理时间" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const complaints = ref([])

const fetchComplaints = async () => {
  const res = await axios.get('/api/admin/complaints')
  complaints.value = res.data
}

const formatStatus = (row) => {
  return row.status === 0 ? '待处理' : '已处理'
}

onMounted(fetchComplaints)
</script>
