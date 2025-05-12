<template>
  <div class="login-container flex">
    <img src="../../../public/img/login-left.png" class="login-left" />
    <div class="login-right flex flex-col">
      <div class="fz-20 text-center text-bold">欢迎登录XX管理平台</div>
      <div class="text-center mb-20">WELCOME</div>
      <el-form :model="form"  :rules="rules" ref="ruleForm">
        <el-form-item class="login-input flex" prop="Username">
          <el-icon class="flex1"><User /></el-icon>
          <el-input
            class="login-input-right"
            v-model="form.Username"
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item class="login-input flex" prop="password">
          <el-icon class="flex1"><Lock /></el-icon>
          <el-input
            class="login-input-right"
            v-model="form.password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item>
            <el-checkbox class="login-remember mb-10" v-model="remember" label="记住密码" />
        </el-form-item>
        <el-form-item>
            <el-button class="login-btn w-p-100" type="primary" @click="onSubmit()">立即登录</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import { ref, reactive } from "vue";
import {getDynamicRoutes} from '@/utils/getData.js'
import {getAuthRouters} from '@/router/authRouter.js'
import { useAuthRouterStore } from '@/stores/authRouter.js'
import { AdminLoginService } from "@/api/login";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/userstore";

const authRouterStore = useAuthRouterStore()
const ruleForm = ref(null)
const form = reactive({
  Username: "",
  password: "",
});

const remember = ref(false)

const rules = {
  Username: [
    { required: true, message: '请输入账号', trigger: 'blur'}
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur'}
  ],
}
const userStore=useUserStore();
const onSubmit = () => {
    ruleForm.value.validate(async(valid) => {
        if(valid) {
            // 其他登录逻辑

            console.log("发送请求");
            const res = await AdminLoginService(form);
            if(res){

            // 成功后将token存到session
            userStore.setToken(res.data);

            // 获取动态路由
            let dynamicRoutes = await getDynamicRoutes()

            // 动态添加路由

            let newRoutes = getAuthRouters(dynamicRoutes)
            authRouterStore.addRouterList(newRoutes)
            newRoutes.forEach(val => {
              router.addRoute(val)
            })
            ElMessage.success("登录成功!");

            router.push('/dashboard')
          }
          else{
            ElMessage.error(res.message);
          }

        }

    })

}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: url("../../../public/img/login.png") no-repeat;
  background-size: cover;
}
.login-left {
  width: 58%;
  height: 100%;
}
.login-right {
  width: 25%;
  height: 56%;
  background-color: #fff;
  margin: auto;
  border-radius: 10px;
  box-shadow: #b3d2fb 1px 1px 15px 1px;
  padding: 40px 30px;
}
.login-input {
    height:50px;
  border: 1px solid #b3d2fb;
  border-radius: 5px;
  background: rgba(231, 241, 253, 0.4);
}
.login-input-right {
  width: 80%;
  height: 60%;
  border-left: 1px solid #ccc;
}
.login-remember {
    font-size: 12px;
}
.login-btn {
    height: 40px;
}
</style>
<style>
.login-input-right .el-input__wrapper {
  border: none !important;
  box-shadow: none !important;
  background: transparent;
}
.login-remember .el-checkbox__label {
    font-size: 12px;
    color:#aaa;
}
</style>
