import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, faSpinner, faRobot, faLeaf, faArrowLeft,
  faSeedling, faWheatAwn, faCloudSunRain, faChartLine,
  faSun, faCloudRain, faDroplet, faIndianRupeeSign
} from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '../context/AppContext';
import { fetchFieldData } from '../services/dataService';

// Groq API key - Free developer key (replace with environment variable in production)
const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const AIAssistant = () => {
  const { selectedField, fields } = useAppContext();
  const [fieldData, setFieldData] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'नमस्ते, किसान मित्र! 👋 I am AgriSense AI, your smart farming companion. How can I assist your fields today?',
      timestamp: new Date().toISOString(),
      isIntroduction: true
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatView, setChatView] = useState('main'); // main, weather, crops, insights, market
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "What's the weather forecast for this week?",
    "Recommend crops for this season",
    "Current market prices for wheat"
  ]);
  const messagesEndRef = useRef(null);

  // Chat suggestion categories
  const chatCategories = [
    { 
      id: 'weather',
      title: 'Weather Insights',
      icon: faCloudSunRain,
      color: 'bg-blue-500',
      description: 'Get forecasts & alerts'
    },
    { 
      id: 'crops',
      title: 'Crop Advisory',
      icon: faWheatAwn,
      color: 'bg-green-600',
      description: 'Recommendations & care'
    },
    { 
      id: 'market',
      title: 'Market Prices',
      icon: faIndianRupeeSign,
      color: 'bg-amber-500',
      description: 'Current rates & trends'
    },
    { 
      id: 'insights',
      title: 'Field Analytics',
      icon: faChartLine,
      color: 'bg-purple-600',
      description: 'Health & performance'
    }
  ];

  // Suggested questions by category
  const questionsByCategory = {
    weather: [
      "What's the weather forecast for this week?",
      "Will it rain in the next 3 days?",
      "Should I delay irrigation due to upcoming rain?",
      "What's the temperature trend for the next week?"
    ],
    crops: [
      "What crops are best for this season?",
      "How do I treat yellow leaves on my wheat?",
      "When should I harvest my rice crop?",
      "Best practices for organic pest control?"
    ],
    market: [
      "What's the current price for wheat?",
      "Which crops have the best market rates now?",
      "Where can I sell my produce for maximum profit?",
      "Price forecast for the upcoming harvest season?"
    ],
    insights: [
      "How healthy is my northern field?",
      "Do I need to apply fertilizer this week?",
      "Show me soil moisture analysis",
      "Compare my crop yield with regional averages"
    ]
  };

  // Specialized AI prompt instructions for different categories
  const categoryPrompts = {
    weather: `You are AgriSense AI, an agricultural assistant specializing in weather analysis for farmers.
      Focus exclusively on providing weather insights, forecasts, and recommendations relevant to farming.
      Your expertise includes interpreting weather patterns, suggesting preventive measures for adverse conditions,
      and recommending optimal timing for farm activities based on weather forecasts.
      Keep responses concise, practical and actionable for farmers.
      If asked about non-weather topics, gently redirect to weather-related aspects of farming.
      Current date: September 9, 2025.`,
      
    crops: `You are AgriSense AI, an agricultural assistant specializing in crop management and advisory.
      Focus exclusively on providing crop-specific advice including planting techniques, disease identification,
      pest management, harvesting guidelines, and crop rotation strategies.
      Base your recommendations on sustainable farming practices with both traditional and modern approaches.
      Provide specific crop variety recommendations suitable for Indian agricultural conditions.
      Keep responses concise, practical and actionable for farmers.
      If asked about non-crop topics, gently redirect to crop-related aspects of farming.
      Current date: September 9, 2025.`,
      
    market: `You are AgriSense AI, an agricultural assistant specializing in agricultural market trends and pricing.
      Focus exclusively on providing insights about crop prices, market trends, MSP (Minimum Support Price),
      selling strategies, and information about agricultural subsidies and programs in India.
      Keep your responses focused on economic aspects of farming and provide actionable market intelligence.
      Your goal is to help farmers maximize their profits through timely and informed market decisions.
      Keep responses concise, practical and actionable for farmers.
      If asked about non-market topics, gently redirect to economic aspects of farming.
      Current date: September 9, 2025.`,
      
    insights: `You are AgriSense AI, an agricultural assistant specializing in field analytics and data interpretation.
      Focus exclusively on analyzing farming data including soil health, vegetation indices, irrigation efficiency,
      and yield predictions. Use the provided field data in your analysis when available.
      FIELD DATA: {fieldDataSummary}
      Interpret this data to provide actionable insights on improving field productivity and sustainability.
      Keep responses concise, practical and actionable for farmers.
      If asked about non-analytics topics, gently redirect to data-driven aspects of farming.
      Current date: September 9, 2025.`,
      
    general: `You are AgriSense AI, a comprehensive agricultural assistant for Indian farmers.
      Your expertise covers weather predictions, crop management, market trends, and field analytics.
      Provide practical, actionable advice that considers local agricultural conditions in India.
      Focus exclusively on agricultural topics. If asked about non-farming topics, politely redirect
      the conversation to agricultural subjects you can assist with.
      Keep responses concise, respectful, and tailored for farmers who may have varying levels of technical knowledge.
      Always prioritize sustainable farming practices and techniques that are accessible to small and medium-scale farmers.
      Current date: September 9, 2025.`
  };
  
  // Define icons for different response categories
  const categoryIcons = {
    weather: faCloudSunRain,
    crops: faWheatAwn,
    market: faIndianRupeeSign,
    insights: faChartLine,
    general: faSeedling
  };

  // Load field data when selected field changes
  useEffect(() => {
    const loadFieldData = async () => {
      if (selectedField) {
        try {
          const data = await fetchFieldData(selectedField);
          setFieldData(data);
        } catch (error) {
          console.error('Error loading field data for AI assistant:', error);
        }
      } else {
        setFieldData(null);
      }
    };
    
    loadFieldData();
  }, [selectedField]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle view changes and set appropriate suggested questions
  useEffect(() => {
    if (chatView !== 'main') {
      setSuggestedQuestions(questionsByCategory[chatView] || []);
    } else {
      setSuggestedQuestions([
        "What's the weather forecast for this week?",
        "Recommend crops for this season",
        "Current market prices for wheat"
      ]);
    }
  }, [chatView]);
  
  // Function to call Groq API
  const callGroqAPI = async (userPrompt, category = 'general') => {
    try {
      // Create a field data summary for the insights prompt
      let fieldDataSummary = 'No field currently selected.';
      if (fieldData) {
        fieldDataSummary = `
          Selected Field: ${fieldData.name}
          Location: ${fieldData.location}
          Size: ${fieldData.size} acres
          Crop: ${fieldData.crop || fieldData.mainCrop || 'None'}
          Soil Type: ${fieldData.soilType || 'Unknown'}
          Coordinates: ${JSON.stringify(fieldData.coordinates)}
        `;
      }
      
      // Get the appropriate prompt for the category
      let prompt = categoryPrompts[category];
      
      // Replace field data placeholder in insights prompt
      if (category === 'insights') {
        prompt = prompt.replace('{fieldDataSummary}', fieldDataSummary);
      }
      
      // Previous messages for context (limited to last 5 exchanges)
      const recentMessages = messages
        .filter(msg => !msg.isIntroduction)
        .slice(-10)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));
        
      // Prepare the request payload
      const payload = {
        model: "llama3-8b-8192",  // Using Llama 3 8B model
        messages: [
          { role: "system", content: prompt },
          ...recentMessages,
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      };
      
      // Call the Groq API
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error calling Groq API');
      }
      
      const data = await response.json();
      return {
        text: data.choices[0].message.content,
        icon: categoryIcons[category]
      };
    } catch (error) {
      console.error("Error calling Groq API:", error);
      return {
        text: "I'm having trouble connecting to my knowledge base at the moment. Please try again later or ask another question.",
        icon: faSeedling
      };
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageCopy = message;
    setMessage('');
    setIsLoading(true);
    
    // Determine category based on message content or current chat view
    let category = chatView !== 'main' ? chatView : 'general';
    const messageLower = messageCopy.toLowerCase();
    
    // If in main chat, try to determine category from message content
    if (chatView === 'main') {
      if (messageLower.includes('weather') || messageLower.includes('rain') || messageLower.includes('forecast') || messageLower.includes('temperature')) {
        category = 'weather';
      } else if (messageLower.includes('crop') || messageLower.includes('plant') || messageLower.includes('sow') || messageLower.includes('harvest')) {
        category = 'crops';
      } else if (messageLower.includes('price') || messageLower.includes('market') || messageLower.includes('sell') || messageLower.includes('rupee') || messageLower.includes('₹')) {
        category = 'market';
      } else if (messageLower.includes('field') || messageLower.includes('soil') || messageLower.includes('health') || messageLower.includes('analysis')) {
        category = 'insights';
      }
    }
    
    try {
      // Call Groq API
      const response = await callGroqAPI(messageCopy, category);
      
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toISOString(),
        icon: response.icon
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback error message
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'I apologize, but I encountered an issue processing your request. Please try again later.',
        timestamp: new Date().toISOString(),
        icon: faSeedling
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setChatView(categoryId);
  };

  // Go back to main chat view
  const handleBackToMain = () => {
    setChatView('main');
  };
  
  // Handle suggested question click
  const handleSuggestedQuestionClick = (question) => {
    setMessage(question);
    handleSendMessage();
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-gradient-to-br from-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-800 p-4 shadow-md">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full shadow-md mr-4">
              <img
                src="/farmer-avatar.svg"
                alt="AgriSense AI"
                className="w-10 h-10"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0QTkwRTIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjFWMTlDMjAgMTYuNzkwOSAxOC4yMDkxIDE1IDE2IDE1SDggQzUuNzkwODYgMTUgNCAxNi43OTA5IDQgMTlWMjEiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==';
                }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center">
                AgriSense AI Assistant
              </h1>
              <p className="text-sm text-green-50">Your smart farming companion for personalized agricultural insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category selector */}
      {chatView !== 'main' && (
        <div className="bg-green-50 px-4 py-2 border-b border-green-100 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-center">
            <button 
              onClick={handleBackToMain}
              className="flex items-center text-green-700 text-sm hover:text-green-800"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5" size="sm" />
              <span>Back to main chat</span>
            </button>
            <span className="mx-2 text-green-700">|</span>
            <span className="text-green-700 font-medium text-sm capitalize">{chatView} Assistance</span>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          {/* Welcome card */}
          {/* {messages.some(msg => msg.isIntroduction) && (
            <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-5 text-white shadow-lg mb-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <FontAwesomeIcon icon={faSeedling} size="lg" />
                </div>
                <h3 className="font-semibold text-lg">AgriSense AI</h3>
              </div>
              <p className="text-sm md:text-base">
                नमस्ते, किसान मित्र! 👋 I'm your smart farming companion, powered by advanced agricultural intelligence. 
                I can help with weather forecasts, crop recommendations, market insights, and field analytics to 
                optimize your farming operations.
              </p>
              <div className="mt-4 bg-white/10 rounded-lg p-3">
                <p className="text-sm font-medium mb-2">Try asking me about:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-white/20 rounded-full px-3 py-1">Weather forecasts</span>
                  <span className="text-xs bg-white/20 rounded-full px-3 py-1">Crop diseases</span>
                  <span className="text-xs bg-white/20 rounded-full px-3 py-1">Market prices</span>
                  <span className="text-xs bg-white/20 rounded-full px-3 py-1">Soil health</span>
                </div>
              </div>
            </div>
          )} */}

          {/* Categories in main view */}
          {chatView === 'main' && messages.length < 3 && (
            <div className="max-w-4xl mx-auto mb-6 mt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-4">How can I assist you today?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {chatCategories.map((category) => (
                  <button
                    key={category.id}
                    className="flex flex-col items-center bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mb-3 shadow-sm`}>
                      <FontAwesomeIcon icon={category.icon} size="lg" className="text-white" />
                    </div>
                    <h4 className="font-medium text-gray-800">{category.title}</h4>
                    <p className="text-xs text-gray-500 mt-2 text-center">{category.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.filter(msg => !msg.isIntroduction).map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md md:max-w-xl rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-none py-3 px-4'
                      : 'bg-white shadow-md border-l-4 border-green-400 text-gray-800 rounded-tl-none py-3 px-4'
                  }`}
                >
                  {msg.icon && msg.sender === 'bot' && (
                    <div className="flex items-center mb-2 text-green-600">
                      <FontAwesomeIcon icon={msg.icon} className="mr-2" />
                      <div className="h-px flex-grow bg-gray-200"></div>
                    </div>
                  )}
                  <div className="text-sm md:text-base">{msg.text}</div>
                  <div
                    className={`text-xs mt-2 text-right ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white shadow-md border-l-4 border-green-400 rounded-2xl py-4 px-5 rounded-tl-none max-w-md">
                  <div className="flex items-center">
                    <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faSpinner} className="text-green-600 animate-spin" />
                    </div>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      
      {/* Suggested questions */}
      {suggestedQuestions.length > 0 && !isLoading && (
        <div className="bg-white px-6 py-3 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-gray-500 mb-2 font-medium">SUGGESTED QUESTIONS:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-3 py-2 transition-colors"
                  onClick={() => handleSuggestedQuestionClick(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Input area */}
      <div className="p-4 md:p-5 bg-white border-t border-gray-200 shadow-inner">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything about farming, crops, weather..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={`bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl p-3 transition-all hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none`}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
          <div className="flex items-center justify-center mt-3 gap-1">
            <FontAwesomeIcon icon={faLeaf} className="text-green-500 text-xs" />
            <span className="text-xs text-gray-500">Powered by SmartAgri | Farming Intelligence</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
