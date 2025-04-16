import { useState, useRef, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabaseClient";
import { Credits, recommendFood } from "@/services/api";
import {
  ChevronLeft,
  ShoppingBag,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RecommendationPage() {
  const { isLoggedIn, loading, user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  useEffect(() => {
    const getUserCredits = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const currentUser = authData?.user;
        if (currentUser) {
          const data = await Credits.getUserCredits(currentUser.id);
          setCredits(data.message.currentcredits);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    getUserCredits();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleSignOut = async () => await supabase.auth.signOut();

  const handleGenerateRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      // Use the user's id to generate recommendations
      const data = await recommendFood.getChatGPTRecommendations(user.id);
      // Log to verify the nested structure:
      console.log(data.foodReccomendation.foodReccomendation);
      setRecommendations(data);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Access the suggestions from the nested property
  const suggestionEntries =
    recommendations &&
    recommendations.foodReccomendation &&
    recommendations.foodReccomendation.foodReccomendation
      ? Object.entries(recommendations.foodReccomendation.foodReccomendation)
      : [];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/home"
              className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Recommended For You</h1>
          </div>
          <div className="flex items-center gap-4">
            <div>
              Credits: {credits !== null ? credits : "Loading..."}
            </div>
            <Link to="/cart">
              <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Cart
              </Button>
            </Link>
            <div className="relative" ref={menuRef}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={toggleMenu}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <Link to="/home">
                    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                      Home
                    </button>
                  </Link>
                  <Link to="/profile">
                    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                      Profile
                    </button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-6 px-4">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-4">Generate Recommendations</h1>
            <p className="mb-8">
              Not sure what to eat? Let us generate some suggestions for you based off your past orders and preferences.
            </p>
            <Button onClick={handleGenerateRecommendations} disabled={loadingRecommendations}>
              {loadingRecommendations ? "Generating..." : "Generate Recommendations"}
            </Button>
          </div>
          {/* Display recommendations as cards */}
          {suggestionEntries.length > 0 && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {suggestionEntries.map(([key, suggestion]: [string, any]) => (
                <Card key={key} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={suggestion.photo || "/placeholder.svg?height=200&width=300"}
                        alt={suggestion.food_item}
                        width="300"
                        height="200"
                        className="aspect-[3/2] w-full object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">
                      {(suggestion.food_item || "").replace(/_/g, " ")}
                    </h3>
                    <p className="text-sm text-muted-foreground">{(suggestion.restaurant).replace(/_/g, " ")}</p>
                    <p className="text-sm mt-2">{suggestion.desc}</p>
                  </CardContent>
                  <div className="px-4 pb-4">
                    <span className="font-semibold">{suggestion.price}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
