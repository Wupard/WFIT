import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        includeAssets: ['favicon.jpg', 'app-logo.jpg'],
        manifest: {
          name: "WFIT - Smart Fitness Assistant",
          short_name: "WFIT",
          description: "Your personal aesthetic fitness assistant.",
          theme_color: "#14110F",
          background_color: "#14110F",
          display: "standalone",
          start_url: "/",
          icons: [
            {
              src: "/app-logo.jpg",
              sizes: "192x192",
              type: "image/jpeg"
            },
            {
              src: "/app-logo.jpg",
              sizes: "512x512",
              type: "image/jpeg"
            }
          ]
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
