<template>
  <el-card class="query-card">
    <!-- 查询表单 -->
    <el-form :model="queryForm" ref="queryFormRef" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="queryForm.userName" placeholder="请输入用户名" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="描述" prop="description">
            <el-input v-model="queryForm.description" placeholder="请输入描述" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色" prop="roleNames">
            <el-select
              v-model="queryForm.roleNames"
              multiple
              placeholder="请选择角色"
            >
              <el-option
                v-for="role in roleOptions"
                :key="role"
                :label="role"
                :value="role"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="userName" label="用户名" width="120" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="phone" label="电话" width="120" />
      <el-table-column prop="avatarUrl" label="头像" width="120">
        <template #default="{ row }">
          <el-image
            v-if="row.avatarUrl"
            style="width: 50px; height: 50px"
            :src="row.avatarUrl"
            fit="cover"
          />
          <span v-else>无头像</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" width="150" />
      <el-table-column prop="createdTime" label="创建时间" width="180" />
      <el-table-column prop="roleNames" label="角色" width="150">
        <template #default="{ row }">
          <el-tag
            v-for="role in row.roleNames"
            :key="role"
            style="margin-right: 5px"
          >
            {{ role }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      layout="prev, pager, next, total"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { GetUserDataService } from "@/api/user";

// 查询表单数据
const queryForm = ref({
  userName: "",
  description: "",
  roleNames: [],
  pageIndex: 0,
  pageSize: 10,
});

// 角色选项
const roleOptions = ref(["Admin", "Enterprise", "User"]);

// 表格数据
const tableData = ref([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);

// 获取用户列表
const fetchUserList = async () => {
  try {
    const res = await GetUserDataService(queryForm.value);

    total.value = res.data.total;
    tableData.value = res.data.page;


  }catch (error) {
    ElMessage.error("未找到数据");
}
};

// 查询
const handleQuery = () => {
  queryForm.value.pageIndex = 0; // 重置为第一页
  pageNum.value = 1; // 重置当前页码
  fetchUserList();
};

// 重置查询
const resetQuery = () => {
  queryForm.value = {
    userName: "",
    description: "",
    roleNames: [],
    pageIndex: 0,
    pageSize: 10,
  };
  pageNum.value = 1; // 重置当前页码
  fetchUserList();
};

// 分页条数变化
const onSizeChange = (size) => {
  queryForm.value.pageSize = size;
  queryForm.value.pageIndex = 0; // 重置为第一页
  pageNum.value = 1; // 重置当前页码
  fetchUserList();
};

// 分页页码变化
const onCurrentChange = (num) => {
  queryForm.value.pageIndex = num - 1; // API 页码从 0 开始
  fetchUserList();
};

// 初始化加载数据
onMounted(() => {
  fetchUserList();
});
</script>

<style scoped>
.query-card {
  margin: 10px auto;
  padding: 20px;
}
</style>
