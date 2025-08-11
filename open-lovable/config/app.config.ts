// Application Configuration
// This file contains all configurable settings for the application

export const appConfig = {
  // E2B Sandbox Configuration
  e2b: {
    // Sandbox timeout in minutes
    timeoutMinutes: 15,
    
    // Convert to milliseconds for E2B API
    get timeoutMs() {
      return this.timeoutMinutes * 60 * 1000;
    },
    
    // Vite development server port
    vitePort: 5173,
    
    // Time to wait for Vite to be ready (in milliseconds)
    viteStartupDelay: 7000,
    
    // Time to wait for CSS rebuild (in milliseconds)
    cssRebuildDelay: 2000,
    
    // Default sandbox template (if using templates)
    defaultTemplate: undefined, // or specify a template ID
  },
  
  // AI Model Configuration
  ai: {
    // Default AI model
    defaultModel: 'google/gemini-2.5-flash',
    
    // Available models
    availableModels: [
      'openai/gpt-5',
      'moonshotai/kimi-k2-instruct',
      'anthropic/claude-sonnet-4-20250514',
      // Gemini models (latest versions)
      'google/gemini-2.5-pro',
      'google/gemini-2.5-flash',
      'google/gemini-2.5-flash-lite',
      'google/gemini-2.0-flash',
      'google/gemini-2.0-flash-thinking-exp',
      // OpenRouter free models (latest)
      'openrouter/meta-llama/llama-4-maverick:free',
      'openrouter/meta-llama/llama-4-scout:free',
      'openrouter/meta-llama/llama-3.3-70b-instruct:free',
      'openrouter/deepseek/deepseek-chat-v3-0324:free',
      'openrouter/deepseek/deepseek-r1:free',
      'openrouter/google/gemini-2.5-pro-exp-03-25:free',
      'openrouter/google/gemini-2.0-flash-thinking-exp:free',
      'openrouter/google/gemini-2.0-flash-exp:free',
      'openrouter/nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
      'openrouter/google/gemma-3-27b-it:free',
      'openrouter/qwen/qwq-32b:free',
      // Newly added OpenRouter free models
      'openrouter/qwen/qwen3-coder:free',
      'openrouter/deepseek/deepseek-r1-0528:free',
      'openrouter/z-ai/glm-4.5-air:free'
    ],
    
    // Model display names
    modelDisplayNames: {
      'openai/gpt-5': 'GPT-5',
      'moonshotai/kimi-k2-instruct': 'Kimi K2 Instruct',
      'anthropic/claude-sonnet-4-20250514': 'Claude Sonnet 4',
      // Gemini models (latest versions)
      'google/gemini-2.5-pro': 'Gemini 2.5 Pro',
      'google/gemini-2.5-flash': 'Gemini 2.5 Flash',
      'google/gemini-2.5-flash-lite': 'Gemini 2.5 Flash Lite',
      'google/gemini-2.0-flash': 'Gemini 2.0 Flash',
      'google/gemini-2.0-flash-thinking-exp': 'Gemini 2.0 Flash Thinking (Exp)',
      // OpenRouter free models (latest)
      'openrouter/meta-llama/llama-4-maverick:free': 'Llama 4 Maverick (Free)',
      'openrouter/meta-llama/llama-4-scout:free': 'Llama 4 Scout (Free)',
      'openrouter/meta-llama/llama-3.3-70b-instruct:free': 'Llama 3.3 70B (Free)',
      'openrouter/deepseek/deepseek-chat-v3-0324:free': 'DeepSeek Chat V3 (Free)',
      'openrouter/deepseek/deepseek-r1:free': 'DeepSeek R1 (Free)',
      'openrouter/google/gemini-2.5-pro-exp-03-25:free': 'Gemini 2.5 Pro Exp (Free)',
      'openrouter/google/gemini-2.0-flash-thinking-exp:free': 'Gemini 2.0 Flash Thinking (Free)',
      'openrouter/google/gemini-2.0-flash-exp:free': 'Gemini 2.0 Flash Exp (Free)',
      'openrouter/nvidia/llama-3.1-nemotron-ultra-253b-v1:free': 'Llama 3.1 Nemotron Ultra 253B (Free)',
      'openrouter/google/gemma-3-27b-it:free': 'Gemma 3 27B IT (Free)',
      'openrouter/qwen/qwq-32b:free': 'Qwen QwQ 32B (Free)',
      // Newly added OpenRouter free models
      'openrouter/qwen/qwen3-coder:free': 'Qwen3 Coder (Free)',
      'openrouter/deepseek/deepseek-r1-0528:free': 'DeepSeek R1-0528 (Free)',
      'openrouter/z-ai/glm-4.5-air:free': 'GLM 4.5 Air (Free)'
    },
    
    // Temperature settings for non-reasoning models
    defaultTemperature: 0.7,
    
    // Max tokens for code generation
    maxTokens: 8000,
    
    // Max tokens for truncation recovery
    truncationRecoveryMaxTokens: 4000,
  },
  
  // Code Application Configuration
  codeApplication: {
    // Delay after applying code before refreshing iframe (milliseconds)
    defaultRefreshDelay: 2000,
    
    // Delay when packages are installed (milliseconds)
    packageInstallRefreshDelay: 5000,
    
    // Enable/disable automatic truncation recovery
    enableTruncationRecovery: false, // Disabled - too many false positives
    
    // Maximum number of truncation recovery attempts per file
    maxTruncationRecoveryAttempts: 1,
  },
  
  // UI Configuration
  ui: {
    // Show/hide certain UI elements
    showModelSelector: true,
    showStatusIndicator: true,
    
    // Animation durations (milliseconds)
    animationDuration: 200,
    
    // Toast notification duration (milliseconds)
    toastDuration: 3000,
    
    // Maximum chat messages to keep in memory
    maxChatMessages: 100,
    
    // Maximum recent messages to send as context
    maxRecentMessagesContext: 20,
  },
  
  // Development Configuration
  dev: {
    // Enable debug logging
    enableDebugLogging: true,
    
    // Enable performance monitoring
    enablePerformanceMonitoring: false,
    
    // Log API responses
    logApiResponses: true,
  },
  
  // Package Installation Configuration
  packages: {
    // Use --legacy-peer-deps flag for npm install
    useLegacyPeerDeps: true,
    
    // Package installation timeout (milliseconds)
    installTimeout: 60000,
    
    // Auto-restart Vite after package installation
    autoRestartVite: true,
  },
  
  // File Management Configuration
  files: {
    // Excluded file patterns (files to ignore)
    excludePatterns: [
      'node_modules/**',
      '.git/**',
      '.next/**',
      'dist/**',
      'build/**',
      '*.log',
      '.DS_Store'
    ],
    
    // Maximum file size to read (bytes)
    maxFileSize: 1024 * 1024, // 1MB
    
    // File extensions to treat as text
    textFileExtensions: [
      '.js', '.jsx', '.ts', '.tsx',
      '.css', '.scss', '.sass',
      '.html', '.xml', '.svg',
      '.json', '.yml', '.yaml',
      '.md', '.txt', '.env',
      '.gitignore', '.dockerignore'
    ],
  },
  
  // API Endpoints Configuration (for external services)
  api: {
    // Retry configuration
    maxRetries: 3,
    retryDelay: 1000, // milliseconds
    
    // Request timeout (milliseconds)
    requestTimeout: 30000,
  }
};

// Type-safe config getter
export function getConfig<K extends keyof typeof appConfig>(key: K): typeof appConfig[K] {
  return appConfig[key];
}

// Helper to get nested config values
export function getConfigValue(path: string): any {
  return path.split('.').reduce((obj, key) => obj?.[key], appConfig as any);
}

export default appConfig;