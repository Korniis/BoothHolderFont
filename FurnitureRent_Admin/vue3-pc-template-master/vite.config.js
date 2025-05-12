import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server:{
    proxy:{
      '/api':{//获取路径中包含/api的请求
          target:'https://localhost:7160/api',//后台服务器所在的源
          changeOrigin:true,//是否修改源
          secure: false, // Disable SSL verification for self-signed certificates
          // Handle the bypass logic and log the real URL
          rewrite:(path)=>path.replace(/^\/api/,''),//将/api替换为'',
          bypass(req, res, options) {
            const realUrl = options.target + (options.rewrite ? options.rewrite(req.url) : '');
            console.log(realUrl); // 在终端显示
            res.setHeader('A-Real-Url', realUrl);
          }
        },
      }

  }
})
