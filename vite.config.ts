import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import electron from 'vite-plugin-electron/simple';

// https://vite.dev/config/
export default defineConfig({
  base: './', // 关键修复：确保打包后的相对路径正确
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              output: {
                entryFileNames: '[name].mjs',
                chunkFileNames: '[name].mjs',
              }
            }
          }
        }
      },
      preload: {
        input: 'electron/preload.ts',
        vite: {
          build: {
            rollupOptions: {
              output: {
                entryFileNames: '[name].mjs',
                chunkFileNames: '[name].mjs',
              }
            }
          }
        }
      },
      renderer: process.env.NODE_ENV === 'test'
        ? undefined
        : {},
    }),
  ],
})
