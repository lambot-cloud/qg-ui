import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@babel/runtime': '@babel/runtime',
      '@babel/runtime/helpers/esm': '@babel/runtime/helpers'
    }
  },
  optimizeDeps: {
    include: [
      '@babel/runtime/helpers/extends',
      '@babel/runtime/helpers/interopRequireDefault',
      '@mui/material',
      '@mui/system',
      '@emotion/react',
      '@emotion/styled'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    commonjsOptions: {
      include: [/@babel\/runtime/, /node_modules/],
      transformMixedEsModules: true
    },
    target: 'es2015'
  }
})
