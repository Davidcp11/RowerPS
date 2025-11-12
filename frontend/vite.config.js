import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Importe o 'path' do Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // --- ADICIONE ESTE BLOCO ---
  // Isso força o Vite a usar o React da nossa
  // pasta node_modules local, resolvendo o conflito.
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
  server: {
    fs: {
      allow: [
        // Permite servir arquivos do diretório raiz do projeto (um nível acima)
        path.resolve(__dirname, '..')
      ]
    }
  }
  // --- FIM DO BLOCO ---
});
