import React, { useState, useEffect, useRef } from 'react';
import { generateTermsAndConditions, generatePriceSuggestion, analyzeDocument } from '../../services/aiService';

// Language translations
const translations = {
  en: {
    aiSupport: "AI Support",
    businessType: "Select your business type",
    otherBusinessType: "Other business type:",
    generateBtn: "Generate",
    generating: "Generating...",
    cancel: "Cancel",
    termsAndConditions: "Generate Terms and Conditions",
    whatYouCanDo: "What can I do for you?",
    generateTerms: "Generate terms & conditions",
    getPrices: "Get price suggestions",
    autoSuggestions: "Price suggestions appear automatically when adding products",
    analyzeDocument: "Analyze Document",
    uploadDocument: "Upload & analyze documents",
    documentType: "Supported formats: .txt, .pdf, .docx",
    customBusiness: "Or enter custom business type",
    submitCustom: "Submit",
    applyTerms: "Apply Terms",
    businessTypePrompt: "Select your business type:",
    analyzing: "Analyzing..."
  },
  si: {
    aiSupport: "AI සහාය",
    businessType: "ඔබේ ව්‍යාපාර වර්ගය තෝරන්න",
    otherBusinessType: "වෙනත් ව්‍යාපාර වර්ගයක්:",
    generateBtn: "ජනනය කරන්න",
    generating: "ජනනය වෙමින්...",
    cancel: "අවලංගු කරන්න",
    termsAndConditions: "කොන්දේසි සහ නියමයන් ජනනය කරන්න",
    whatYouCanDo: "මට ඔබට උදව් කළ හැක්කේ කුමක්ද?",
    generateTerms: "කොන්දේසි සහ නියමයන් ජනනය කරන්න",
    getPrices: "මිල යෝජනා ලබා ගන්න",
    autoSuggestions: "නිෂ්පාදන එකතු කිරීමේදී මිල යෝජනා ස්වයංක්‍රීයව දිස් වේ",
    analyzeDocument: "ලේඛනය විශ්ලේෂණය කරන්න",
    uploadDocument: "ලේඛන උඩුගත කර විශ්ලේෂණය කරන්න",
    documentType: "සහාය දක්වන ආකෘති: .txt, .pdf, .docx",
    customBusiness: "හෝ අභිරුචි ව්‍යාපාර වර්ගය ඇතුළත් කරන්න",
    submitCustom: "ඉදිරිපත් කරන්න",
    applyTerms: "කොන්දේසි යොදන්න",
    businessTypePrompt: "ඔබේ ව්‍යාපාර වර්ගය තෝරන්න:",
    analyzing: "විශ්ලේෂණය කරමින්..."
  },
  ta: {
    aiSupport: "செயற்கை நுண்ணறிவு ஆதரவு",
    businessType: "உங்கள் வணிக வகையைத் தேர்ந்தெடுக்கவும்",
    otherBusinessType: "வேறு வணிக வகை:",
    generateBtn: "உருவாக்கு",
    generating: "உருவாக்குகிறது...",
    cancel: "ரத்து செய்",
    termsAndConditions: "விதிமுறைகள் மற்றும் நிபந்தனைகளை உருவாக்கவும்",
    whatYouCanDo: "நான் உங்களுக்கு என்ன உதவ முடியும்?",
    generateTerms: "விதிமுறைகளை உருவாக்கவும்",
    getPrices: "விலை பரிந்துரைகளைப் பெறுங்கள்",
    autoSuggestions: "தயாரிப்புகளைச் சேர்க்கும்போது விலை பரிந்துரைகள் தானாகவே தோன்றும்",
    analyzeDocument: "ஆவணத்தை பகுப்பாய்வு செய்யுங்கள்",
    uploadDocument: "ஆவணங்களை பதிவேற்றி பகுப்பாய்வு செய்யுங்கள்",
    documentType: "ஆதரிக்கப்படும் வடிவங்கள்: .txt, .pdf, .docx",
    customBusiness: "அல்லது விருப்ப வணிக வகையை உள்ளிடவும்",
    submitCustom: "சமர்ப்பிக்கவும்",
    applyTerms: "விதிமுறைகளைப் பயன்படுத்தவும்",
    businessTypePrompt: "உங்கள் வணிக வகையைத் தேர்ந்தெடுக்கவும்:",
    analyzing: "பகுப்பாய்வு செய்கிறது..."
  }
};

