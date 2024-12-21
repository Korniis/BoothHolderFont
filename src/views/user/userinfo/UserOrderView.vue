<template>
  <el-scrollbar height="80vh">
    <div class="select">
      <!-- 查询表单 -->
      <el-form :model="queryParams" ref="queryForm" label-width="120px">
        <!-- 摊位名称, 位置, 品牌类型 水平排列 -->
        <el-row>
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
          <el-col :span="7">
            <el-form-item label="品牌类型">
              <el-select clearable v-model="queryParams.brandType" placeholder="Select" size="large"
                style="width: 240px">
                <el-option v-for="type in types" :key="type.id" :label="type.brandTypeName" :value="type.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 其他查询条件 -->
        <el-row :gutter="1">
          <el-form-item label="价格范围">
            <el-col :span="9">
              <el-input-number v-model="queryParams.minPrice" :min="0" placeholder="最小价格"
                style="width: 100%"></el-input-number>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="9">
              <el-input-number v-model="queryParams.maxPrice" :min="queryParams.MinPrice" placeholder="最大价格"
                style="width: 100%"></el-input-number>
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

        <el-row>
          <el-form-item label="排序">
            <el-checkbox v-model="queryParams.isDesc">降序</el-checkbox>
          </el-form-item>
          <el-form-item label="只看可用">
            <el-switch v-model="queryParams.isAvailable"></el-switch>
          </el-form-item>
        </el-row>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="getBooths">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="openNewBoothDialog">新建摊位</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 摊位表格 -->
    <div class="table-container">
      <el-table :data="booths" style="width: 100%" @sort-change="handleSortChange">
        <el-table-column prop="id" label="ID" sortable width="80px" :sort-method="sortMethod"></el-table-column>
        <el-table-column prop="boothName" label="摊位名称" sortable :sort-method="sortMethod"></el-table-column>
        <el-table-column prop="brandTypeName" label="品牌"></el-table-column>
        <el-table-column prop="location" label="位置" sortable></el-table-column>
        <el-table-column prop="dailyRate" label="每日租金" sortable :sort-method="sortMethod"></el-table-column>
        <el-table-column prop="availableDate" label="可用日期" sortable :sort-method="sortMethod"></el-table-column>

        <el-table-column prop="tag" label="Tag" width="100" :filter-method="filterTag" filter-placement="bottom-end">
          <template #default="scope">
            <el-tag :type="scope.row.tag === isAvailable ? 'success' : 'primary'" disable-transitions>{{
              scope.row.isAvailable ? '营业' : '未营业' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button @click="editBooth(row)" size="small" type="primary">编辑</el-button>
            <el-button @click="deleteBooth(row.id)" size="small" type="danger">删除</el-button>
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
  <el-dialog v-model="dialogVisible" append-to-body :title="dialogTitle">
    <el-form :model="currentBooth" ref="boothForm" label-width="120px" :rules="formRules">
      <el-form-item label="摊位名称" prop="boothName">
        <el-input v-model="currentBooth.boothName" placeholder="请输入摊位名称"></el-input>
      </el-form-item>
      <el-form-item label="位置" prop="location">
        <el-input v-model="currentBooth.location" placeholder="请输入位置"></el-input>
      </el-form-item>
      <el-form-item label="品牌类型" prop="brandTypeId">
        <el-select v-model="currentBooth.brandTypeId" placeholder="选择品牌类型" style="width: 100%">
          <el-option v-for="type in types" :key="type.id" :label="type.brandTypeName" :value="type.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="每日租金" prop="dailyRate">
        <el-input-number v-model="currentBooth.dailyRate" :min="0" placeholder="每日租金" style="width: 100%" />
      </el-form-item>
      <el-form-item label="可用日期" prop="availableDate">
        <el-date-picker v-model="currentBooth.availableDate" type="date" placeholder="可用日期" style="width: 100%" />
      </el-form-item>

      <el-form-item label="简介" prop="description">
        <el-input v-model="currentBooth.description" placeholder="请输入位置"></el-input>
      </el-form-item>
      <el-form-item  label="是否营业" prop="isAvailable">
        <el-switch v-model="currentBooth.isAvailable" />
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload class="avatar-uploader" action="/api/Upload/UploadBoothImg" :show-file-list="false"
          :headers="headers" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveBooth">保存</el-button>

    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { BoothCreateService, BoothGetService, BoothUpdateService, delboothService, TypeGetService } from '@/api/booth';
import { useUserStore } from '@/stores/userstore';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';

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
  isAvailable: false,
  isDesc: false,
  minPrice: null,
  maxPrice: null,
  rentalStartDate: null,
  rentalEndDate: null,
});

