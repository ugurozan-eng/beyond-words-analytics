import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // 1. Ortam değişkenlerini zorla yükle
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    // 2. Değişkenleri kodun içine manuel olarak göm
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    },
  }
})