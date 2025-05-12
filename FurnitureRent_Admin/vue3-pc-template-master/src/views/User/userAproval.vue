<template>
  <el-card class="approval-card">
    <!-- 标题 -->
    <h2>企业申请审批</h2>

    <!-- 查询表单 -->
    <el-form :model="queryForm" ref="queryFormRef" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="企业名称">
            <el-input v-model="queryForm.enterpriseName" placeholder="请输入企业名称" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="queryForm.status" placeholder="请选择状态" clearable>
              <el-option label="待审核" value="待审核" />
              <el-option label="审核通过" value="审核通过" />
              <el-option label="审核拒绝" value="审核拒绝" />
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

    <!-- 企业申请信息表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" />
id
      <el-table-column prop="enterpriseName" label="企业名称" width="130" />
      <el-table-column prop="contactPhone" label="联系人电话" width="120" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column prop="remarkSupport" label="备注" width="150" />

      <el-table-column prop="remark" label="审核备注" width="150" />
      <el-table-column prop="createdAt" label="申请时间" width="180" />
      <el-table-column prop="applyUserName" label="申请人" width="120" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="openApprovalDialog(row, 'approve')"
            :disabled="row.status !== '待审核'">
            审批
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination v-model:current-page="pageIndex" v-model:page-size="pageSize" layout="prev, pager, next, total"
      background :total="total" @size-change="handleSizeChange" @current-change="handlePageChange"
      style="margin-top: 20px; justify-content: flex-end" />

    <!-- 审批弹出窗口 -->
    <el-dialog v-model="approvalDialogVisible" :title="approvalDialogTitle" width="500px" @close="resetApprovalForm">
      <el-form :model="approvalForm" ref="approvalFormRef" label-width="100px">
        <el-form-item label="审批结果">
          <el-radio-group v-model="approvalForm.action">
            <el-radio label="approve">通过</el-radio>
            <el-radio label="reject">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批备注" prop="remark">
          <el-input v-model="approvalForm.remark" type="textarea" placeholder="请输入审批备注（拒绝时必填）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approvalDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitApproval">确认</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { GetApplicationsService, RemarkService } from "@/api/enterprise";

// 表格数据
const tableData = ref([
  {
    id: 1,
    enterpriseName: "企业A",
    contactPhone: "123-456-7890",
    status: "待审核",
    remark: "备注1",
    createdAt: "2023-10-01T10:00:00",
    reviewedAt: null,
    auditComment: null,
    remarkSupport: "",
    applyUserName: "user1",
    reviewedUserName: null,
  },
  {
    id: 2,
    enterpriseName: "企业B",
    contactPhone: "123-456-7891",
    status: "已通过",
    remark: "备注2",
    createdAt: "2023-10-02T11:00:00",
    reviewedAt: "2023-10-03T12:00:00",
    auditComment: "符合要求",
    remarkSupport: "",
    applyUserName: "user2",
    reviewedUserName: "admin1",
  },
  {
    id: 3,
    enterpriseName: "企业C",
    contactPhone: "123-456-7892",
    status: "已拒绝",
    remark: "备注3",
    createdAt: "2023-10-03T12:00:00",
    reviewedAt: "2023-10-04T13:00:00",
    auditComment: "资料不全",
    remarkSupport: "",
    applyUserName: "user3",
    reviewedUserName: "admin2",
  },
]);


// 查询表单
const queryForm = ref({
  enterpriseName: "",
  status: "",
});

// 分页数据
const pageIndex = ref(1);
const pageSize = ref(10);
 const total = ref(0);
// 审批弹出窗口
const approvalDialogVisible = ref(false);
const approvalDialogTitle = ref("");
const approvalForm = ref({
  action: "approve", // 审批操作（approve/reject）
  remark: "", // 审批备注
});
const currentRow = ref(null); // 当前操作的行数据


// 打开审批弹出窗口
const openApprovalDialog = (row, action) => {
  currentRow.value = row;
  approvalForm.value.action = action;
  approvalDialogTitle.value = action === "approve" ? "审批通过" : "审批拒绝";
  approvalDialogVisible.value = true;
};

const getApplication = async () => {
  let res = await GetApplicationsService(queryForm.value);
  if (res) {
    tableData.value= res.data.page;
  }

}
// 提交审批
const submitApproval = async () => {
  if (approvalForm.value.action === "reject" && !approvalForm.value.auditComment) {
    ElMessage.warning("拒绝时请填写审批备注");
    return;
  }

  try {
     let remarkdata={
      id:currentRow.value.id,
      status:0 ,
      remark:approvalForm.value.remark,
     }

if(approvalForm.value.action=="approve")  remarkdata.status=1;


   let res = await RemarkService(remarkdata)

  approvalDialogVisible.value = false;

   ElMessage.success(res.message)
  } catch (error) {
    ElMessage.error("审批操作失败");
  }
};

// 重置审批表单
const resetApprovalForm = () => {
  approvalForm.value = {
    action: "approve",
    auditComment: "",
  };
};

// 查询
const handleQuery = () => {
  getApplication();
};

// 重置查询
const resetQuery = () => {
  queryForm.value = {
    enterpriseName: "",
    contactPhone: "",
    status: "",
  };
  pageIndex.value = 1; // 重置为第一页
};

// 分页页码变化
const handlePageChange = (page) => {
  pageIndex.value = page;
};

// 分页条数变化
const handleSizeChange = (size) => {
  pageSize.value = size;
  pageIndex.value = 1;
};
onMounted(()=>{
  getApplication();
})
</script>
<style scoped>
.approval-card {
  max-width: 100%;
  margin: 20px;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}
</style>
