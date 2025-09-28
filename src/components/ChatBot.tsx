import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { User } from '../App';
import { ArrowLeft, Send, Bot, User as UserIcon, Mic, MicOff, MapPin } from 'lucide-react';

interface ChatBotProps {
  user: User;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatBot({ user, onBack }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const predefinedResponses = {
    greeting: [
      "Hello! I'm your AgroSmart AI assistant. How can I help you with your farming needs today?",
      "Welcome to AgroSmart! I'm here to answer your agriculture questions.",
      "Hi there! I'm ready to help with any farming questions you have."
    ],
    weather: [
      "Weather is crucial for farming decisions. You can check detailed weather forecasts in the Weather section of the app. Current conditions show good farming weather!",
      "For accurate weather information, use our Weather Details feature. It provides temperature, humidity, and rainfall predictions."
    ],
    crops: [
      "For crop recommendations, use our AI-powered Crop Recommendation feature. It considers soil conditions, temperature, and NPK values to suggest the best crops for your area.",
      "Different crops thrive in different conditions. What type of crop are you interested in growing?"
    ],
    pests: [
      "Our Pest Detection feature can help identify diseases and pests from plant photos. You can also use organic treatments like neem oil spray for common pests.",
      "Common pest prevention includes proper spacing, avoiding overwatering, and regular plant inspection. What specific pest issue are you facing?"
    ],
    market: [
      "Check our Market Prices section for current rates of various crops. Market prices fluctuate based on demand, season, and quality.",
      "For the best market prices, consider the quality of your produce and timing of sale. Premium quality crops always fetch better prices."
    ],
    fertilizer: [
      "Fertilizer recommendations depend on your soil's NPK values. Use our Crop Recommendation feature for personalized fertilizer suggestions.",
      "Organic fertilizers like vermicompost are excellent for long-term soil health. What's your current soil condition?"
    ],
    irrigation: [
      "Proper irrigation depends on crop type, soil, and weather. Drip irrigation is most efficient for water conservation.",
      "Water your crops early morning or evening to reduce evaporation. How large is your farming area?"
    ],
    default: [
      "That's an interesting question! Could you be more specific about your farming concern?",
      "I'd be happy to help! Can you provide more details about what you're looking for?",
      "Let me help you with that. Could you rephrase your question or provide more context?"
    ]
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return predefinedResponses.greeting[Math.floor(Math.random() * predefinedResponses.greeting.length)];
    }
    
    if (input.includes('weather') || input.includes('rain') || input.includes('temperature')) {
      return predefinedResponses.weather[Math.floor(Math.random() * predefinedResponses.weather.length)];
    }
    
    if (input.includes('crop') || input.includes('plant') || input.includes('grow')) {
      return predefinedResponses.crops[Math.floor(Math.random() * predefinedResponses.crops.length)];
    }
    
    if (input.includes('pest') || input.includes('disease') || input.includes('insect') || input.includes('bug')) {
      return predefinedResponses.pests[Math.floor(Math.random() * predefinedResponses.pests.length)];
    }
    
    if (input.includes('market') || input.includes('price') || input.includes('sell')) {
      return predefinedResponses.market[Math.floor(Math.random() * predefinedResponses.market.length)];
    }
    
    if (input.includes('fertilizer') || input.includes('nutrient') || input.includes('npk')) {
      return predefinedResponses.fertilizer[Math.floor(Math.random() * predefinedResponses.fertilizer.length)];
    }
    
    if (input.includes('water') || input.includes('irrigation') || input.includes('drought')) {
      return predefinedResponses.irrigation[Math.floor(Math.random() * predefinedResponses.irrigation.length)];
    }
    
    return predefinedResponses.default[Math.floor(Math.random() * predefinedResponses.default.length)];
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(text),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = user.language === 'Hindi' ? 'hi-IN' : user.language === 'Punjabi' ? 'pa-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  useEffect(() => {
    // Auto scroll to bottom when new messages are added
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      text: `Welcome to AgroSmart AI Assistant! I'm here to help you with farming questions, weather information, crop advice, and more. How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-6"
      >
        <Button 
          onClick={onBack} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl text-green-700">AI Chat Assistant</h1>
          <p className="text-gray-600 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Agricultural support for {user.location}
          </p>
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex flex-col"
      >
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Bot className="h-5 w-5" />
              AgroSmart AI Assistant
            </CardTitle>
            <CardDescription>Ask me anything about farming, crops, weather, or agriculture</CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div 
              id="messages-container"
              className="flex-1 p-4 overflow-y-auto max-h-96"
            >
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'bot' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                          <Bot className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                      
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'user' 
                          ? 'bg-green-600 text-white rounded-br-md' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                          <UserIcon className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me about farming, crops, weather..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                />
                <Button
                  onClick={startVoiceRecognition}
                  variant="outline"
                  size="sm"
                  disabled={isListening}
                  className="shrink-0"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={() => sendMessage(inputText)}
                  disabled={!inputText.trim() || isTyping}
                  className="shrink-0 bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quick Questions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "What crops are best for my area?",
                  "How to prevent pest attacks?",
                  "Current market prices?",
                  "Weather forecast?"
                ].map((question, index) => (
                  <Button
                    key={index}
                    onClick={() => sendMessage(question)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}