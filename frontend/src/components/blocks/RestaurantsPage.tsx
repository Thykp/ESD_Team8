import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRestaurants } from "@/context/RestaurantsContext";
import {
  Search,
  Star,
  Clock,
  ChevronDown,
  SlidersHorizontal,
  ChevronLeft
} from "lucide-react";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import LoadingScreen from "@/components/blocks/LoadingScreen";
import { Credits, Queue } from "@/services/api";

export default function RestaurantsPage() {
  const { restaurants, loading } = useRestaurants();
  const [displayCount, setDisplayCount] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [deliveryTimes, setDeliveryTimes] = useState<{ [key: string]: number }>({});

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  console.log(filteredRestaurants)
  useEffect(() => {
    if (!filteredRestaurants.length || loading) return;
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

    const fetchAndSetAllQueues = async () => {
      try {
        const queueData = await Queue.getAllQueue();
        
        if (queueData && queueData.data) {
          // For each restaurant, set deliveryTimes[restaurantId] = queue length
          const counts: Record<string, number> = {};
          
          for (const [restaurant, orders] of Object.entries(queueData.data)) {
            if (Array.isArray(orders)) {
              counts[restaurant] = orders.length;
            } else {
              counts[restaurant] = 0; // fallback or handle error
            }
        }
         setDeliveryTimes(counts);
        }
      } catch (error) {
        console.error("Error fetching all queues:", error);
      }
    };

    fetchAndSetAllQueues();
    getUserCredits();
  },[restaurants, displayCount]); // Adjust dependencies as needed

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 8);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/home"
              className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Home
            </Link>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-[300px] lg:w-[450px]"
            />
          </div>
          <Sheet>
            <div>
              Credits: {credits !== null ? credits : "Loading..."}
            </div>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Sort By</h3>
                  <Select defaultValue="recommended">
                    <SelectTrigger>
                      <SelectValue placeholder="Select sorting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="delivery-time">Delivery Time</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">$</Button>
                    <Button variant="outline" size="sm">$$</Button>
                    <Button variant="outline" size="sm">$$$</Button>
                    <Button variant="outline" size="sm">$$$$</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Dietary</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="vegetarian">Vegetarian</Label>
                      <Switch id="vegetarian" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="vegan">Vegan</Label>
                      <Switch id="vegan" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="gluten-free">Gluten Free</Label>
                      <Switch id="gluten-free" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Maximum Delivery Time</h3>
                  <Slider defaultValue={[45]} max={60} step={5} />
                  <div className="text-sm text-muted-foreground">Up to 45 minutes</div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Rating</h3>
                  <div className="flex items-center gap-4">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <Button key={rating} variant="outline" size="sm" className="gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        {rating}+
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Reset</Button>
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Select defaultValue="recommended">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="delivery-time">Delivery Time</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
            {filteredRestaurants.slice(0, displayCount).map((restaurant) => (
              <Link
                to={`/shop/?shop=${restaurant.id}`}
                key={restaurant.id}
                className="overflow-hidden"
              >
                <Card>
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={restaurant.logo_url?.[0] || "/placeholder.svg"}
                        alt={restaurant.name}
                        width={300}
                        height={200}
                        className="aspect-video object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-2.5 p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">
                        <span className="text-sm text-muted-foreground">
                          {(restaurant.name || restaurant.id || "").replace(/_/g, " ")}
                        </span>
                      </h3>
                      <Badge variant="secondary" className="flex gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        {restaurant.rating}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {deliveryTimes[restaurant.id.toLowerCase()] !== undefined
                                  ? deliveryTimes[restaurant.id.toLowerCase()] * 3 + " mins"
                                  : "Loading..."}
                      </div>
                      <div className="flex items-center gap-1">
                        
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {displayCount < filteredRestaurants.length && (
            <div className="flex justify-center mt-8">
              <Button variant="outline" size="lg" onClick={handleLoadMore}>
                Load More
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
