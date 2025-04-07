// Configuration settings for the application
// In a production environment, these would come from environment variables

const config = {
  // OpenRouter configuration
  ai: {
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || 'your_openrouter_api_key_here',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'anthropic/claude-3-sonnet-20240229',
  },
  
  // Application settings
  app: {
    name: 'CEY Invoice Generator',
    version: '1.0.0',
  }
};

export default config; 