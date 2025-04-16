import { useState, useRef, useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRestaurants } from "@/context/RestaurantsContext";
import { supabase } from "@/supabaseClient";
import { ChevronLeft, User, ShoppingBag, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Credits } from "@/services/api";

export default function ProductPage() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { restaurants, loading: restaurantsLoading } = useRestaurants();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const restaurantParam = searchParams.get("restaurant");
  const categoryParam = searchParams.get("category");
  const itemParam = searchParams.get("item");
  const [credits, setCredits] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const getUserCredits = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) { }
        else {
          const data = await Credits.getUserCredits(user.id); // Assuming this returns a number
          setCredits(data.message.currentcredits);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    getUserCredits()
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (authLoading || restaurantsLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (!restaurantParam || !categoryParam || !itemParam) {
    return <div>Missing required URL parameters.</div>;
  }

  const restaurant = restaurants.find(
    (r) => r.id?.toLowerCase() === restaurantParam.toLowerCase()
  );

  if (!restaurant) {
    return <div>Restaurant not found.</div>;
  }

  const product = restaurant[categoryParam]?.[itemParam];

  if (!product) {
    return <div>Product not found.</div>;
  }

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const handleSignOut = async () => await supabase.auth.signOut();

  const handleAddToCart = () => {
    addToCart({
      restaurant: restaurantParam,
      category: categoryParam,
      item: itemParam,
      details: {
        photo: product.photo || "/placeholder.svg?height=400&width=600",
        desc: product.desc,
        price: product.price,
      },
      quantity: 1,
    });
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={`/shop/?shop=${restaurant.id}`}
              className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Shop
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

      <main className="flex-1">
        <div className="container grid gap-8 py-8 md:grid-cols-2 px-4">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-lg border">
              <img
                src={product.photo || "/placeholder.svg?height=400&width=600"}
                alt={itemParam.replace(/_/g, " ")}
                width="600"
                height="400"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">
                {itemParam.replace(/_/g, " ")}
              </h1>
              <p className="mt-4 text-muted-foreground">{product.desc}</p>
              <div className="mt-4 text-2xl font-bold">
                ${product.price.toFixed(2)}
              </div>
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              size="lg"
            >
              Add to Cart
            </Button>
            <div className="mt-8">
              <h2 className="text-xl font-bold">User Reviews</h2>
              <ul className="mt-4 space-y-4">
                <li className="p-4 border rounded-md shadow-sm">"Great product! Tastes amazing." - John Doe</li>
                <li className="p-4 border rounded-md shadow-sm">"Will definitely order again!" - Jane Smith</li>
                <li className="p-4 border rounded-md shadow-sm">"Highly recommend to everyone!" - Alex Johnson</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      {showMessage && (
        <div className="fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg">
          <CheckCircle className="h-5 w-5" /> Added to cart
        </div>
      )}
    </div>
  );
}
