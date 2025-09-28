import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User } from '../App';
import { ArrowLeft, Thermometer, Droplets, Sprout, Zap, MapPin } from 'lucide-react';
import { toast } from "sonner@2.0.3";

interface CropRecommendationProps {
  user: User;
  onBack: () => void;
}

interface NPKValues {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface CropSuggestion {
  name: string;
  suitability: number;
  reason: string;
  growthPeriod: string;
  expectedYield: string;
  waterRequirement: string;
}

interface FertilizerSuggestion {
  name: string;
  type: string;
  application: string;
  quantity: string;
  timing: string;
}

export function CropRecommendation({ user, onBack }: CropRecommendationProps) {
  const [temperature, setTemperature] = useState('');
  const [soilType, setSoilType] = useState('');
  const [npkValues, setNpkValues] = useState<NPKValues>({ nitrogen: 0, phosphorus: 0, potassium: 0 });
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<{
    crops: CropSuggestion[];
    fertilizers: FertilizerSuggestion[];
  } | null>(null);

  // Auto-fetch current conditions
  useEffect(() => {
    // Simulate API call to get current temperature and NPK values from API key: 579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
    const fetchCurrentConditions = async () => {
      const mockData = {
        temperature: 28,
        npk: { nitrogen: 45, phosphorus: 35, potassium: 50 }
      };

      setTemperature(mockData.temperature.toString());
      setNpkValues(mockData.npk);
      toast.success("Current conditions loaded from your location");
    };

    fetchCurrentConditions();
  }, []);

  const generateRecommendations = async () => {
    if (!temperature || temperature === '0') {
      toast.error("Please enter the current temperature");
      return;
    }

    if (!soilType) {
      toast.error("Please select the soil type");
      return;
    }

    if (npkValues.nitrogen === 0 && npkValues.phosphorus === 0 && npkValues.potassium === 0) {
      toast.error("Please enter NPK values");
      return;
    }

    setLoading(true);

    // Simulate AI analysis
    setTimeout(() => {
      const temp = parseFloat(temperature);
      const { nitrogen, phosphorus, potassium } = npkValues;

      // Mock AI recommendation logic
      const cropSuggestions: CropSuggestion[] = [];
      const fertilizerSuggestions: FertilizerSuggestion[] = [];

      // Temperature and soil type-based crop recommendations
      if (temp >= 25 && temp <= 35) {
        let suitability = 85;
        let reason = "Optimal temperature for rice cultivation";
        
        if (soilType === 'clayey' || soilType === 'black') {
          suitability = 95;
          reason = `Optimal temperature and ${soilType} soil excellent for rice cultivation with high water retention`;
        } else if (soilType === 'loamy') {
          suitability = 90;
          reason = "Optimal temperature and loamy soil good for rice cultivation";
        }
        
        cropSuggestions.push({
          name: "Rice",
          suitability,
          reason,
          growthPeriod: "120-140 days",
          expectedYield: "4-6 tons/hectare",
          waterRequirement: "High (1200-1500mm)"
        });
      }

      if (temp >= 20 && temp <= 30) {
        let suitability = 80;
        let reason = "Good temperature range for wheat";
        
        if (soilType === 'loamy' || soilType === 'black') {
          suitability = 90;
          reason = `Good temperature range and ${soilType} soil ideal for wheat cultivation`;
        } else if (soilType === 'clayey') {
          suitability = 85;
          reason = "Good temperature and clayey soil suitable for wheat";
        }
        
        cropSuggestions.push({
          name: "Wheat",
          suitability,
          reason,
          growthPeriod: "120-150 days",
          expectedYield: "3-4 tons/hectare",
          waterRequirement: "Medium (450-650mm)"
        });
      }

      if (temp >= 25 && temp <= 40 && potassium > 40) {
        let suitability = 75;
        let reason = "High potassium and warm temperature for cotton";
        
        if (soilType === 'black' || soilType === 'red') {
          suitability = 90;
          reason = `High potassium, warm temperature and ${soilType} soil excellent for cotton cultivation`;
        } else if (soilType === 'loamy') {
          suitability = 85;
          reason = "High potassium, warm temperature and loamy soil good for cotton";
        }
        
        cropSuggestions.push({
          name: "Cotton",
          suitability,
          reason,
          growthPeriod: "160-200 days",
          expectedYield: "2-3 tons/hectare",
          waterRequirement: "Medium (700-1200mm)"
        });
      }

      if (temp >= 15 && temp <= 25) {
        let suitability = 70;
        let reason = "Cool temperature suitable for potato";
        
        if (soilType === 'loamy' || soilType === 'sandy') {
          suitability = 85;
          reason = `Cool temperature and ${soilType} soil excellent for potato cultivation with good drainage`;
        } else if (soilType === 'red') {
          suitability = 80;
          reason = "Cool temperature and red soil good for potato cultivation";
        }
        
        cropSuggestions.push({
          name: "Potato",
          suitability,
          reason,
          growthPeriod: "90-120 days",
          expectedYield: "20-25 tons/hectare",
          waterRequirement: "Medium (500-700mm)"
        });
      }

      // Add soil-specific crops
      if (soilType === 'sandy' && temp >= 20 && temp <= 35) {
        cropSuggestions.push({
          name: "Groundnut",
          suitability: 88,
          reason: "Sandy soil with good drainage perfect for groundnut cultivation",
          growthPeriod: "120-130 days",
          expectedYield: "2-3 tons/hectare",
          waterRequirement: "Medium (500-700mm)"
        });
      }

      if (soilType === 'red' && temp >= 20 && temp <= 30) {
        cropSuggestions.push({
          name: "Millets",
          suitability: 85,
          reason: "Red soil with good mineral content ideal for drought-resistant millets",
          growthPeriod: "75-100 days",
          expectedYield: "1-2 tons/hectare",
          waterRequirement: "Low (300-500mm)"
        });
      }

      // NPK-based fertilizer recommendations
      if (nitrogen < 50) {
        fertilizerSuggestions.push({
          name: "Urea",
          type: "Nitrogen Fertilizer",
          application: "Soil Application",
          quantity: "100-150 kg/hectare",
          timing: "Pre-sowing and top-dressing"
        });
      }

      if (phosphorus < 40) {
        fertilizerSuggestions.push({
          name: "DAP (Di-Ammonium Phosphate)",
          type: "Phosphorus Fertilizer",
          application: "Basal Application",
          quantity: "100-125 kg/hectare",
          timing: "At the time of sowing"
        });
      }

      if (potassium < 45) {
        fertilizerSuggestions.push({
          name: "Muriate of Potash",
          type: "Potassium Fertilizer",
          application: "Soil Application",
          quantity: "80-100 kg/hectare",
          timing: "Pre-sowing"
        });
      }

      // Always recommend organic options
      fertilizerSuggestions.push({
        name: "Vermicompost",
        type: "Organic Fertilizer",
        application: "Soil Incorporation",
        quantity: "2-3 tons/hectare",
        timing: "15-20 days before sowing"
      });

      setRecommendations({
        crops: cropSuggestions.sort((a, b) => b.suitability - a.suitability),
        fertilizers: fertilizerSuggestions
      });

      setLoading(false);
      toast.success("AI recommendations generated successfully!");
    }, 2000);
  };

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
          <h1 className="text-2xl text-green-700">Crop Recommendation</h1>
          <p className="text-gray-600 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            AI-powered suggestions for {user.location}
          </p>
        </div>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Thermometer className="h-5 w-5" />
              Current Conditions
            </CardTitle>
            <CardDescription>Enter current temperature, soil type and soil NPK values</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Thermometer className="h-4 w-4" />
                Current Temperature (°C)
              </Label>
              <Input
                type="number"
                placeholder="Enter temperature"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Droplets className="h-4 w-4" />
                Soil Type
              </Label>
              <Select value={soilType} onValueChange={setSoilType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loamy">Loamy Soil</SelectItem>
                  <SelectItem value="clayey">Clayey Soil</SelectItem>
                  <SelectItem value="black">Black Soil</SelectItem>
                  <SelectItem value="sandy">Sandy Soil</SelectItem>
                  <SelectItem value="red">Red Soil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="mb-2 block">Nitrogen (N)</Label>
                <Input
                  type="number"
                  placeholder="NPK-N"
                  value={npkValues.nitrogen}
                  onChange={(e) => setNpkValues(prev => ({ ...prev, nitrogen: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label className="mb-2 block">Phosphorus (P)</Label>
                <Input
                  type="number"
                  placeholder="NPK-P"
                  value={npkValues.phosphorus}
                  onChange={(e) => setNpkValues(prev => ({ ...prev, phosphorus: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label className="mb-2 block">Potassium (K)</Label>
                <Input
                  type="number"
                  placeholder="NPK-K"
                  value={npkValues.potassium}
                  onChange={(e) => setNpkValues(prev => ({ ...prev, potassium: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <Button 
              onClick={generateRecommendations}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating Recommendations...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sprout className="h-4 w-4" />
                  Get AI Recommendations
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Crop Recommendations */}
      {recommendations && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Sprout className="h-5 w-5" />
                Recommended Crops
              </CardTitle>
              <CardDescription>Based on current temperature, soil type and soil conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.crops.map((crop, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-green-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-green-800">{crop.name}</h3>
                      <div className="text-right">
                        <div className="text-sm text-green-600 font-medium">
                          {crop.suitability}% Suitable
                        </div>
                        <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${crop.suitability}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{crop.reason}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-medium">Growth Period:</span> {crop.growthPeriod}
                      </div>
                      <div>
                        <span className="font-medium">Expected Yield:</span> {crop.expectedYield}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Water Requirement:</span> {crop.waterRequirement}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Fertilizer Recommendations */}
      {recommendations && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Zap className="h-5 w-5" />
                Fertilizer Recommendations
              </CardTitle>
              <CardDescription>Suggested fertilizers based on soil NPK analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.fertilizers.map((fertilizer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-green-800 mb-1">{fertilizer.name}</h3>
                    <p className="text-sm text-blue-600 mb-2">{fertilizer.type}</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div><span className="font-medium">Application:</span> {fertilizer.application}</div>
                      <div><span className="font-medium">Quantity:</span> {fertilizer.quantity}</div>
                      <div><span className="font-medium">Timing:</span> {fertilizer.timing}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}