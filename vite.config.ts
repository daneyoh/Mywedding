import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 아래 내용을 추가합니다.
    allowedHosts: [
      "plain-dryers-hug.loca.lt"
    ]
  }
})