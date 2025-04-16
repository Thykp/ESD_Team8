import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Menu } from '../services/api';

export interface Restaurant {
  id: string;
  name: string;
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: string;
  tags?: string[];
  photos?: string[];
  distance?: string;
  logo_url?: string[];
  [key: string]: any;
}

interface RestaurantsContextProps {
  restaurants: Restaurant[];
  loading: boolean;
}

const RestaurantsContext = createContext<RestaurantsContextProps | undefined>(undefined);

export const RestaurantsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      // Try to load from localStorage first
      const cachedData = localStorage.getItem("restaurants");
      if (cachedData) {
        setRestaurants(JSON.parse(cachedData));
        setLoading(false);
        // Optionally, re-fetch in the background to update stale data
        fetchAndUpdateRestaurants();
        return;
      }
      try {
        const data = await Menu.getAllMenuItems();
        const restaurantsArray: Restaurant[] = Object.entries(data).map(
          ([id, restaurant]) => {
            const { id: _, ...restaurantData } = restaurant as Restaurant;
            return { id, ...restaurantData };          }
        );
        setRestaurants(restaurantsArray);
        localStorage.setItem("restaurants", JSON.stringify(restaurantsArray));
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }

      async function fetchAndUpdateRestaurants() {
        try {
          const data = await Menu.getAllMenuItems();
          const restaurantsArray: Restaurant[] = Object.entries(data).map(
            ([id, restaurant]) => {
              const { id: _, ...restaurantData } = restaurant as Restaurant;
              return { id, ...restaurantData };            }
          );
          setRestaurants(restaurantsArray);
          localStorage.setItem("restaurants", JSON.stringify(restaurantsArray));
        } catch (error) {
          console.error("Error updating restaurants:", error);
        }
      }
      
    }
    fetchRestaurants();
  }, []);
  

  return (
    <RestaurantsContext.Provider value={{ restaurants, loading }}>
      {children}
    </RestaurantsContext.Provider>
  );
};

export const useRestaurants = (): RestaurantsContextProps => {
  const context = useContext(RestaurantsContext);
  if (!context) {
    throw new Error("useRestaurants must be used within a RestaurantsProvider");
  }
  return context;
};
