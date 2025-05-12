<template>
  <el-scrollbar height="80vh">
    <div class="select">
      <!-- 查询表单 -->
      <el-form :model="queryParams" ref="queryForm" label-width="120px">
        <!-- 摊位名称, 位置, 品牌类型 水平排列 -->
        <el-row :getter="24">
          <el-col :span="5">
            <el-form-item label="摊位名称">
              <el-input v-model="queryParams.boothName" placeholder="请输入摊位名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="位置">
              <el-input v-model="queryParams.location" placeholder="请输入位置"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="品牌类型">
              <el-select clearable v-model="queryParams.brandType" placeholder="Select">
                <el-option v-for="type in types" :key="type.id" :label="type.brandTypeName" :value="type.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="排序">
              <el-checkbox v-model="queryParams.isDesc">降序</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 其他查询条件 -->
        <el-row :gutter="24">
          <el-form-item label="价格范围">
            <el-col :span="9">
              <el-input-number v-model="queryParams.minPrice" :min="0" placeholder="最小价格"></el-input-number>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="9">
              <el-input-number v-model="queryParams.maxPrice" :min="queryParams.MinPrice"
                placeholder="最大价格"></el-input-number>
            </el-col>
          </el-form-item>
          <el-form-item label="租赁日期">
            <el-col :span="9">
              <el-date-picker v-model="queryParams.rentalStartDate" type="date" placeholder="起始日期"
                style="width: 100%"></el-date-picker>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="9">
              <el-date-picker v-model="queryParams.rentalEndDate" type="date" placeholder="结束日期"
                style="width: 100%"></el-date-picker>
            </el-col>
          </el-form-item>
        </el-row>
        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="getBooths">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 摊位表格 -->
    <div class="table-container">
      <el-table :data="booths" style="width: 100%" @sort-change="handleSortChange">
        <el-table-column prop="id" label="ID" sortable width="80px" :sort-method="sortMethod"></el-table-column>
        <el-table-column prop="boothName" label="摊位名称" sortable :sort-method="sortMethod"></el-table-column>
        <el-table-column prop="brandTypeName" label="品牌"></el-table-column>
        <el-table-column   prop="mediaUrl" label="图片">
          <template #default="scope" >
            <el-image
          style="height: 70px;"
          :preview-src-list="[scope.row.mediaUrl]"
          :src="scope.row.mediaUrl"
          :preview-teleported="true"
           :zoom-rate="0.4"
        />
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" sortable></el-table-column>
        <el-table-column prop="dailyRate" label="每日租金" sortable :sort-method="sortMethod"></el-table-column>
        <el-table-column prop="availableDate" label="可用日期" sortable :sort-method="sortMethod"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button @click="openReservationDialog(row)" size="small" type="primary">租赁</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" layout="prev, pager, next, total"
        background :total="total" @size-change="onSizeChange" @current-change="onCurrentChange"
        style="margin-top: 20px; justify-content: flex-end" />
    </div>
  </el-scrollbar>
  <!-- 编辑和新建摊位对话框 -->
  <el-dialog v-model="reservationDialogVisible" title="摊位预定" width="600px" append-to-body>
  <el-form :model="reservationForm" ref="reservationFormRef" label-width="120px" :rules="reservationRules">
    <!-- 摊位信息展示 -->
    <el-form-item label="摊位名称">
      <el-input v-model="currentBooth.boothName" disabled />
    </el-form-item>

    <el-form-item label="位置">
      <el-input v-model="currentBooth.location" disabled />
    </el-form-item>

    <el-form-item label="每日租金">
      <el-input v-model="currentBooth.dailyRate" disabled>
        <template #append>元/天</template>
      </el-input>
      需要支付30天押金
    </el-form-item>

    <!-- 预定信息输入 -->



    <el-form-item label="总金额">
      <el-input v-model="reservationForm.totalAmount" disabled>
        <template #append>元</template>
      </el-input>
    </el-form-item>

    <!-- 联系人信息 -->
    <el-form-item label="联系人" prop="contactName">
      <el-input v-model="reservationForm.contactName" placeholder="请输入联系人姓名" />
    </el-form-item>

    <el-form-item label="联系电话" prop="contactPhone">
      <el-input v-model="reservationForm.contactPhone" placeholder="请输入联系电话" />
    </el-form-item>

    <el-form-item label="备注信息">
      <el-input
        v-model="reservationForm.remarks"
        type="textarea"
        :rows="3"
        placeholder="请输入特殊要求或其他备注信息"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>

    <!-- 支付方式 -->
    <el-form-item label="支付方式" prop="paymentMethod">
      <el-radio-group v-model="reservationForm.paymentMethod">
        <el-radio label="alipay">支付宝</el-radio>
        <el-radio label="wechat">微信支付</el-radio>
        <el-radio label="bank">银行转账</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>

  <template #footer>
    <el-button @click="reservationDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="submitReservation" :loading="submitting">提交预定</el-button>
  </template>
