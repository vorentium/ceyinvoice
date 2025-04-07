// AI Service
// This service handles communication with Claude 3.7 Sonnet via OpenRouter
import config from '../config/config';

// Base prompt for terms and conditions generation
const TERMS_PROMPT = `Generate comprehensive, professional invoice terms and conditions for the specified business type. 
Include payment terms, delivery terms, returns/refunds policy, liability limitations, and any specific terms relevant to the industry.
Format it in clear sections with appropriate legal language but easy to understand.`;

// Base prompt for price suggestions
const PRICE_PROMPT = `Based on the provided product or service name, suggest a reasonable market price in USD.
Consider typical pricing for similar products/services in the current market.
Only respond with a numeric value (no currency symbols or text).`;

// Base prompt for document analysis
const DOCUMENT_ANALYSIS_PROMPT = `Extract relevant invoice data from the following document content. 
If this is a binary file (PDF/DOCX), extract any information from the metadata provided.
Format the response as a structured JSON object with these fields (include only if found in document):
{
  "company": {
    "name": "",
    "phone": "",
    "address": ""
  },
  "customer": {
    "name": "",
    "phone": "",
    "address": ""
  },
  "invoice": {
    "number": "",
    "issueDate": "", 
    "dueDate": ""
  },
  "items": [
    {
      "description": "",
      "quantity": "",
      "price": ""
    }
  ],
  "payment": {
    "method": "",
    "bankName": "",
    "accountNumber": "",
    "sortCode": "",
    "reference": ""
  }
}

Only extract information that is clearly invoice-related. Return only the JSON object without any additional text.`;

// Function to send a message to Claude 3.7 Sonnet via OpenRouter
export const sendMessageToAI = async (prompt) => {
  try {
    // Format messages for API
    const formattedMessages = [
      { role: 'system', content: 'You are a helpful assistant for invoice generation.' },
      { role: 'user', content: prompt }
    ];

    // Make the API request
    const response = await fetch(config.ai.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.ai.apiKey}`,
        'HTTP-Referer': window.location.origin, // Required by OpenRouter
        'X-Title': config.app.name // Optional - your app's name
      },
      body: JSON.stringify({
        model: config.ai.model,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error in API call:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate terms and conditions based on business type
export const generateTermsAndConditions = async (businessType) => {
  const prompt = `${TERMS_PROMPT}\nBusiness Type: ${businessType}`;
  return sendMessageToAI(prompt);
};

// Generate price suggestion based on product/service name
export const generatePriceSuggestion = async (productName) => {
  const prompt = `${PRICE_PROMPT}\nProduct/Service: ${productName}`;
  try {
    const response = await sendMessageToAI(prompt);
    if (response.success) {
      // Try to extract just the number from the response
      const priceMatch = response.message.match(/\d+(\.\d+)?/);
      if (priceMatch) {
        return {
          success: true,
          price: parseFloat(priceMatch[0])
        };
      }
      return {
        success: true,
        price: response.message.trim()
      };
    }
    return response;
  } catch (error) {
    console.error('Error generating price suggestion:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Analyze document content and extract invoice data
export const analyzeDocument = async (fileContent) => {
  try {
    const isBinaryFile = fileContent.includes("This is a binary file");
    let prompt = `${DOCUMENT_ANALYSIS_PROMPT}\n\n`;
    
    if (isBinaryFile) {
      prompt += `File metadata:\n${fileContent}\n\nNote: Only basic metadata is available for this binary file.`;
    } else {
      prompt += `Document content:\n${fileContent}`;
    }
    
    const response = await sendMessageToAI(prompt);
    
    if (response.success) {
      try {
        // Try to parse the JSON response
        const jsonMatch = response.message.match(/({[\s\S]*})/);
        const jsonString = jsonMatch ? jsonMatch[0] : response.message;
        const parsedData = JSON.parse(jsonString);
        
        return {
          success: true,
          message: "Document analyzed successfully",
          parsedData: parsedData
        };
      } catch (parseError) {
        console.error("Error parsing JSON from AI response:", parseError);
        return {
          success: false,
          error: "Failed to parse extracted data"
        };
      }
    }
    
    return response;
  } catch (error) {
    console.error("Error analyzing document:", error);
    return {
      success: false,
      error: error.message
    };
  }
}; 