import { useState, useRef, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { LogOut, ShoppingBag, User, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingScreen from "@/components/blocks/LoadingScreen.tsx";
import { orderFood } from "../../services/api";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Credits } from "../../services/api";
// Define a type for the order structure
interface Order {
  timestamp: any;
  order_id: string;
  restaurant: string;
  status: string;
  info: {
    items: Array<{
      qty: number;
      dish: string;
      price: number;
    }>;
  };
  total: number;
}

export default function ProfilePage() {
  const { isLoggedIn, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState("processing");

  // State to hold the profile data
  const [profile, setProfile] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // New state for orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  // Fetch profile from the "User" table on mount
  useEffect(() => {
    const getUserCredits = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) {
          setLoadingProfile(false);
          return;
        }
        const data = await Credits.getUserCredits(user.id); // Assuming this returns a number
        setCredits(data.message.currentcredits);
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    }
    const fetchProfile = async () => {
      try {
        // Get the authenticated user first
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError) {
          console.error("Error fetching user:", authError);
          setLoadingProfile(false);
          return;
        }

        const user = authData?.user;

        if (!user) {
          setLoadingProfile(false);
          return;
        }

        // Query the "User" table for this user's profile.
        const { data: profileData, error: profileError } = await supabase
          .from("User")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          setProfile(profileData);
        }

      } catch (error) {
        console.error("Unexpected error while fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }


    };

    getUserCredits()
    fetchProfile();
  }, []);
  const filteredOrders = orders.filter(
    (order) => order.status === selectedFilter
  );
  console.log(filteredOrders);

  // Fetch orders when profile is available
  useEffect(() => {
    const fetchOrders = async () => {
      if (profile?.name) {
        try {

          const response = await orderFood.getOrdersByFilter(profile.id, '', '');
          console.log(response.message)
          //const response = await orderFood.getAllOrders();
          if (response.message) {

            setOrders(response.message);
          } else {
            console.error("Invalid response from getOrdersByFilter:", response);
          }
        } catch (err) {
          console.error("Error fetching orders:", err);
        } finally {
          setLoadingOrders(false);
        }
      }
    };

    fetchOrders();
  }, [profile?.name]);

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loadingProfile || loading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Header */}
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
              <h1 className="text-xl font-semibold">Profile</h1>
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
                <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleMenu}>
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
        {/* Responsive layout: sidebar + main content on md+; only main content on mobile */}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-8 py-8 px-4">
          {/* Sidebar with profile summary only (nav removed) */}
          <div className="hidden md:block">
            <div className="sticky top-20">
              <Card className="border-0 shadow-none">
                <CardHeader className="p-0 pb-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-center">
                      <h2 className="text-lg font-semibold">
                        {profile?.name || "No Name"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {profile?.email || "No email"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
          {/* Main Content */}
          <div className="space-y-6">
            <Tabs defaultValue="personal" className="w-full">
              {/* Tablist (always visible) */}
              <div className="w-full overflow-x-auto">
                <TabsList className="flex space-x-2 min-w-max bg-white">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </div>
              {/* Personal Info Tab */}
              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      View and edit your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <div>{profile?.name || "No Name Provided"}</div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <div>{profile?.email || "No Email Provided"}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Personal Info
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4">
                {loadingOrders ? (
                  <div>Loading orders...</div>
                ) : orders.length ? (
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>Orders</CardTitle>
                        <div className="flex gap-2">
                          {["processing", "cancelled", "completed"].map((filter) => (
                            <Button
                              key={filter}
                              variant={selectedFilter === filter ? "default" : "outline"}
                              onClick={() => setSelectedFilter(filter)}
                            >
                              {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {filteredOrders.length ? (
                          <div className="space-y-4">
                            {filteredOrders.map((order) => (
                              <div
                                key={order.order_id}
                                className="grid grid-cols-[1fr_100px_100px_80px] gap-4 text-sm"
                              >
                                <div>
                                  <div className="font-medium">
                                    Order ID: {order.order_id}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {/* {order.timestamp
                                      ? new Date(order.timestamp).toLocaleString()
                                      : "No time"} */}
                                  </div>
                                </div>
                                <div>
                                  <Badge
                                    variant="outline"
                                    className={
                                      order.status === "processing"
                                        ? "border-blue-500 text-blue-500"
                                        : order.status === "completed"
                                          ? "border-green-500 text-green-500"
                                          : "border-red-500 text-red-500"
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </div>
                                <div>
                                  Total: {order.total || order.restaurant}
                                </div>
                                <div className="flex justify-end">
                                  
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No orders with status &quot;{selectedFilter}&quot;
                          </p>
                        )}
                      </CardContent>
                    </Card>

                  </div>
                ) : (
                  <div>No orders found.</div>
                )}
              </TabsContent>
              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Manage your notification preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Order Updates</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive updates about your order status
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Special Offers</Label>
                        <div className="text-sm text-muted-foreground">
                          Get notified about special offers and discounts
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Newsletter</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive our weekly newsletter
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Update your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Language</Label>
                      <select className="w-full rounded-md border p-2">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Time Zone</Label>
                      <select className="w-full rounded-md border p-2">
                        <option>Eastern Time (ET)</option>
                        <option>Pacific Time (PT)</option>
                        <option>Central Time (CT)</option>
                      </select>
                    </div>
                    <Button variant="destructive" className="w-full sm:w-auto">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
