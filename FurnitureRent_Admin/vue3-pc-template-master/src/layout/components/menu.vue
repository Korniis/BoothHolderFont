<template>
  <div class="logo-container flex-center">
    <img class="logo-icon" src="../../../../public/img/logo.png" />
    <text v-if="!isCollapse">管理员后台</text>
  </div>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    router
    unique-opened
    :collapse="isCollapse"
    @select="changeMenu"
  >
    <el-menu-item index="/dashboard">
      <el-icon><Menu /></el-icon>
      <template #title>首页</template>
    </el-menu-item>
    <el-menu-item index="/booth">
      <el-icon><Platform /></el-icon>
      <template #title>摊位管理</template>
    </el-menu-item>

    <el-sub-menu v-for="item in routerList" :index="item.path" :key="item.name">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon" />
        </el-icon>
        <span v-show="!isCollapse">
          {{ item.meta.breadcrumbName }}
        </span>
      </template>
      <el-menu-item
        v-for="ite in item.children"
        :index="item.path+ '/'+ ite.path"
        :key="ite.name"
        >{{ ite.meta.breadcrumbName }}</el-menu-item
      >
    </el-sub-menu>
  </el-menu>
</template>

  <script setup>
import router from "@/router";
import { useAuthRouterStore } from "@/stores/authRouter.js";
import { useTagStore } from "@/stores/tagList.js";
const tagStore = useTagStore();
const routerOptions = router.getRoutes()

const authRouterStore = useAuthRouterStore();
const props = defineProps(["isCollapse"]);
const routerList = authRouterStore.routerList;
const changeMenu = (menu) => {
  let obj = routerOptions.find(val => val.path == menu)
  tagStore.addTagList({
  name:obj.path,
  breadcrumbName:obj.meta.breadcrumbName
})

}
</script>

  <style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180;
}
.logo-container {
  width: 100%;
  height: 60px;
  overflow: hidden;
}
.logo-icon {
  height: 60px;
  scale: 1.4;
}
</style>
