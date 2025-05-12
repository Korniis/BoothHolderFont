<template>
  <div class="notification-list">
    <el-table :data="pagedData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="status" label="状态" :formatter="formatStatus" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="primary" size="small" @click="openRecallDialog(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="mt-4"
      background
      layout="prev, pager, next"
      :total="tableData.length"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange"
    />

    <!-- 弹窗 -->
    <el-dialog v-model="recallDialogVisible" title="编辑 Recall">
      <el-form :model="recallForm">
        <el-form-item label="Recall">
          <el-input v-model="recallForm.recall" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="recallDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRecall">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { GetConsultationByUserId, Recall } from '@/api/booth'
import { ref, computed, onMounted } from 'vue'

const tableData = ref([
  {
    id: 2,
    senderId: 45,
    receiveId: 20,
    title: 'string',
    description: 'string',
    recall: '可以',
    status: 2,
    updateTime: '2025-05-07T00:19:45'
  },
  {
    id: 3,
    senderId: 44,
    receiveId: 20,
    title: '123',
    description: '123',
    recall: null,
    status: 0,
    updateTime: '2025-05-07T01:09:52'
  },
  {
    id: 4,
    senderId: 45,
    receiveId: 20,
    title: '1241215',
    description: '1234521',
    recall: null,
    status: 1,
    updateTime: '2025-05-07T01:11:54'
  }
])

const pageSize = 10
const currentPage = ref(1)

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return tableData.value.slice(start, start + pageSize)
})

const handlePageChange = (page) => {
  currentPage.value = page
}

const recallDialogVisible = ref(false)
const recallForm = ref({ id: null, recall: '' })

const openRecallDialog = (row) => {
  recallForm.value = { ...row }
  recallDialogVisible.value = true
}

const saveRecall = async () => {
  try {
    // 假设 Recall 是你封装的 API 方法（PUT 请求）
    await Recall(recallForm.value)

    const index = tableData.value.findIndex(i => i.id === recallForm.value.id)
    if (index !== -1) {
      tableData.value[index].recall = recallForm.value.recall
    }
    fetchTableData();

    recallDialogVisible.value = false
  } catch (error) {
    console.error('保存失败', error)
  }
}


const formatStatus = (row, column, cellValue) => {
  switch (cellValue) {
    case 0:
      return '待处理'
    case 1:
      return '已处理'
    case 2:
      return '已确定'
    default:
      return '未知'
  }
}
const fetchTableData = async () => {
  try {
    const res = await GetConsultationByUserId() // 替换为你的接口地址

      tableData.value = res.data

  } catch (error) {
    console.error('获取通知数据失败:', error)
  }
}
onMounted(()=>{

 fetchTableData();
})
</script>

<style scoped>
.mt-4 {
  margin-top: 16px;
}
</style>
