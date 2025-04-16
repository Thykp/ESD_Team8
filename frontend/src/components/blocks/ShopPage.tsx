import { useState, useRef, useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRestaurants } from "@/context/RestaurantsContext";
import { supabase } from "@/supabaseClient";
import {
  ChevronLeft,
  User,
  Star,
  Clock,
  MapPin,
  Info,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Queue, Credits } from "../../services/api";

export default function ShopPage() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { restaurants, loading: restaurantsLoading } = useRestaurants();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const shopParam = searchParams.get("shop");
  const [menuOpen, setMenuOpen] = useState(false);
  const [queueItems, setQueueItems] = useState([]); // State to hold queue items
  const menuRef = useRef<HTMLDivElement>(null);
  const [credits, setCredits] = useState<number | null>(null);

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const getUserCredits = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (user) {
          const data = await Credits.getUserCredits(user.id); // Assuming this returns a number
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch and process queue data for the specific restaurant
  useEffect(() => {
    async function fetchQueueData() {
      try {
        if (!shopParam) {
          console.error("Restaurant not found.");
          setQueueItems([]);
          return;
        }
        const restaurant = shopParam.toLowerCase();

        // Fetch queue items for the specific restaurant using getRestaurantQueue
        const rawQueueItems = await Queue.getRestaurantQueue(restaurant);

        // Debugging: Log the raw response to inspect its structure
        console.log("Raw Queue Items:", rawQueueItems.data);

        // Ensure rawQueueItems is an array; if not, use an empty array as fallback
        const queueArray = Array.isArray(rawQueueItems.data) ? rawQueueItems.data : [];

        // Transform and sort the data
        const transformedQueueItems = queueArray
          .map((item: any) => ({
            name: `Order #${item.queue_no}: ${item.order_id}`,
            status: item.time, // Display time as status
          }))
          .sort((a: any, b: any) => {
            // Extract queue number from the name to sort numerically
            const queueNoA = parseInt(a.name.split("#")[1], 10);
            const queueNoB = parseInt(b.name.split("#")[1], 10);
            return queueNoA - queueNoB;
          });

        setQueueItems(transformedQueueItems); // Update state with transformed data
      } catch (error) {
        console.error("Error fetching Queue:", error);
        setQueueItems([]); // Set an empty array in case of an error
      }
    }

    fetchQueueData();
  }, [shopParam]);

  // Loading and authentication checks
  if (authLoading || restaurantsLoading) {
    return <div>Loading...</div>;
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  if (!shopParam) {
    return <div>No shop specified in the URL.</div>;
  }

  const restaurant = restaurants.find(
    (r) => r.id?.toLowerCase() === shopParam.toLowerCase()
  );
  if (!restaurant) {
    return <div>Restaurant not found.</div>;
  }

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/restaurants"
              className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Restaurants
            </Link>
          </div>
          <div className="flex items-center gap-4"></div>
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

      {/* Restaurant Cover and Info */}
      <div className="relative">
        <div className="h-[200px] overflow-hidden">
          <img
            src={
              restaurant.menu_url && restaurant.menu_url[0]
                ? restaurant.menu_url[0]
                : "/placeholder.svg?height=400&width=1200"
            }
            alt="Restaurant cover"
            width="1200"
            height="400"
            className="w-full object-cover"
          />
        </div>
        <div className="container relative -mt-16 px-4">
          <Card>
            <CardContent className="p-6">
              {/* Centered Name */}
              <h1 className="text-2xl font-bold text-center">
                {(restaurant.name || restaurant.id || "").replace(/_/g, " ")}
              </h1>

              {/* Centered Description */}
              <p className="mt-2 text-center text-muted-foreground">
                No description available
              </p>

              {/* Grid with reviews and right info */}
              <div className="mt-4 grid gap-4 md:grid-cols-2 items-start">
                {/* Left Column */}
                <div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="font-medium">{restaurant.rating || "N/A"}</span>
                      <span className="text-muted-foreground">(reviews)</span>
                    </div>
                    <Badge variant="secondary">$$</Badge>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{restaurant.deliveryTime || "N/A"} delivery</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{restaurant.distance || "N/A"}</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Info className="h-4 w-4" />
                          Restaurant Info
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="w-[300px] p-4">
                        <div className="space-y-2">
                          <p className="font-medium">Opening Hours</p>
                          <p className="text-sm">Mon-Sun: 11:00 AM - 10:00 PM</p>
                          <p className="font-medium">Address</p>
                          <p className="text-sm">123 Burger Street, Food City, FC 12345</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Queue Section */}
              <div className="mt-6">
                <h2 className="mb-2 text-lg font-semibold">Queue</h2>
                <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                  {queueItems.length > 0 ? (
                    queueItems.map((item: any, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border-b last:border-b-0"
                      >
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.status}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-center text-muted-foreground">
                      No items in the queue.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Main Content: Menu Items */}
      <main className="flex-1">
        <div className="container py-8 px-4">
          <div className="space-y-8">
            {Object.keys(restaurant)
              .filter(
                (key) =>
                  ![
                    "id",
                    "logo_url",
                    "menu_url",
                    "photos",
                    "rating",
                    "deliveryTime",
                    "distance",
                  ].includes(key)
              )
              .map((category) => (
                <div key={category}>
                  <h2 className="mb-4 text-xl font-bold">
                    {category.replace(/_/g, " ")}
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(restaurant[category]).map(
                      ([itemKey, item]: any) => (
                        <Card key={itemKey} className="overflow-hidden">
                          <Link
                            to={`/product?restaurant=${restaurant.id}&category=${category}&item=${itemKey}`}
                          >
                            <CardHeader className="p-0">
                              <div className="relative">
                                <img
                                  src={item.photo || "/placeholder.svg"}
                                  alt={itemKey}
                                  width="300"
                                  height="200"
                                  className="aspect-[3/2] w-full object-cover"
                                />
                              </div>
                            </CardHeader>
                            <CardContent className="grid gap-2.5 p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <h3 className="font-semibold">
                                    {itemKey.replace(/_/g, " ")}
                                  </h3>
                                  <p className="line-clamp-2 text-sm text-muted-foreground">
                                    {item.desc}
                                  </p>
                                </div>
                                <Button
                                  size="icon"
                                  className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                >
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Add to cart</span>
                                </Button>
                              </div>
                              <div className="font-semibold">${item.price}</div>
                            </CardContent>
                          </Link>
                        </Card>
                      )
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
