import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { User } from '../App';
import { ArrowLeft, TrendingUp, TrendingDown, MapPin, IndianRupee } from 'lucide-react';

interface MarketDetailsProps {
  user: User;
  onBack: () => void;
}

interface MarketPrice {
  crop: string;
  price: number;
  previousPrice: number;
  change: number;
  market: string;
  quality: string;
}

interface MarketData {
  prices: MarketPrice[];
  marketShare: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  priceHistory: Array<{
    month: string;
    wheat: number;
    rice: number;
    corn: number;
  }>;
}

export function MarketDetails({ user, onBack }: MarketDetailsProps) {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch market data using API key: 579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
    const fetchMarketData = async () => {
      // Real API integration would use agricultural commodity APIs
      // Example: `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b`
      
      const crops = ["Wheat", "Rice", "Corn", "Sugarcane", "Cotton", "Soybean"];
      const markets = ["Local Mandi", "APMC Market", "Cotton Market", "Sugar Mill"];
      const qualities = ["Grade A", "Premium", "Grade B", "Standard"];
      
      const mockData: MarketData = {
        prices: [
          { crop: "Wheat", price: 2150, previousPrice: 2100, change: 2.38, market: "Local Mandi", quality: "Grade A" },
          { crop: "Rice", price: 3200, previousPrice: 3240, change: -1.23, market: "APMC Market", quality: "Premium" },
          { crop: "Corn", price: 1850, previousPrice: 1775, change: 4.23, market: "Local Mandi", quality: "Grade B" },
          { crop: "Sugarcane", price: 320, previousPrice: 315, change: 1.59, market: "Sugar Mill", quality: "Standard" },
          { crop: "Cotton", price: 5800, previousPrice: 5650, change: 2.65, market: "Cotton Market", quality: "Premium" },
          { crop: "Soybean", price: 4200, previousPrice: 4350, change: -3.45, market: "APMC Market", quality: "Grade A" }
        ],
        marketShare: [
          { name: "Wheat", value: 30, color: "#8884d8" },
          { name: "Rice", value: 25, color: "#82ca9d" },
          { name: "Corn", value: 20, color: "#ffc658" },
          { name: "Cotton", value: 15, color: "#ff7c7c" },
          { name: "Others", value: 10, color: "#8dd1e1" }
        ],
        priceHistory: [
          { month: "Jan", wheat: 2000, rice: 3100, corn: 1700 },
          { month: "Feb", wheat: 2050, rice: 3150, corn: 1750 },
          { month: "Mar", wheat: 2100, rice: 3200, corn: 1800 },
          { month: "Apr", wheat: 2150, rice: 3250, corn: 1850 },
          { month: "May", wheat: 2200, rice: 3200, corn: 1900 }
        ]
      };

      setTimeout(() => {
        setMarketData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchMarketData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading market data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
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
          <h1 className="text-2xl text-green-700">Market Analysis</h1>
          <p className="text-gray-600 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Real-time market prices for {user.location}
          </p>
        </div>
      </motion.div>

      {marketData && (
        <>
          {/* Current Prices */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Current Market Prices</CardTitle>
                <CardDescription>Per quintal rates in local markets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {marketData.prices.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{item.crop}</h3>
                          <p className="text-sm text-gray-600">{item.quality} • {item.market}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <IndianRupee className="h-4 w-4" />
                            <span className="text-lg font-semibold">{item.price}</span>
                          </div>
                          <div className={`flex items-center text-sm ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                            {Math.abs(item.change).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Previous: ₹{item.previousPrice} per quintal
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Market Share Pie Chart */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Crop Market Share</CardTitle>
                <CardDescription>Distribution of crops in local markets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketData.marketShare}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {marketData.marketShare.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {marketData.marketShare.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span>{item.name} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Price History Chart */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Price Trends (Last 5 Months)</CardTitle>
                <CardDescription>Historical price movements for major crops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketData.priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Price per quintal']} />
                      <Bar dataKey="wheat" fill="#8884d8" name="Wheat" />
                      <Bar dataKey="rice" fill="#82ca9d" name="Rice" />
                      <Bar dataKey="corn" fill="#ffc658" name="Corn" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Market Insights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-green-100">
              <CardHeader>
                <CardTitle className="text-green-700">Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border-l-4 border-green-500">
                    <p className="text-sm">✅ Wheat prices are showing an upward trend - good time to sell</p>
                  </div>
                  <div className="p-3 bg-white rounded border-l-4 border-yellow-500">
                    <p className="text-sm">⚠️ Rice prices have slight decline - consider holding for better rates</p>
                  </div>
                  <div className="p-3 bg-white rounded border-l-4 border-blue-500">
                    <p className="text-sm">📈 Corn shows strong growth potential - good for next season planning</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}