import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
// https://vitejs.dev/config/
import path from 'path'
export default defineConfig({
  plugins: [react(),
    createStyleImportPlugin(
      {
        libs: [
          {
            libraryName: 'zarm',
            esModules: true,
            resolveStyle: (name) => {
              return `zarm/es/${name}/style/css`
            }
          }
        ]
      })
    ],
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        // 当遇到 /api 路径时，将其转换成 target 的值
        target: 'http://localhost:7001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 将 /api 重写为空
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(path.resolve(), 'src'), // src 路径
      'utils': path.resolve(path.resolve(), 'src/utils') // src 路径
    }
  },
})
