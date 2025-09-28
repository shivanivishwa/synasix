import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Language } from '../App';
import { Phone, Lock, Shield, Globe, MapPin } from 'lucide-react';
import { toast } from "sonner@2.0.3";

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [language, setLanguage] = useState<Language>('English');
  const [isLogin, setIsLogin] = useState(true);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState<boolean | null>(null);
  
  // Login form
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration form
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');

  const languages: Language[] = ['English', 'Hindi', 'Punjabi'];

  // Request location permission on component mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      setLocationPermissionGranted(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location permission granted:', position.coords.latitude, position.coords.longitude);
        setLocationPermissionGranted(true);
        toast.success("Location access granted! We'll use your GPS location for accurate weather data.");
      },
      (error) => {
        console.log('Location permission error:', error);
        setLocationPermissionGranted(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission denied. The app will work with limited functionality.");
        } else {
          toast.error("Unable to get your location. The app will work with limited functionality.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    );
  };

  const handleLogin = () => {
    if (!loginPhone || loginPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    if (!loginPassword) {
      toast.error("Please enter your password");
      return;
    }

    const userData: User = {
      phoneNumber: loginPhone,
      location: locationPermissionGranted ? "GPS Auto-detected" : "Location not available",
      language
    };

    toast.success(`Welcome back! Logging in with ${language}`);
    onLogin(userData);
  };

  const handleRegister = () => {
    if (!regPhone || regPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (regPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!securityQuestion) {
      toast.error("Please answer the security question");
      return;
    }

    const userData: User = {
      phoneNumber: regPhone,
      location: locationPermissionGranted ? "GPS Auto-detected" : "Location not available",
      language
    };

    toast.success(`Account created successfully! Welcome to AgroSmart in ${language}`);
    onLogin(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/95 shadow-2xl border-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/20 via-green-100/20 to-amber-100/30"></div>
          <CardHeader className="text-center relative z-10">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-4xl bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent font-bold">
                AgroSmart
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">Your AI-Powered Agriculture Assistant</CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-6 relative z-10">
            {/* Location Permission Status */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className={`p-3 rounded-lg border-2 ${
                locationPermissionGranted === true 
                  ? 'bg-green-50 border-green-200' 
                  : locationPermissionGranted === false 
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-2">
                  <MapPin className={`h-4 w-4 ${
                    locationPermissionGranted === true 
                      ? 'text-green-600' 
                      : locationPermissionGranted === false 
                        ? 'text-orange-600'
                        : 'text-blue-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    locationPermissionGranted === true 
                      ? 'text-green-700' 
                      : locationPermissionGranted === false 
                        ? 'text-orange-700'
                        : 'text-blue-700'
                  }`}>
                    {locationPermissionGranted === true 
                      ? 'Location Permission: Granted ✓' 
                      : locationPermissionGranted === false 
                        ? 'Location Permission: Denied ⚠️'
                        : 'Requesting Location Permission...'}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${
                  locationPermissionGranted === true 
                    ? 'text-green-600' 
                    : locationPermissionGranted === false 
                      ? 'text-orange-600'
                      : 'text-blue-600'
                }`}>
                  {locationPermissionGranted === true 
                    ? 'We can provide accurate weather data for your exact location'
                    : locationPermissionGranted === false 
                      ? 'Limited functionality - weather data may be less accurate'
                      : 'Please allow location access for the best experience'}
                </p>
                {locationPermissionGranted === false && (
                  <Button 
                    onClick={requestLocationPermission}
                    size="sm"
                    variant="outline"
                    className="mt-2 text-xs border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Language Selection */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Label className="flex items-center gap-2 mb-2 text-green-700 font-semibold">
                <Globe className="h-4 w-4" />
                Preferred Language
              </Label>
              <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger className="border-green-200 focus:border-green-400 bg-white/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <Tabs value={isLogin ? "login" : "register"} onValueChange={(value) => setIsLogin(value === "login")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <div>
                    <Label className="flex items-center gap-2 mb-2 text-green-700">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="border-green-200 focus:border-green-400 bg-white/80"
                    />
                  </div>
                  
                  <div>
                    <Label className="flex items-center gap-2 mb-2 text-green-700">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="border-green-200 focus:border-green-400 bg-white/80"
                    />
                  </div>
                  
                  <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white font-semibold py-2.5">
                    Login to AgroSmart
                  </Button>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4 mt-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <div>
                    <Label className="flex items-center gap-2 mb-2 text-green-700">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="border-green-200 focus:border-green-400 bg-white/80"
                    />
                  </div>
                  
                  <div>
                    <Label className="flex items-center gap-2 mb-2 text-green-700">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Create password (min 6 characters)"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="border-green-200 focus:border-green-400 bg-white/80"
                    />
                  </div>
                  
                  <div>
                    <Label className="flex items-center gap-2 mb-2 text-green-700">
                      <Lock className="h-4 w-4" />
                      Confirm Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-green-200 focus:border-green-400 bg-white/80"
                    />
                  </div>
                  
                  <div>
                    <Label className="flex items-center gap-2 mb-2 text-green-700">
                      <Shield className="h-4 w-4" />
                      Security Question: What is your favorite crop?
                    </Label>
                    <Input
                      placeholder="Answer for password recovery"
                      value={securityQuestion}
                      onChange={(e) => setSecurityQuestion(e.target.value)}
                      className="border-green-200 focus:border-green-400 bg-white/80"
                    />
                  </div>
                  
                  <Button onClick={handleRegister} className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white font-semibold py-2.5">
                    Create AgroSmart Account
                  </Button>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}