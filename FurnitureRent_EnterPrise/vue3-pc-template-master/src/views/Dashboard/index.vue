<template>
  <div class="dashboard-container" v-if="hasData">
    <!-- 统计概览 -->
    <div class="stats-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-statistic
            title="租赁状态"
            value="生效中"
            class="big-stat"
          >
            <template #suffix>
              <el-tag type="success" size="large">正常使用中</el-tag>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic
            title="已使用天数"
            :value="stats.rentedDays"
            class="big-stat"
          />
        </el-col>
        <el-col :span="6">
          <el-statistic
            title="总支付金额"
            :value="stats.totalPayment"
            class="big-stat"
          >
            <template #prefix>¥</template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic
            title="押金金额"
            :value="stats.deposit"
            class="big-stat"
          >
            <template #prefix>¥</template>
          </el-statistic>
        </el-col>
      </el-row>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <h1 class="page-title">{{ currentReservation.boothName }} - 租赁详情</h1>

      <el-card class="detail-card">
        <div class="card-body">
          <!-- 摊位信息 -->
          <div class="booth-info">
            <el-image
              :src="currentReservation.imageUrl"
              :preview-src-list="[currentReservation.imageUrl]"
              class="booth-image"
            />
            <div class="booth-meta">
              <div class="booth-header">
                <h3>基础信息</h3>
                <el-button
                  type="primary"
                  size="small"
                  @click="showEditDialog"
                  circle
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
              </div>
              <el-descriptions :column="1" border>
                <el-descriptions-item label="摊位名称">{{ currentReservation.name }}</el-descriptions-item>
                <el-descriptions-item label="位置">{{ currentReservation.location }}</el-descriptions-item>
                <el-descriptions-item label="品牌类型">{{ currentReservation.brandType }}</el-descriptions-item>
                <el-descriptions-item label="日租金">{{ currentReservation.dailyRate }} 元/天</el-descriptions-item>
              </el-descriptions>

              <div class="description-section">
                <h4>摊位描述</h4>
                <p>{{ currentReservation.boothDescription }}</p>
              </div>


            </div>
          </div>

          <!-- 租赁明细 -->
          <div class="payment-details">
            <h3>费用明细</h3>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="起租日期">
                {{ formatDate(currentReservation.startDate) }}
              </el-descriptions-item>
              <el-descriptions-item label="已使用天数">
                {{ stats.rentedDays }} 天
              </el-descriptions-item>
              <el-descriptions-item label="押金（30天）">
                ¥{{ stats.deposit }}
              </el-descriptions-item>
              <el-descriptions-item label="实际租金">
                ¥{{ stats.actualRent }}
              </el-descriptions-item>
              <el-descriptions-item label="总计支付" class="total-payment">
                ¥{{ stats.totalPayment }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button
              type="danger"
              size="large"
              @click="cancelReservation"
              :loading="isCanceling"
            >
              <el-icon><Delete /></el-icon>
              取消租赁
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>

  <!-- 空状态 -->
  <div v-else class="empty-state">
    <el-empty description="您当前没有有效的摊位租赁">
      <el-button type="primary" @click="goToRent">立即租赁摊位</el-button>
    </el-empty>
  </div>

  <!-- 编辑对话框 -->
  <el-dialog v-model="editDialogVisible" title="编辑摊位信息" width="600px">
    <el-form :model="editForm" label-width="100px">
      <el-form-item label="摊位名称">
        <el-input v-model="editForm.boothName" placeholder="请输入摊位名称" />
      </el-form-item>
      <el-form-item label="摊位描述">
        <el-input
          v-model="editForm.boothDescription"
          type="textarea"
          :rows="4"
          placeholder="请输入摊位描述"
        />
      </el-form-item>

    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit" :loading="isSaving">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { getReservationInfo, RemoveReservation } from '@/api/reservation'
import { updateReservationInfo } from '@/api/booth'

const router = useRouter()
const currentReservation = ref({})
const isCanceling = ref(false)
const loading = ref(true)
const editDialogVisible = ref(false)
const isSaving = ref(false)
const editForm = ref({
  boothName: '',
  boothDescription: '',

})

// 获取租赁数据
onMounted(async () => {
  try {
    const res = await getReservationInfo()
    if (res?.code === 200 && res.data) {
      currentReservation.value = {
        ...res.data.reservation,
        ...res.data.booth,
        imageUrl: res.data.booth?.imageUrl || ''
      }
    }
  } catch (error) {
    ElMessage.error('获取租赁信息失败')
  } finally {
    loading.value = false
  }
})

// 数据有效性检查
const hasData = computed(() => {
  return currentReservation.value?.startDate &&
         currentReservation.value?.dailyRate > 0
})

// 计算统计信息
const stats = computed(() => {
  if (!hasData.value) return {
    rentedDays: 0,
    deposit: 0,
    actualRent: 0,
    totalPayment: 0
  }

  const startDate = dayjs(currentReservation.value.startDate)
  const today = dayjs()

  // 计算实际使用天数（包含当天）
  const rentedDays = Math.max(today.diff(startDate, 'day') + 1, 0)

  // 计算费用
  const dailyRate = currentReservation.value.dailyRate
  const deposit = 30 * dailyRate        // 30天押金
  const actualRent = rentedDays * dailyRate
  const totalPayment = deposit + actualRent

  return {
    rentedDays,
    deposit,
    actualRent,
    totalPayment
  }
})

// 日期格式化
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY年MM月DD日')
}

