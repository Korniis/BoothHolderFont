import { reactive } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userstore', () => {
  // 使用 reactive 创建响应式的 userinfo 对象
  const userinfo = reactive({
    username: '',   // 用户名
    useravatar: '', // 用户头像
    token: localStorage.getItem('token') || '', // 从 localStorage 获取 token（如果有）
  });

  // 更新用户信息的方法
  const setUserInfo = (username, useravatar) => {
    userinfo.username = username;
    userinfo.useravatar = useravatar;
  };

  // 设置 token
  const setToken = (token) => {
    userinfo.token = token;
    localStorage.setItem('token', token); // 将 token 保存到 localStorage
  };

  // 清除用户信息和 token
  const clearUserInfo = () => {
    userinfo.username = '';
    userinfo.useravatar = '';
    userinfo.token = '';
    localStorage.removeItem('token'); // 清除 localStorage 中的 token
  };

  return { userinfo, setUserInfo, setToken, clearUserInfo };
});