// Notification translations
const notificationTranslations = {
  en: {
    generatingTerms: 'Generating terms and conditions...',
    termsGenerated: 'Terms and conditions generated successfully!',
    termsError: 'Failed to generate terms. Please try again.',
    priceFetched: 'Price suggestion applied!',
    systemError: 'System error occurred. Please try again later.',
    analyzingDocument: 'Analyzing document...',
    analysisSuccess: 'Document analyzed and data extracted!',
    analysisError: 'Failed to extract data from document. Try another file.'
  },
  si: {
    generatingTerms: 'කොන්දේසි සහ නියමයන් ජනනය කරමින්...',
    termsGenerated: 'කොන්දේසි සහ නියමයන් සාර්ථකව ජනනය කරන ලදී!',
    termsError: 'කොන්දේසි ජනනය කිරීමට අපොහොසත් විය. කරුණාකර නැවත උත්සාහ කරන්න.',
    priceFetched: 'මිල යෝජනාව යොදන ලදී!',
    systemError: 'පද්ධති දෝෂයක් ඇති විය. කරුණාකර පසුව නැවත උත්සාහ කරන්න.',
    analyzingDocument: 'ලේඛනය විශ්ලේෂණය කරමින්...',
    analysisSuccess: 'ලේඛනය විශ්ලේෂණය කර දත්ත උපුටා ගන්නා ලදී!',
    analysisError: 'ලේඛනයෙන් දත්ත උපුටා ගැනීමට අපොහොසත් විය. වෙනත් ගොනුවක් උත්සාහ කරන්න.'
  },
  ta: {
    generatingTerms: 'விதிமுறைகளை உருவாக்குகிறது...',
    termsGenerated: 'விதிமுறைகள் வெற்றிகரமாக உருவாக்கப்பட்டன!',
    termsError: 'விதிமுறைகளை உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    priceFetched: 'விலை பரிந்துரை பயன்படுத்தப்பட்டது!',
    systemError: 'கணினி பிழை ஏற்பட்டது. பின்னர் மீண்டும் முயற்சிக்கவும்.',
    analyzingDocument: 'ஆவணத்தை பகுப்பாய்வு செய்கிறது...',
    analysisSuccess: 'ஆவணம் பகுப்பாய்வு செய்யப்பட்டு தரவு பிரித்தெடுக்கப்பட்டது!',
    analysisError: 'ஆவணத்திலிருந்து தரவுகளைப் பிரித்தெடுக்க முடியவில்லை. வேறு கோப்பை முயற்சிக்கவும்.'
  }
};

