#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build de produção...');

try {
  // Limpar diretório dist
  if (fs.existsSync('dist')) {
    console.log('🧹 Limpando diretório dist...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build do cliente
  console.log('📦 Build do frontend...');
  execSync('npm run build:client', { stdio: 'inherit' });

  // Copiar arquivos de configuração
  console.log('📋 Copiando arquivos de configuração...');
  
  // Copiar .htaccess para dist/client
  if (fs.existsSync('public/.htaccess')) {
    fs.copyFileSync('public/.htaccess', 'dist/client/.htaccess');
  }

  // Copiar manifest.json
  if (fs.existsSync('public/manifest.json')) {
    fs.copyFileSync('public/manifest.json', 'dist/client/manifest.json');
  }

  // Criar arquivo de configuração para diferentes plataformas
  const deployConfig = {
    netlify: {
      buildCommand: 'npm run build',
      publishDirectory: 'dist/client',
      redirects: [
        { from: '/*', to: '/index.html', status: 200 }
      ]
    },
    vercel: {
      buildCommand: 'npm run build',
      outputDirectory: 'dist/client',
      rewrites: [
        { source: '/(.*)', destination: '/index.html' }
      ]
    },
    hostinger: {
      uploadDirectory: 'dist/client',
      htaccess: true
    }
  };

  fs.writeFileSync(
    'dist/client/deploy-config.json',
    JSON.stringify(deployConfig, null, 2)
  );

  // Criar arquivo de instruções de deploy
  const deployInstructions = `# 🚀 Instruções de Deploy

## Netlify
1. Conecte seu repositório no Netlify
2. Build command: \`npm run build\`
3. Publish directory: \`dist/client\`
4. O arquivo netlify.toml já está configurado

## Vercel
1. Conecte seu repositório no Vercel
2. Framework: Vite
3. Build command: \`npm run build\`
4. Output directory: \`dist/client\`
5. O arquivo vercel.json já está configurado

## Hostinger
1. Faça upload dos arquivos da pasta \`dist/client\`
2. O arquivo .htaccess já está configurado
3. Certifique-se de que o mod_rewrite está habilitado

## Variáveis de Ambiente
Configure as seguintes variáveis de ambiente no seu provedor:
- NODE_ENV=production
- PORT=3001 (se aplicável)

## URLs de API
Para produção, você precisará configurar as URLs das APIs no frontend.
`;

  fs.writeFileSync('dist/client/DEPLOY.md', deployInstructions);

  console.log('✅ Build de produção concluído!');
  console.log('📁 Arquivos gerados em: dist/client/');
  console.log('📋 Instruções de deploy em: dist/client/DEPLOY.md');

} catch (error) {
  console.error('❌ Erro no build:', error.message);
  process.exit(1);
}