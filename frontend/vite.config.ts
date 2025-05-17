/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // src를 @로 참조
    },
  },
  server: {
    port: 3000, // 프론트엔드 서버 주소를 http://localhost:7777로 변경
    open: true,
    proxy: {
      '/api': {
          target: 'http://localhost:7777', // 백엔드 서버 URL
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
})