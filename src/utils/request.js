//定制请求的实例
//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/userstore';
import router from '@/router';
//定义一个变量,记录公共的前缀  ,  baseURL
//配置代理解决跨域问题
const baseURL = '/api';
const instance = axios.create({baseURL});
instance.defaults.headers.post['Content-Type'] = 'application/json';
//添加请求拦截器
instance.interceptors.request.use(
    (config)=>{
        //请求前的回调
        //添加token
        const UserStore = useUserStore();
        if(UserStore.userinfo.token){
            config.headers.Authorization ="Bearer " +UserStore.userinfo.token
        }
        return config;
    },
    (err)=>{//请求错误的回调
        Promise.reject(err);
    }
)
//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        //判断业务状态码
        if(result.data.code === 200){
            //成功
            return result.data;
           }
        //失败
        ElMessage.error(result.data.message?result.data.message:'服务异常');
        return Promise.reject(result.data);//异步的状态转化成失败的状态
    },
    err=>{
        if(err.response.status===401){
          const UserStore = useUserStore();
          if (UserStore.userinfo.token) UserStore.clearUserInfo();

            ElMessage.error('请先登录');
            router.push('/login');
        }else{
            ElMessage.error('服务异常');
        }
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)
export default instance;
