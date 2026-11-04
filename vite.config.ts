import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeManifestIcons: false,
      workbox: {
        // Default only precaches js/css/html; images and fonts are needed offline too.
        globPatterns: ['**/*.{js,css,html,png,ico,svg,woff2}'],
      },
      manifest: {
        id: '/',
        name: 'CheckChamp',
        short_name: 'CheckChamp',
        lang: 'fr',
        description: 'Organisez votre quotidien avec CheckChamp : listes de courses, listes de tâches et plus encore.',
        theme_color: '#fa6c08',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
