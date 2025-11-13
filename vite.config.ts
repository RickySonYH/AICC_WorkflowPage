import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // [advice from AI] Docker 환경에서 파일 변경 감지를 위해 polling 사용
    },
  },
  optimizeDeps: {
    force: true, // [advice from AI] 의존성 최적화를 강제로 다시 수행
  },
})
