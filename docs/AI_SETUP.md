# Setting Up Claude 3.7 Sonnet via OpenRouter for CeyAI Support

This document provides step-by-step instructions for setting up the CeyAI Support feature with Claude 3.7 Sonnet using OpenRouter.

## Prerequisites
- An account with [OpenRouter](https://openrouter.ai)
- Basic knowledge of React and Vite applications

## Steps to Set Up

### 1. Sign Up for OpenRouter
1. Visit [OpenRouter](https://openrouter.ai) and sign up for an account if you don't have one
2. Navigate to the API section and create an API key

### 2. Configure Environment Variables
1. In the root directory of the project, create or modify the `.env` file
2. Add your OpenRouter API key:
   ```
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```
3. Replace `your_openrouter_api_key_here` with your actual API key

### 3. Verify Configuration
1. Check that the application is correctly reading the API key
2. In `src/config/config.js`, ensure that the following settings are present:
   ```javascript
   ai: {
     apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || 'your_openrouter_api_key_here',
     endpoint: 'https://openrouter.ai/api/v1/chat/completions',
     model: 'anthropic/claude-3-sonnet-20240229',
   }
   ```

### 4. Testing the AI Support
1. Start the application by running `npm run dev`
2. Open the Creator Studio and test the AI features:
   - Click on the AI support bubble in the lower right corner
   - Generate terms and conditions for your business type
   - Observe automatic price suggestions as you type item descriptions

## AI Features
The current implementation provides three main AI features powered by Claude 3.7 Sonnet:

### 1. Automatic Price Suggestions
When you type a product or service name in the invoice items section, Claude will automatically suggest a reasonable price based on the description.

### 2. Terms and Conditions Generation
You can generate professional terms and conditions for your invoice based on your business type by clicking the terms generation button in the AI support chat.

### 3. Document Analysis
Upload text documents, PDFs, or Word files containing invoice information, and Claude will extract relevant data to auto-fill your invoice form. This includes:
- Company and customer information
- Invoice numbers and dates
- Line items with descriptions, quantities, and prices
- Payment details

To use this feature:
1. Click on the AI support bubble
2. Select "Analyze Document"
3. Upload your document
4. Wait for the AI to extract the data
5. The form will be automatically populated with the extracted information

Note: For PDF and DOCX files, only basic metadata can be extracted directly due to browser limitations. For best results, use text files.

## Troubleshooting
If you encounter issues:
1. Check that your API key is correct
2. Ensure that the `.env` file is in the root directory
3. Verify that Vite is correctly loading environment variables (check browser console for errors)
4. Check the OpenRouter documentation for any API changes or issues

## Security Considerations
Remember to:
- Never commit your API key to version control
- Use environment variables for production deployments
- Follow OpenRouter and Anthropic's usage policies when implementing AI features

For additional help, refer to the [OpenRouter documentation](https://openrouter.ai/docs) and [Claude documentation](https://docs.anthropic.com/claude/docs). 