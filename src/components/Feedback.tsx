import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { User } from '../App';
import { ArrowLeft, Star, Send, ThumbsUp, ThumbsDown, MapPin } from 'lucide-react';
import { toast } from "sonner@2.0.3";

interface FeedbackProps {
  user: User;
  onBack: () => void;
}

export function Feedback({ user, onBack }: FeedbackProps) {
  const [rating, setRating] = useState<number>(0);
  const [overallExperience, setOverallExperience] = useState<string>('');
  const [mostUsefulFeature, setMostUsefulFeature] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string>('');
  const [improvements, setImprovements] = useState<string>('');
  const [recommendation, setRecommendation] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const features = [
    'Weather Alerts',
    'Market Prices',
    'Crop Recommendation',
    'Pest Detection',
    'AI Chat Assistant',
    'Voice Assistance'
  ];

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    if (!overallExperience.trim()) {
      toast.error("Please describe your overall experience");
      return;
    }

    setSubmitting(true);

    // Simulate feedback submission
    setTimeout(() => {
      toast.success("Thank you for your valuable feedback! We'll use it to improve AgroSmart.");
      setSubmitting(false);
      
      // Reset form
      setRating(0);
      setOverallExperience('');
      setMostUsefulFeature('');
      setSuggestions('');
      setImprovements('');
      setRecommendation('');
    }, 2000);
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Rate your experience';
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
          <h1 className="text-2xl text-green-700">Feedback & Suggestions</h1>
          <p className="text-gray-600 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Help us improve AgroSmart for farmers in {user.location}
          </p>
        </div>
      </motion.div>

      {/* Feedback Form */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Share Your Experience</CardTitle>
            <CardDescription>Your feedback helps us create better farming solutions</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Rating */}
            <div>
              <Label className="text-base mb-3 block">Overall Rating</Label>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              <p className="text-sm text-gray-600">{getRatingText(rating)}</p>
            </div>

            {/* Overall Experience */}
            <div>
              <Label htmlFor="experience" className="text-base mb-2 block">
                How would you describe your overall experience with AgroSmart?
              </Label>
              <Textarea
                id="experience"
                placeholder="Tell us about your experience using AgroSmart..."
                value={overallExperience}
                onChange={(e) => setOverallExperience(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Most Useful Feature */}
            <div>
              <Label className="text-base mb-3 block">Which feature did you find most useful?</Label>
              <RadioGroup value={mostUsefulFeature} onValueChange={setMostUsefulFeature}>
                <div className="grid grid-cols-2 gap-2">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <RadioGroupItem value={feature} id={feature} />
                      <Label htmlFor={feature} className="text-sm cursor-pointer">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Suggestions */}
            <div>
              <Label htmlFor="suggestions" className="text-base mb-2 block">
                What new features would you like to see in AgroSmart?
              </Label>
              <Textarea
                id="suggestions"
                placeholder="Suggest new features that would help your farming..."
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {/* Improvements */}
            <div>
              <Label htmlFor="improvements" className="text-base mb-2 block">
                What can we improve in the existing features?
              </Label>
              <Textarea
                id="improvements"
                placeholder="Tell us how we can make current features better..."
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {/* Recommendation */}
            <div>
              <Label className="text-base mb-3 block">Would you recommend AgroSmart to other farmers?</Label>
              <RadioGroup value={recommendation} onValueChange={setRecommendation}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="definitely" id="definitely" />
                  <Label htmlFor="definitely" className="flex items-center gap-2 cursor-pointer">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    Definitely
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="probably" id="probably" />
                  <Label htmlFor="probably" className="cursor-pointer">Probably</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maybe" id="maybe" />
                  <Label htmlFor="maybe" className="cursor-pointer">Maybe</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="probably-not" id="probably-not" />
                  <Label htmlFor="probably-not" className="cursor-pointer">Probably not</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="definitely-not" id="definitely-not" />
                  <Label htmlFor="definitely-not" className="flex items-center gap-2 cursor-pointer">
                    <ThumbsDown className="h-4 w-4 text-red-600" />
                    Definitely not
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Submitting Feedback...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Submit Feedback
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Thank You Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg text-green-700">Thank You for Using AgroSmart!</h3>
              <p className="text-sm text-gray-600">
                Your feedback is invaluable in helping us create better solutions for farmers like you.
                Together, we can revolutionize agriculture with technology.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Need Help or Have Questions?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Email:</span> support@agrosmart.com
              </div>
              <div>
                <span className="font-medium">Helpline:</span> 1800-123-4567 (Toll Free)
              </div>
              <div>
                <span className="font-medium">WhatsApp:</span> +91-98765-43210
              </div>
              <div>
                <span className="font-medium">Support Hours:</span> 24/7 for farmers
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}