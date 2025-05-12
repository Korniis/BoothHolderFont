<template>
  <div class="user-actions">
    <el-dropdown
      placement="bottom-end"
      trigger="click"
      class="user-dropdown"
    >
      <div class="user-info flex-center">
        <span class="username">{{ userStore.userinfo.username }}</span>
        <el-icon :size="18" color="#409efc"><Avatar /></el-icon>
      </div>

      <template #dropdown>
        <el-dropdown-menu class="user-menu">
          <el-dropdown-item @click="openPersonalCenter">
            <span class="menu-item">个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item @click="showPasswordDialog">
            <span class="menu-item">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click="handleLogout">
            <span class="menu-item logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="450px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
        label-position="right"
        @submit.prevent
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
            placeholder="请输入当前密码"
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closePasswordDialog">取消</el-button>
          <el-button
            type="primary"
            :loading="isSubmitting"
            @click="submitPasswordChange"
          >
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Avatar } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 密码修改相关状态
const passwordDialogVisible = ref(false)
const isSubmitting = ref(false)
const passwordFormRef = ref(null)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码验证规则
const validatePassword = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  if (value.length < 6) {
    return callback(new Error('密码长度不能少于6位'))
  }
  if (value.length > 20) {
    return callback(new Error('密码长度不能超过20位'))
  }
  callback()
}

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    return callback(new Error('两次输入的密码不一致'))
  }
  callback()
}

const passwordRules = reactive({
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

// 打开个人中心
const openPersonalCenter = () => {
  router.push('/personal-center')
}

// 显示修改密码对话框
const showPasswordDialog = () => {
  passwordDialogVisible.value = true
}

// 关闭修改密码对话框
const closePasswordDialog = () => {
  passwordFormRef.value?.resetFields()
  passwordDialogVisible.value = false
}

// 提交密码修改
const submitPasswordChange = async () => {
  try {
    await passwordFormRef.value.validate()
    isSubmitting.value = true

    // 这里调用修改密码的API
    // await userStore.changePassword({
    //   oldPassword: passwordForm.oldPassword,
    //   newPassword: passwordForm.newPassword
    // })

    ElMessage.success('密码修改成功')
    closePasswordDialog()
  } catch (error) {
    if (error?.message) {
      ElMessage.error(error.message)
    }
  } finally {
    isSubmitting.value = false
  }
}

// 处理退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 调用退出登录方法
    await userStore.clearUserInfo()

    // 跳转到登录页
    router.replace('/login')
    ElMessage.success('退出登录成功')
  } catch (error) {
    // 用户点击了取消
  }
}
</script>

<style scoped lang="scss">
.user-actions {
  .user-dropdown {
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;

    .user-info {
      padding: 0 12px;
      height: 100%;

      .username {
        margin-right: 8px;
        font-size: 14px;
      }
    }
  }

  .user-menu {
    .menu-item {
      font-size: 13px;

      &.logout {
        color: var(--el-color-danger);
      }
    }
  }

  :deep(.el-dialog__header) {
    text-align: center;
    border-bottom: 1px solid var(--el-border-color-light);
    margin-right: 0;
  }

  :deep(.el-dialog__body) {
    padding: 20px 30px;
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}
</style>
