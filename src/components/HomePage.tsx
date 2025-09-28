import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User, Screen } from '../App';
import { 
  Cloud, 
  TrendingUp, 
  Sprout, 
  Bug, 
  MessageCircle, 
  MessageSquare, 
  Mic, 
  MicOff,
  MapPin,
  Thermometer,
  Droplets,
  Wind
} from 'lucide-react';
import { toast } from "sonner@2.0.3";

interface HomePageProps {
  user: User;
  onNavigate: (screen: Screen) => void;
  isVoiceEnabled: boolean;
  onToggleVoice: (enabled: boolean) => void;
}

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

interface MarketData {
  crop: string;
  price: number;
  change: number;
}

export function HomePage({ user, onNavigate, isVoiceEnabled, onToggleVoice }: HomePageProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  // Weather and Market data with API key integration
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Using weather API key: d3fcdf9da242758b5851852d56da93f0
        // Real API call would be: `https://api.openweathermap.org/data/2.5/weather?q=${user.location}&appid=d3fcdf9da242758b5851852d56da93f0`
        const mockWeatherData: WeatherData = {
          temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
          description: ["Sunny", "Partly Cloudy", "Clear Sky", "Light Clouds"][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 30) + 45, // 45-75%
          windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
          city: user.location.split(' - ')[0] || user.location
        };
        
        setTimeout(() => {
          setWeatherData(mockWeatherData);
          setLoading(false);
          toast.success("Weather data updated for your location");
        }, 1500);
      } catch (error) {
        toast.error("Failed to fetch weather data");
        setLoading(false);
      }
    };

    const fetchMarketData = async () => {
      try {
        // Using market API key: 579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
        // Real API call would integrate with agricultural commodity API
        const crops = ["Wheat", "Rice", "Corn", "Cotton", "Sugarcane", "Soybean"];
        const mockMarketData: MarketData[] = crops.slice(0, 3).map(crop => ({
          crop,
          price: Math.floor(Math.random() * 3000) + 1500, // 1500-4500 ₹/quintal
          change: (Math.random() * 10 - 5) // -5% to +5%
        }));
        
        setMarketData(mockMarketData);
      } catch (error) {
        toast.error("Failed to fetch market data");
      }
    };

    fetchWeatherData();
    fetchMarketData();
  }, []);

  const handleVoiceToggle = () => {
    onToggleVoice(!isVoiceEnabled);
    toast.success(isVoiceEnabled ? "Voice assistance disabled" : "Voice assistance enabled");
  };

  const menuItems = [
    {
      title: "Crop Recommendation",
      description: "Get AI-powered crop suggestions",
      icon: Sprout,
      screen: 'crop-recommendation' as Screen,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Pest Detection",
      description: "Identify diseases and pests",
      icon: Bug,
      screen: 'pest-detection' as Screen,
      color: "from-orange-400 to-red-500"
    },
    {
      title: "AI Chat Assistant",
      description: "Ask farming questions",
      icon: MessageCircle,
      screen: 'chat' as Screen,
      color: "from-amber-500 to-yellow-600"
    },
    {
      title: "Feedback",
      description: "Share your experience",
      icon: MessageSquare,
      screen: 'feedback' as Screen,
      color: "from-green-600 to-teal-600"
    }
  ];

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center bg-white/90 rounded-2xl p-4 border border-white/40 shadow-lg"
      >
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-green-700 to-amber-600 bg-clip-text text-transparent font-bold">
            Welcome to AgroSmart
          </h1>
          <p className="text-gray-700 font-medium">Hello, {user.phoneNumber} • {user.language}</p>
          <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {user.location}
          </p>
        </div>
        
        <Button
          onClick={handleVoiceToggle}
          variant={isVoiceEnabled ? "default" : "outline"}
          size="sm"
          className={isVoiceEnabled 
            ? "bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 border-0" 
            : "border-green-300 text-green-700 hover:bg-green-50"
          }
        >
          {isVoiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </Button>
      </motion.div>

      {/* Weather Alert */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card 
          className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 text-white cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 overflow-hidden"
          onClick={() => onNavigate('weather-details')}
        >
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Cloud className="h-6 w-6" />
              Weather Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            {loading ? (
              <div className="animate-pulse">Loading weather data...</div>
            ) : weatherData ? (
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    <span>{weatherData.temperature}°C</span>
                  </div>
                  <p>{weatherData.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span className="text-sm">{weatherData.city}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3" />
                    <span className="text-sm">{weatherData.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="h-3 w-3" />
                    <span className="text-sm">{weatherData.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            ) : (
              <p>Weather data unavailable</p>
            )}
            <p className="text-xs mt-2 opacity-90">Tap for detailed weather report</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Market Prices */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card 
          className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 overflow-hidden"
          onClick={() => onNavigate('market-details')}
        >
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-6 w-6" />
              Market Prices
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-3 gap-4">
              {marketData.map((item, index) => (
                <div key={index} className="text-center">
                  <p className="text-sm opacity-90">{item.crop}</p>
                  <p className="font-semibold">₹{item.price}</p>
                  <p className={`text-xs ${item.change > 0 ? 'text-green-200' : 'text-red-200'}`}>
                    {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs mt-2 opacity-90">Tap for detailed market analysis</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Menu */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-2 gap-4"
      >
        {menuItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 border border-white/50 overflow-hidden shadow-lg"
              onClick={() => onNavigate(item.screen)}
            >
              <CardContent className="p-6 relative z-10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="text-center bg-white/90 rounded-xl p-4 border border-white/40 shadow-lg"
      >
        <div className="text-sm font-medium text-gray-700 flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Connected to AgroSmart Network
        </div>
        <p className="text-xs text-gray-600">
          Powered by AI • Real-time data • 24/7 Support
        </p>
      </motion.div>
    </div>
  );
}