const CeyAISupport = ({ onApplyTerms, onApplyPrice, onApplyData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [companyTypePrompt, setCompanyTypePrompt] = useState(false);
  const [documentUploadPrompt, setDocumentUploadPrompt] = useState(false);
  const [businessTypes] = useState([
    'Retail', 
    'Wholesale', 
    'Manufacturing', 
    'Service', 
    'Construction', 
    'Technology', 
    'Healthcare',
    'Education',
    'Food and Beverage',
    'Transportation',
    'Consulting'
  ]);
  const [customBusinessType, setCustomBusinessType] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [language, setLanguage] = useState('en'); // Default language is English
  const fileInputRef = useRef(null);
  
  // Animation effect when opening/closing the widget
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);
  
  // Show a notification message
  const showNotification = (key, type = 'info', replacements = {}) => {
    // Get the appropriate translation based on current language
    const nt = notificationTranslations[language] || notificationTranslations.en;
    let message = nt[key];
    
    // If message is a function, call it with replacement values
    if (typeof message === 'function') {
      message = message(replacements.value);
    }
    
    // Set the notification
    setNotification({
      message,
      type
    });
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const generateTermsAndConditionsHandler = async (type) => {
    setIsLoading(true);
    showNotification('generatingTerms', 'info', { value: type });
    
    try {
      // Generate terms and conditions based on business type (always in English)
      const response = await generateTermsAndConditions(type);
      
      if (response.success) {
        onApplyTerms(response.message);
        showNotification('termsGenerated', 'success');
      } else {
        showNotification('termsError', 'error');
      }
    } catch (error) {
      console.error("Error generating terms and conditions:", error);
      showNotification('systemError', 'error');
    }
    
    setIsLoading(false);
    setCompanyTypePrompt(false);
  };
  
  const generatePriceSuggestionHandler = async (productName) => {
    if (!productName || productName.trim().length < 3) {
      showNotification('invalidProduct', 'error');
      return null;
    }
    
    setIsLoading(true);
    showNotification('generatingPrice', 'info', { value: productName });
    
    try {
      // Always get price suggestions in English
      const response = await generatePriceSuggestion(productName);
      
      if (response.success) {
        showNotification('priceFetched', 'success', { value: response.price });
        return response.price;
      } else {
        showNotification('priceError', 'error');
        return null;
      }
    } catch (error) {
      console.error("Error generating price suggestion:", error);
      showNotification('systemError', 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsLoading(true);
    showNotification('analyzingDocument', 'info');
    
    try {
      // Read the file content
      const fileContent = await readFileContent(file);
      
      // Analyze the document content
      const analysisResult = await analyzeDocument(fileContent);
      
      if (analysisResult.success && analysisResult.parsedData) {
        // Apply the extracted data to the form
        if (onApplyData) {
          onApplyData(analysisResult.parsedData);
        }
        showNotification('analysisSuccess', 'success');
      } else {
        showNotification('analysisError', 'error');
      }
    } catch (error) {
      console.error("Error analyzing document:", error);
      showNotification('systemError', 'error');
    } finally {
      setIsLoading(false);
      setDocumentUploadPrompt(false);
    }
  };
  
  // Helper function to read file content
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      if (file.type === 'application/pdf' || file.type.includes('docx')) {
        // For binary files, we'll just pass the file name and type
        // The actual parsing will be handled server-side or through a specialized library
        resolve(`File Name: ${file.name}\nFile Type: ${file.type}\nSize: ${file.size} bytes\n\nThis is a binary file. Only text content can be directly analyzed by the AI. Basic file info is provided instead.`);
      } else {
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        
        reader.onerror = (error) => {
          reject(error);
        };
        
        reader.readAsText(file);
      }
    });
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };
  
  // Get translations for current language
  const t = translations[language] || translations.en;
  
  return (
    <>
      {notification && (
        <div className={`fixed top-5 right-5 px-4 py-3 rounded-md shadow-lg z-50 flex items-center animate-fade-in-out
          ${notification.type === 'success' ? 'bg-green-500 text-white' : 
            notification.type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'}`}>
          {notification.type === 'success' && (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          )}
          {notification.type === 'error' && (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )}
          {notification.type === 'info' && (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          )}
          <span>{notification.message}</span>
        </div>
      )}
      
      {/* AI Support Button */}
            <button 
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-var-primary text-white p-3 rounded-full shadow-lg z-40 hover:bg-var-primary-dark transition-all transform hover:scale-110 active:scale-95 duration-200 animate-pulse-subtle"
        title={t.aiSupport}
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
        )}
            </button>
      
      {/* Hidden file input for document upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".txt,.pdf,.docx"
        className="hidden"
      />
      
      {/* AI Support Chat Widget */}
      {isOpen && (
        <div 
          className={`fixed bottom-20 right-5 z-40 max-w-sm w-96 bg-white rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          {/* Chat Header */}
          <div className="bg-var-primary p-4 text-white">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <h2 className="font-bold text-lg">{t.aiSupport}</h2>
          </div>
              <button 
                onClick={toggleChat}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Language Selector */}
            <div className="flex space-x-2 justify-end">
              <button 
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 text-xs rounded ${language === 'en' ? 'bg-white text-var-primary font-bold' : 'bg-var-primary-dark text-white'}`}
              >
                English
              </button>
              <button 
                onClick={() => changeLanguage('si')}
                className={`px-2 py-1 text-xs rounded ${language === 'si' ? 'bg-white text-var-primary font-bold' : 'bg-var-primary-dark text-white'}`}
              >
                සිංහල
              </button>
              <button 
                onClick={() => changeLanguage('ta')}
                className={`px-2 py-1 text-xs rounded ${language === 'ta' ? 'bg-white text-var-primary font-bold' : 'bg-var-primary-dark text-white'}`}
              >
                தமிழ்
              </button>
            </div>
          </div>
          
          {/* Chat Body */}
          <div className="p-4 bg-gray-50">
            {/* Terms and Conditions Generator Button */}
            {companyTypePrompt ? (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-medium text-gray-800 mb-3 text-xl">{t.businessType}</h3>
                
                {/* Business Type List */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {businessTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => generateTermsAndConditionsHandler(type)}
                      className="bg-var-accent py-2 px-3 rounded-md text-sm text-var-secondary hover:bg-gray-200 transition-colors text-left"
                      disabled={isLoading}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                
                {/* Custom Business Type */}
                <div className="mt-4">
                  <label htmlFor="customType" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.otherBusinessType}
                  </label>
                  <div className="flex">
              <input
                type="text"
                      id="customType"
                      value={customBusinessType}
                      onChange={(e) => setCustomBusinessType(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-var-primary"
                      placeholder={t.businessType}
                      disabled={isLoading}
              />
              <button 
                      onClick={() => generateTermsAndConditionsHandler(customBusinessType)}
                      className="bg-var-primary text-white px-4 py-2 rounded-r-md hover:bg-var-primary-dark disabled:opacity-50"
                      disabled={isLoading || !customBusinessType.trim()}
                    >
                      {isLoading ? t.generating : t.generateBtn}
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => setCompanyTypePrompt(false)}
                  className="w-full mt-4 py-2 px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {t.cancel}
                </button>
              </div>
            ) : documentUploadPrompt ? (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-medium text-gray-800 mb-3 text-xl">{t.analyzeDocument}</h3>
                
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-var-primary mb-3"></div>
                    <p className="text-var-primary font-medium">{t.analyzing}</p>
                  </div>
                ) : (
                  <div 
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-var-primary rounded-lg p-8 mb-4 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-10 h-10 mx-auto text-var-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="text-var-primary font-medium">{t.uploadDocument}</p>
                    <p className="text-var-secondary text-sm mt-1">{t.documentType}</p>
                  </div>
                )}
                
                <button
                  onClick={() => setDocumentUploadPrompt(false)}
                  className="w-full mt-2 py-2 px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {t.cancel}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md transition-all hover:shadow-lg">
                  <h3 className="font-medium text-var-primary mb-2">{t.whatYouCanDo}</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{t.generateTerms}</li>
                    <li>{t.getPrices}</li>
                    <li>{t.uploadDocument}</li>
                  </ul>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => setCompanyTypePrompt(true)}
                    className="bg-var-primary text-white px-4 py-3 rounded-lg hover:bg-var-primary-dark transition-colors flex items-center justify-center"
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                    {t.termsAndConditions}
              </button>
                  
                  <button
                    onClick={() => setDocumentUploadPrompt(true)}
                    className="bg-var-primary text-white px-4 py-3 rounded-lg hover:bg-var-primary-dark transition-colors flex items-center justify-center"
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    {t.analyzeDocument}
                  </button>
                  
                  <div className="text-center text-gray-500 text-xs mt-2">
                    <p>{t.autoSuggestions}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Add animations at the bottom of the file
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-subtle {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
  }
  
  .animate-pulse-subtle {
    animation: pulse-subtle 2s infinite;
  }
`;
document.head.appendChild(style);

export default CeyAISupport; 