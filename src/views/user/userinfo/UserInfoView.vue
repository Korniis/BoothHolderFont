<template >
  <div class="container">
    <h1>个人信息</h1>
    <div class="avatar-container">
      <el-avatar style="cursor: hand;" :size="100" :src="user.avatarUrl || 'https://via.placeholder.com/100'"
        alt="用户头像" />
      <el-button class="edit-btn" @click="avatarVisible = true" type="primary" :icon="Edit" circle />
    </div>
    <div class="info-row">
      <label for="username">用户名:</label>
      <span>{{ user.userName }}</span>
    </div>
    <div class="info-row">
      <label for="email">邮箱:</label>
      <span>{{ user.email }}</span>
    </div>
    <div class="info-row">
      <label for="phone">电话:</label>
      <span>{{ user.phone || '未提供' }}</span>
    </div>

    <div class="info-row">
      <label for="created-time">注册时间:</label>
      <span>{{ formatDate(user.createdTime) }}</span>
    </div>


    <div class="info-row">
      <label for="phone">个性签名:</label>
      <span>{{ user.description || '未提供' }}</span>
    </div>
    <button class="btn" @click="startupdateInfo">更新资料</button>
  </div>


  <el-dialog v-loading="loading" v-model="avatarVisible" title="上传头像" destroy-on-close width="500" :lock-scroll="false"
    :before-close="handleClose">
    <el-upload class="avatar-uploader" action="/api/Upload/UploadUserImg" :show-file-list="false" :headers="headers"
      :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="avatarVisible = false">取消</el-button>
        <el-button type="primary" @click="updateProfile">确认上传</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="infoVisible"
    title="编辑个人信息"
    width="500px"
    :lock-scroll="false"
    destroy-on-close
    :before-close="handleClose"
  >
    <el-form :model="userInfo" ref="userForm" label-width="100px" :rules="formRules">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="userInfo.userName" placeholder="请输入用户名" />
      </el-form-item>


      <el-form-item label="电话" prop="phone">
        <el-input v-model="userInfo.phone" placeholder="请输入电话" />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="userInfo.description" placeholder="请输入描述" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="openConfirmDialog">保存更改</el-button>
      </el-form-item>
    </el-form>

    <!-- 确认修改对话框 -->
    <el-dialog
      v-model="confirmVisible"
      title="确认修改"
      width="400px"
      :lock-scroll="false"
      destroy-on-close
      :before-close="handleClose"
    >
      <span>您确定要保存更改吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="confirmVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDialog">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>

import { onMounted, ref } from 'vue';

import { Plus, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/userstore';
import { updateUserInfoService, updateUserPicService, userMoreInfoService } from '@/api/user';
import { ElLoading } from 'element-plus'
const userStore = useUserStore();
const user = ref({})
const userInfo = ref({})
const userForm= ref({})
const loadingInstance = ref(null)
const headers = ref({
  'Authorization': 'Bearer ' + userStore.userinfo.token,
});
const avatarVisible = ref(false);
const infoVisible = ref(false);
const confirmVisible=ref(false);
const imageUrl = ref('');
const imgUp = ref('');
const handleAvatarSuccess = (response, uploadFile) => {
  imgUp.value = response.fileUrl;
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  loadingInstance.value.close() // 关闭 loading 动画
}
const confirmDialog =async()=>{

 const data = {
  userName :userInfo.value.userName,


  phone: userInfo.value.phone,

  description:userInfo.value.description,

 }


  const res = await updateUserInfoService(data);

  if (res)
{
  ElMessage.success(res.data)
  confirmVisible.value=false;
  infoVisible.value= false;
}



}
const openConfirmDialog = async ()=>{
  const form = userForm.value; // 获取表单引用
  form.validate((valid) => {
    if (valid) {
      confirmVisible.value=true;

    } else {
      console.log('表单验证失败，请检查输入项');
    }
  });
}

const startupdateInfo = async()=>{

  userInfo.value = JSON.parse(JSON.stringify(user.value));
  infoVisible.value=true;
}


// 表单验证规则
const formRules = ref({
  userName: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度在 3 到 15 个字符之间', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] },
  ],
  phone: [
    { pattern: /^[0-9]{11}$/, message: '请输入有效的手机号', trigger: 'blur' },
  ],
  description: [
  ],
});


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



const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
}
const updateProfile = async () => {
  const url = imgUp.value;

  var res = await updateUserPicService(url);
  if (res) {

    ElMessage.success(res.data);
    avatarVisible.value = false;
  }
}

const getMoreInfo = async () => {

  const res = await userMoreInfoService()
  if (res) {
    user.value = res.data;

  }
}



onMounted(() => {


  getMoreInfo();

})


</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 500px;

}

h1 {
  text-align: center;
  color: #333;
}

.info-row {
  margin-bottom: 10px;
}

.info-row label {
  font-weight: bold;
  color: #555;
}

.info-row span {
  color: #333;
}

.avatar-container {
  width: 100%;
  position: relative;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;


}

.edit-btn {
  position: absolute;
  top: 0;
  right: 40%;
  transform: translate(20%, 200%);
  z-index: 10;
  border-radius: 50%;
  /* Make the button round */
}

.btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  text-align: center;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}

.btn:hover {
  background-color: #0056b3;
}

.avatar-uploader {
  display: inline-block;
  position: relative;
}

.el-upload .el-button {
  display: block;
}
</style>
