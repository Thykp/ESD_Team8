import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast'; // Adjust the import path based on your project structure [[8]]
import { listenForNotifications, getNotifications } from '../../services/api';
// import { useAuth } from '../../context/AuthContext';
// import { Navigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { ToastAction } from "@/components/ui/toast"

export default function RealTimeNotifications() {
    const { toast } = useToast();

    // const { isLoggedIn, loading } = useAuth();
    // if (!isLoggedIn || loading) return

    // // Ensure the user is authenticated before proceeding
    //     if (loading) {
    //         return <div>Loading...</div>;
    //     }

    //     if (!isLoggedIn) {
    //         return <Navigate to="/login" />;
    //     }

    useEffect(() => {

        // Fetch the current user's ID from Supabase
        const getCurrentUserId = async () => {
            try {
                const { data: authData } = await supabase.auth.getUser();
                const user = authData?.user;
                return user?.id; // Return the user ID
            } catch (error) {
                console.error("Error fetching user ID:", error);
                return null;
            }
        };


        // Start listening for notifications
        const setupNotifications = async () => {
            const currentUserId = await getCurrentUserId();

            if (!currentUserId) {
                console.error("User ID not found. Notifications cannot be set up.");
                return;
            }

            listenForNotifications();

            // Subscribe to the notification stream
            const subscription = getNotifications().subscribe(notification => {
                
                const notificationUserId = notification?.user_id; // Extract the userId from the payload
                console.log(notificationUserId)
                console.log(currentUserId)

                // Check if the notification is for the current user
                if (notificationUserId && notificationUserId === currentUserId) {
                    console.log(notification)
                    toast({
                        title: "You Got a New Notification!",
                        description: notification.message || "No details available.",
                        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
                    });
                }
            });

            // Cleanup subscription on unmount
            return () => subscription.unsubscribe();
        };

        setupNotifications();
    }, [toast]); // perfect restricted use state

    return null; // Component does not render anything
}

