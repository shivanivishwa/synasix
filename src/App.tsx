import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AuthScreen } from "./components/AuthScreen";
import { HomePage } from "./components/HomePage";
import { WeatherDetails } from "./components/WeatherDetails";
import { MarketDetails } from "./components/MarketDetails";
import { CropRecommendation } from "./components/CropRecommendation";
import { PestDetection } from "./components/PestDetection";
import { ChatBot } from "./components/ChatBot";
import { Feedback } from "./components/Feedback";
import { Toaster } from "./components/ui/sonner";

export type Language = "English" | "Hindi" | "Punjabi";

export interface User {
  phoneNumber: string;
  location: string;
  language: Language;
}

export type Screen =
  | "auth"
  | "home"
  | "weather-details"
  | "market-details"
  | "crop-recommendation"
  | "pest-detection"
  | "chat"
  | "feedback";

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("auth");
  const [user, setUser] = useState<User | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
    city: string;
  } | null>(null);

  // Auto-detect user location
  useEffect(() => {
    const detectLocation = async () => {
      if (!navigator.geolocation) {
        console.log(
          "Geolocation is not supported by this browser",
        );
        return;
      }

      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 600000, // 10 minutes
              },
            );
          },
        );

        const { latitude, longitude } = position.coords;
        console.log("Location detected:", latitude, longitude);

        // Reverse geocoding to get city name using OpenWeather API
        try {
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=d3fcdf9da242758b5851852d56da93f0`,
          );

          if (response.ok) {
            const data = await response.json();
            const cityName =
              data[0]?.name || "Auto-detected Location";

            setUserLocation({
              lat: latitude,
              lon: longitude,
              city: cityName,
            });
            console.log("Location set:", cityName);
          } else {
            console.warn(
              "Reverse geocoding failed, using coordinates",
            );
            setUserLocation({
              lat: latitude,
              lon: longitude,
              city: "Auto-detected Location",
            });
          }
        } catch (geocodingError) {
          console.warn(
            "Error getting city name:",
            geocodingError,
          );
          setUserLocation({
            lat: latitude,
            lon: longitude,
            city: "Auto-detected Location",
          });
        }
      } catch (error) {
        // Handle specific geolocation errors
        if (
          error &&
          typeof error === "object" &&
          "code" in error
        ) {
          const geoError = error as GeolocationPositionError;
          switch (geoError.code) {
            case geoError.PERMISSION_DENIED:
              console.log("Location permission denied by user");
              break;
            case geoError.POSITION_UNAVAILABLE:
              console.log(
                "Location information is unavailable",
              );
              break;
            case geoError.TIMEOUT:
              console.log("Location request timeout");
              break;
            default:
              console.log("Unknown location error occurred");
              break;
          }
        } else {
          console.log(
            "Location detection failed:",
            error || "Unknown error",
          );
        }
        // Don't set userLocation on error - app will work with user-selected locations
      }
    };

    detectLocation();
  }, []);

  const screenVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  };

  const transition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image - Sharp and Clear */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1588508828850-cce17eb789bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBncmVlbiUyMGZpZWxkJTIwYWdyaWN1bHR1cmUlMjBibHVyfGVufDF8fHx8MTc1NzYxMDY5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
        }}
      />

      {/* Golden Green Overlay - No blur effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/60 via-green-200/50 to-amber-200/70" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          variants={screenVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="relative z-10 h-full"
        >
          {currentScreen === "auth" && (
            <AuthScreen
              onLogin={(userData) => {
                setUser(userData);
                setCurrentScreen("home");
              }}
            />
          )}

          {currentScreen === "home" && user && (
            <HomePage
              user={user}
              onNavigate={setCurrentScreen}
              isVoiceEnabled={isVoiceEnabled}
              onToggleVoice={setIsVoiceEnabled}
            />
          )}

          {currentScreen === "weather-details" && (
            <WeatherDetails
              user={user!}
              userLocation={userLocation}
              onBack={() => setCurrentScreen("home")}
            />
          )}

          {currentScreen === "market-details" && (
            <MarketDetails
              user={user!}
              onBack={() => setCurrentScreen("home")}
            />
          )}

          {currentScreen === "crop-recommendation" && (
            <CropRecommendation
              user={user!}
              onBack={() => setCurrentScreen("home")}
            />
          )}

          {currentScreen === "pest-detection" && (
            <PestDetection
              user={user!}
              onBack={() => setCurrentScreen("home")}
            />
          )}

          {currentScreen === "chat" && (
            <ChatBot
              user={user!}
              onBack={() => setCurrentScreen("home")}
            />
          )}

          {currentScreen === "feedback" && (
            <Feedback
              user={user!}
              onBack={() => setCurrentScreen("home")}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <Toaster />
    </div>
  );
}