// 显示编辑对话框
const showEditDialog = () => {
  editForm.value = {
    boothName: currentReservation.value.name || '',
    boothDescription: currentReservation.value.boothDescription || '',

  }
  editDialogVisible.value = true
}

// 保存编辑
const saveEdit = async () => {
  try {
    isSaving.value = true
    // 这里调用API保存修改
     await updateReservationInfo(editForm.value)

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))

    // 更新本地数据
    currentReservation.value = {
      ...currentReservation.value,
      boothName: editForm.value.name,
      boothDescription: editForm.value.boothDescription,
    }

    ElMessage.success('修改成功')
    editDialogVisible.value = false
  } catch (error) {
    ElMessage.error('保存失败，请稍后重试')
  } finally {
    isSaving.value = false
  }
}

// 取消租赁
const cancelReservation = async () => {
  try {
    await ElMessageBox.confirm('确定要取消租赁吗？押金将按协议退还', '确认取消', {
      confirmButtonText: '确认取消',
      cancelButtonText: '暂不取消',
      type: 'warning'
    })

    isCanceling.value = true
    // 此处调用取消API
    const res = await RemoveReservation()

    await new Promise(resolve => setTimeout(resolve, 800))
    currentReservation.value = {}
    ElMessage.success('已提交取消申请')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败，请稍后重试')
    }
  } finally {
    isCanceling.value = false
  }
}

// 前往租赁页面
const goToRent = () => {
  router.push('/booth')
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.stats-overview {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.page-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 30px;
  font-weight: 500;
}

.detail-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-body {
  display: grid;
  gap: 30px;
  padding: 30px;
}

.booth-info {
  display: grid;
  grid-template-columns: 300px 1fr;
align-items: center;
  gap: 30px;
}

.booth-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.booth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.description-section {
  margin-top: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.description-section h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #606266;
}

.description-section p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.payment-details {
  border-top: 1px solid #ebeef5;
  padding-top: 20px;
}

.total-payment {
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c;
}

.action-buttons {
  margin-top: 30px;
  text-align: right;
}

.empty-state {
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .booth-info {
    grid-template-columns: 1fr;
  }

  .stats-overview .el-col {
    margin-bottom: 20px;
  }

  .card-body {
    padding: 20px;
  }
}
</style>