const dialogVisible = ref(false);
const dialogTitle = ref('');
const currentBooth = ref({
  id: null,
  boothName: '',
  location: '',
  brandTypeId: '',
  description: '',
  isAvailable: '',
  mediaUrl: '',
  dailyRate: null,
  availableDate: null,
});
const formRules = ref({
  boothName: [{ required: true, message: '摊位名称不能为空', trigger: 'blur' }],
  location: [{ required: true, message: '位置不能为空', trigger: 'blur' }],
  brandTypeId: [{ required: true, message: '品牌类型不能为空', trigger: 'change' }],
  dailyRate: [{ required: true, message: '每日租金不能为空', trigger: 'blur' }],
  availableDate: [{ required: true, message: '可用日期不能为空', trigger: 'change' }],
});
const headers = ref({
  'Authorization': 'Bearer ' + useUserStore().userinfo.token,
});
const handleAvatarSuccess = (response, uploadFile) => {
  imgUp.value = response.fileUrl;
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  loadingInstance.value.close() // 关闭 loading 动画
}
const boothForm = ref({})

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
    isAvailable: false,
    isDesc: false,
    minPrice: null,
    maxPrice: null,
    rentalStartDate: null,
    rentalEndDate: null,
  };
  getBooths();
};


const openNewBoothDialog = () => {
  dialogVisible.value = true;
  dialogTitle.value = '新建摊位';
  currentBooth.value = {
    id: null,
    boothName: '',
    location: '',
    brandType: '',
    dailyRate: null,
    mediaUrl: '',
    availableDate: null,
  };
};
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像图片必须是 JPG,PNG 格式！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过 2MB！')
    return false
  }
  // 在上传前显示 loading 动画
  loadingInstance.value = ElLoading.service({
    text: '正在上传头像...',
    background: 'rgba(0, 0, 0, 0.7)', // 背景颜色
  })
  return true

}
const editBooth = (booth) => {

  dialogVisible.value = true;
  dialogTitle.value = '编辑摊位';

  currentBooth.value = { ...booth };
  imageUrl.value = currentBooth.value.mediaUrl

};

const deleteBooth = async (id) => {
  console.log(id)
  ElMessageBox.confirm(
    '此操作将永久删除该项，您确定要继续吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      // 用户确认删除后执行删除操作
      try {
        const res = await delboothService(id);  // 调用删除服务
        if (res && res.data) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          });
          await getBooths();  // 删除成功后重新获取展位列表
        } else {
          ElMessage({
            type: 'error',
            message: '删除失败',
          });
        }
      } catch (error) {
        ElMessage({
          type: 'error',
          message: '删除过程中发生错误' + error,
        });
      }
    })
    .catch(() => {
      // 用户取消删除
      ElMessage({
        type: 'info',
        message: '已取消删除',
      });
    });
};


const saveBooth = async () => {
  // Validate the form
  const valid = await boothForm.value.validate();
  if (!valid) {
    ElMessage.error('请填写完整表单');
    return;
  }
  // 根据 id 判断是新建还是编辑

  const url = imgUp.value;
  currentBooth.value.mediaUrl = url;
  if (currentBooth.value.id) {



    const res = await BoothUpdateService(currentBooth.value);
    if (res) {
      ElMessage.success(res.data)
      currentBooth.value = {
        id: null,
        boothName: '',
        location: '',
        brandType: '',
        dailyRate: null,
        mediaUrl: '',
        availableDate: null,
      };
    }


    // 编辑摊位的逻辑
  } else {


    const res = await BoothCreateService(currentBooth.value);

    if (res) {
      ElMessage.success(res.data)
      currentBooth.value = {
        id: null,
        boothName: '',
        location: '',
        brandType: '',
        dailyRate: null,
        mediaUrl: '',
        availableDate: null,
      };
    }




    // 新建摊位的逻辑
  }
  getBooths();
  dialogVisible.value = false;
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

.el-button {
  margin-right: 10px;
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