</el-dialog>
</template>
<script setup>
import { ref, reactive,watch ,onMounted } from 'vue';
import dayjs from 'dayjs'
import { BoothCreateService, BoothGetService, BoothUpdateService, delboothService, TypeGetService } from '@/api/booth';
import { useUserStore } from '@/stores/userstore';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import { submitReservationApi } from '@/api/reservation';
const pageNum = ref(1);
const imageUrl = ref();
const imgUp = ref('');
const total = ref(105);
const pageSize = ref(12);
const loadingInstance = ref(null)
const booths = ref([]);
const types = ref([]);
const queryParams = ref({
  boothName: '',
  location: '',
  brandType: '',
  holdername: '',
  isDesc: false,
  minPrice: null,
  maxPrice: null,
  rentalStartDate: null,
  rentalEndDate: null,
});
const dialogVisible = ref(false);
const dialogTitle = ref('');


const headers = ref({
  'Authorization': 'Bearer ' + useUserStore().userinfo.token,
});


const onSizeChange = (size) => {
  pageSize.value = size;
  getBooths();
};
const onCurrentChange = (num) => {
  pageNum.value = num;
  getBooths();
};
const getBooths = async () => {
  const params = {
    pageIndex: pageNum.value - 1,
    pageSize: pageSize.value,
  };
  Object.keys(queryParams.value).forEach((key) => {
    const value = queryParams.value[key];
    if (value !== null && value !== '') {
      if (key === 'rentalStartDate' || key === 'rentalEndDate') {
        params[key] = new Date(value).toISOString();
      } else {
        params[key] = value;
      }
    }
  });
  const res = await BoothGetService(params);
  if (res) {
    booths.value = res.data.page;
    total.value = res.data.total;
  }
};
const getTypes = async () => {
  const res = await TypeGetService();
  if (res) {
    types.value = res.data;
  }
};
const resetForm = () => {
  queryParams.value = {
    boothName: '',
    location: '',
    brandType: '',
    isAvailable: true,
    isDesc: false,
    minPrice: null,
    maxPrice: null,
    rentalStartDate: null,
    rentalEndDate: null,
  };
  getBooths();
};

// 预定对话框状态
const reservationDialogVisible = ref(false)
const submitting = ref(false)

// 当前选中的摊位信息
const currentBooth = reactive({
  id: null,
  boothName: '',
  location: '',
  dailyRate: 0,
  availableDate: ''
})
 const reservationFormRef = ref(null);
// 预定表单数据
const reservationForm = reactive({
  boothId: null,
  dateRange: [],
  days: 0,
  totalAmount: 0,
  contactName: '',
  contactPhone: '',
  remarks: '',
  paymentMethod: 'alipay'
})

// 表单验证规则
const reservationRules = {
  dateRange: [
    { required: true, message: '请选择预定日期范围', trigger: 'change' }
  ],
  contactName: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^\d+$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  paymentMethod: [
    { required: true, message: '请选择支付方式', trigger: 'change' }
  ]
}

// 计算租赁天数和总金额
watch(() => reservationDialogVisible.value, (newVal) => {
  if (newVal) {
    // Use currentBooth.dailyRate instead of reservationForm.dailyRate
    reservationForm.totalAmount = 30 * currentBooth.dailyRate;
  }
});

// 禁用不可用的日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7  // 禁用今天之前的日期

}

// 打开预定对话框
const openReservationDialog = (booth) => {
  Object.assign(currentBooth, booth)
  reservationForm.boothId = booth.id
  reservationDialogVisible.value = true
}

// 提交预定
const submitReservation = async () => {

  try {

    submitting.value = true

    await reservationFormRef.value.validate();

    //这里调用API提交预定
    const res = await submitReservationApi({
      boothId:currentBooth.id ,
      userId:0,
      contactName:reservationForm.contactName ,
      phone: reservationForm.contactPhone,
      description: reservationForm.remarks,
    })

    ElMessage.success('预定成功')
    reservationDialogVisible.value = false
  } catch (error) {
  } finally {
    submitting.value = false
  }
}

// 暴露方法给父组件
defineExpose({
  openReservationDialog
})
const orderBooth = (booth) => {
  dialogVisible.value = true;
  dialogTitle.value = '编辑摊位';
  currentBooth.value = { ...booth };
  imageUrl.value = currentBooth.value.mediaUrl
};
onMounted(() => {
  getBooths();
  getTypes();
});
</script>
<style scoped>
.table-container {
  padding: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.select {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-form {
  margin: 0;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
