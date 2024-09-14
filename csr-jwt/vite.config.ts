import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      generatedRouteTree: 'src/route-tree.gen.ts',
    }),
    tsconfigPaths(),
    react(),
  ],
})
