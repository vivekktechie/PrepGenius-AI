import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/supabase': {
        target: 'https://jdhshnrtesesseymxqal.supabase.co',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/supabase/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Remove cookies to prevent 431 errors from Supabase
            proxyReq.removeHeader('cookie');
            proxyReq.removeHeader('Cookie');
            
            // Set Origin and Referer to match target to satisfy GoTrue security checks
            const target = 'https://jdhshnrtesesseymxqal.supabase.co';
            proxyReq.setHeader('Origin', target);
            proxyReq.setHeader('Referer', target);
          });
        }
      }
    }
  }
})
