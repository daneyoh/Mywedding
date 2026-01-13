import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 아래 define 설정이 없으면 옛날 라이브러리들이 process를 찾다가 에러가 납니다.
  define: {
    'process.env': {},
  },
})