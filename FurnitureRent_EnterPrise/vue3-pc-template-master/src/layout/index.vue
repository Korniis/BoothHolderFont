<template>
  <div class="common-layout h-p-100 w-p-100">
    <el-container class="h-p-100 w-p-100">
      <el-aside :width="isCollapse ? '60px' : '180px'" class="common-aside w-p-100">
        <MyMenu :isCollapse="isCollapse"></MyMenu>
      </el-aside>
      <el-container>
        <el-header class="common-header flex align-center">
          <el-icon :size="24" color="#409efc" @click="isCollapse = !isCollapse">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
          <Breadcrumb class="ml-10"></Breadcrumb>
          <Personal class="flex-item-right"></Personal>
        </el-header>
        <el-main class="flex-col">
          <Tag></Tag>
          <div class="flex1 bg-white common-main">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import MyMenu from './components/menu.vue'
import Tag from './components/tag.vue'
import Breadcrumb from './components/breadcrumb.vue'
import Personal from './components/personal.vue'
import { useUserStore } from '@/stores/userstore'
import { ElMessage } from 'element-plus'
import { EnterpriseInfoService } from '@/api/user'

const isCollapse = ref(false)

const userstore = useUserStore();
const getEnterpriseInfo = async () => {

  let res = await EnterpriseInfoService();
  if (res) {
    userstore.setUserInfo(res.data.username, res.data.useravatar);
  }
  else {
    ElMessage.error("无法访问，请尝试重新登陆");

  }

}
onMounted(() => {

  getEnterpriseInfo();



})
</script>
<style scoped>
.common-aside {
  background: #fff;
  box-shadow: #d8d8d8 1px 1px 15px 1px;
  z-index: 1;
  transition: width 0.2s ease-in-out;
}

.common-header {
  background: #fff;
  box-shadow: #d8d8d8 1px 1px 5px 1px;

}

.common-main {
  border-radius: 0 0 5px 5px;
}
</style>
