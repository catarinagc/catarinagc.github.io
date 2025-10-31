import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        project1: resolve(__dirname, 'projects/rayTracer.html'),
        project2: resolve(__dirname, 'projects/rollCredits.html'),
        project3: resolve(__dirname, 'projects/thesis.html'),
        project4: resolve(__dirname, 'projects/viDahsboard.html'),
        project5: resolve(__dirname, 'projects/waterSim.html')
      }
    }
  }
})
