import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User } from '../App';
import { ArrowLeft, Camera, Upload, Bug, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import { toast } from "sonner@2.0.3";

interface PestDetectionProps {
  user: User;
  onBack: () => void;
}

interface DetectionResult {
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  symptoms: string[];
  treatment: {
    pesticides: Array<{
      name: string;
      type: string;
      dosage: string;
      applicationMethod: string;
      precautions: string[];
    }>;
    organicTreatment: Array<{
      method: string;
      ingredients: string;
      preparation: string;
    }>;
  };
  prevention: string[];
}

export function PestDetection({ user, onBack }: PestDetectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setAnalyzing(true);
    toast.info("Analyzing image with AI...");

    // Simulate AI analysis
    setTimeout(() => {
      // Mock disease detection results
      const mockResults: DetectionResult[] = [
        {
          disease: "Leaf Spot Disease",
          confidence: 92,
          severity: 'Medium',
          description: "A fungal disease that causes brown spots on leaves, potentially reducing crop yield.",
          symptoms: [
            "Brown or black circular spots on leaves",
            "Yellow halos around spots",
            "Premature leaf drop",
            "Reduced photosynthesis"
          ],
          treatment: {
            pesticides: [
              {
                name: "Copper Sulfate",
                type: "Fungicide",
                dosage: "2-3 grams per liter",
                applicationMethod: "Foliar spray",
                precautions: ["Wear protective gear", "Apply during cool hours", "Avoid windy conditions"]
              },
              {
                name: "Mancozeb",
                type: "Protective Fungicide",
                dosage: "2.5 grams per liter",
                applicationMethod: "Foliar spray",
                precautions: ["Do not apply before rain", "Maintain 7-day interval", "Wear mask and gloves"]
              }
            ],
            organicTreatment: [
              {
                method: "Neem Oil Spray",
                ingredients: "Neem oil, water, mild soap",
                preparation: "Mix 10ml neem oil + 1ml soap in 1L water. Spray in evening."
              },
              {
                method: "Baking Soda Solution",
                ingredients: "Baking soda, water",
                preparation: "Mix 5g baking soda in 1L water. Spray weekly."
              }
            ]
          },
          prevention: [
            "Ensure proper plant spacing for air circulation",
            "Avoid overhead watering",
            "Remove infected plant debris",
            "Use disease-resistant varieties",
            "Apply preventive fungicide sprays"
          ]
        },
        {
          disease: "Aphid Infestation",
          confidence: 88,
          severity: 'Low',
          description: "Small soft-bodied insects that feed on plant sap, causing stunted growth.",
          symptoms: [
            "Small green or black insects on leaves",
            "Curled or distorted leaves",
            "Sticky honeydew on plant surfaces",
            "Presence of ants"
          ],
          treatment: {
            pesticides: [
              {
                name: "Imidacloprid",
                type: "Systemic Insecticide",
                dosage: "0.5ml per liter",
                applicationMethod: "Soil drench or foliar spray",
                precautions: ["Avoid application during flowering", "Use protective equipment", "Follow PHI period"]
              }
            ],
            organicTreatment: [
              {
                method: "Soap Water Spray",
                ingredients: "Mild dish soap, water",
                preparation: "Mix 5ml soap in 1L water. Spray directly on aphids."
              },
              {
                method: "Garlic-Chili Spray",
                ingredients: "Garlic, green chilies, water",
                preparation: "Blend 5 garlic cloves + 2 chilies in 1L water. Strain and spray."
              }
            ]
          },
          prevention: [
            "Encourage beneficial insects like ladybugs",
            "Use reflective mulches",
            "Regular monitoring of plants",
            "Avoid over-fertilizing with nitrogen"
          ]
        }
      ];

      // Randomly select one for demo
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);
      setAnalyzing(false);
      toast.success(`Disease detected with ${randomResult.confidence}% confidence`);
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Low': return CheckCircle;
      case 'Medium': return AlertTriangle;
      case 'High': return AlertTriangle;
      default: return Bug;
    }
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
          <h1 className="text-2xl text-green-700">Pest & Disease Detection</h1>
          <p className="text-gray-600 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            AI-powered diagnosis for {user.location}
          </p>
        </div>
      </motion.div>

      {/* Image Upload Section */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Camera className="h-5 w-5" />
              Upload Plant Image
            </CardTitle>
            <CardDescription>Take a photo or upload an image of the affected plant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600">Select an image to analyze for pests and diseases</p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      Take Photo
                    </Button>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Plant analysis" 
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                  <Button
                    onClick={() => setSelectedImage(null)}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
                <Button
                  onClick={analyzeImage}
                  disabled={analyzing}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {analyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Analyzing Image...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Bug className="h-4 w-4" />
                      Analyze for Pests & Diseases
                    </div>
                  )}
                </Button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Results */}
      {result && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Detection Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Bug className="h-5 w-5" />
                Detection Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-red-700">{result.disease}</h3>
                    <p className="text-gray-600">{result.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{result.confidence}% Confidence</div>
                    <div className={`flex items-center gap-1 ${getSeverityColor(result.severity)}`}>
                      {(() => {
                        const IconComponent = getSeverityIcon(result.severity);
                        return <IconComponent className="h-4 w-4" />;
                      })()}
                      <span>{result.severity} Severity</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Symptoms Identified:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {result.symptoms.map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">Treatment Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chemical Treatment */}
              <div>
                <h4 className="font-semibold text-red-600 mb-3">Chemical Pesticides</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.treatment.pesticides.map((pesticide, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-red-50">
                      <h5 className="font-medium text-red-800">{pesticide.name}</h5>
                      <p className="text-sm text-red-600 mb-2">{pesticide.type}</p>
                      <div className="text-xs space-y-1">
                        <div><strong>Dosage:</strong> {pesticide.dosage}</div>
                        <div><strong>Application:</strong> {pesticide.applicationMethod}</div>
                        <div className="mt-2">
                          <strong>Precautions:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {pesticide.precautions.map((precaution, i) => (
                              <li key={i}>{precaution}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organic Treatment */}
              <div>
                <h4 className="font-semibold text-green-600 mb-3">Organic Treatment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.treatment.organicTreatment.map((treatment, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-green-50">
                      <h5 className="font-medium text-green-800">{treatment.method}</h5>
                      <div className="text-xs space-y-1 mt-2">
                        <div><strong>Ingredients:</strong> {treatment.ingredients}</div>
                        <div><strong>Preparation:</strong> {treatment.preparation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prevention Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">Prevention Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.prevention.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}