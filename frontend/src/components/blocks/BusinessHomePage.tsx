import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabaseClient";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { orderFood, completeOrder, Queue } from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Toaster } from '@/components/ui/toaster';

export default function BusinessHomePage() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // State for filtering orders by status
  const [selectedFilter, setSelectedFilter] = useState("processing");
  // Orders state initially empty
  const [orders, setOrders] = useState<any[]>([]);
  // Queue state initially empty
  const [queueData, setQueueData] = useState<any[]>([]);

  // State for our Reason Modal
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState("");
  const [currentOrder, setCurrentOrder] = useState<any>(null);

  // Fetch orders and queue from API on mount, filtering by the restaurant associated with the user.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: userData, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error("Error fetching user:", authError);
          return;
        }
        const user = userData?.user;
        if (!user) {
          console.log("No user is logged in.");
          return;
        }

        // Get the user's restaurant from the "User" table
        const { data: restaurantData, error: profileError } = await supabase
          .from("User")
          .select("restaurant")
          .eq("id", user.id)
          .maybeSingle();
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return;
        }
        const restaurant = restaurantData?.restaurant;
        console.log("User's restaurant:", restaurant);

        // Fetch all orders
        const ordersResponse = await orderFood.getAllOrders();
        console.log("Fetched orders", ordersResponse);
        let ordersArray: any[] = [];
        if (Array.isArray(ordersResponse)) {
          ordersArray = ordersResponse;
        } else if (ordersResponse.orders && Array.isArray(ordersResponse.orders)) {
          ordersArray = ordersResponse.orders;
        } else if (ordersResponse.message && Array.isArray(ordersResponse.message)) {
          ordersArray = ordersResponse.message;
        } else {
          console.error("Unexpected orders data format:", ordersResponse);
          ordersArray = [];
        }

        // Filter orders to only those from the user's restaurant
        if (restaurant) {
          ordersArray = ordersArray.filter(
            (order) => order.restaurant === restaurant
          );
        }
        setOrders(ordersArray);

        // Fetch the restaurant's queue using the getRestaurantQueue endpoint.
        if (restaurant) {
          const queueResponse = await Queue.getRestaurantQueue(restaurant);
          console.log("Fetched queue", queueResponse);
          // Assuming the response structure is { data: [...] }
          if (queueResponse.data && Array.isArray(queueResponse.data)) {
            setQueueData(queueResponse.data);
          } else {
            console.error("Unexpected queue response format:", queueResponse);
            setQueueData([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders or queue:", error);
      }
    };

    fetchData();
  }, []);

  // Further filter orders by selected status
  const filteredOrders = orders.filter(
    (order) => order.status === selectedFilter
  );
  console.log(filteredOrders);

  // Function to update order status locally (using order_id as key)
  const updateOrderStatusLocally = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.order_id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Helper to remove a queue item from local state by order_id
  const removeQueueItem = (orderId: string) => {
    setQueueData((prevQueue) =>
      prevQueue.filter((item) => item.order_id !== orderId)
    );
  };

  // Function to handle confirmation from the modal
  const handleModalConfirm = async () => {
    if (!reasonInput) {
      alert("Reason is required.");
      return;
    }
    if (currentOrder && modalStatus) {
      // Build the payload as expected by the API.
      const payload = {
        restaurant: currentOrder.restaurant,
        total: parseFloat(currentOrder.total) + 1.5,
        user_id: currentOrder.user_id,
        reason: reasonInput
      };
      // Optimistically update the UI for orders
      updateOrderStatusLocally(currentOrder.order_id, modalStatus);
      // Also remove the queue item from local state since the order is no longer in queue.
      removeQueueItem(currentOrder.order_id);
      try {
        if (modalStatus === "cancelled") {
          await completeOrder.cancelOrder(currentOrder.order_id, payload);
        } else if (modalStatus === "completed") {
          await completeOrder.completeOrder(currentOrder.order_id, payload);
        }
      } catch (error) {
        console.error("Failed to update order status", error);
        // Optionally revert the optimistic update here if needed.
      }
    }
    // Reset modal state
    setReasonInput("");
    setModalStatus(null);
    setCurrentOrder(null);
    setReasonModalOpen(false);
  };

  // Function to handle update for statuses that do not require a reason.
  const handleDirectUpdate = async (order: any, newStatus: string) => {
    updateOrderStatusLocally(order.order_id, newStatus);
    try {
      if (newStatus === "processing") {
        // No API call needed.
      }
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Business Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content: Orders & Queues Sections */}
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Orders Section */}
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
                        <div className="text-muted-foreground">
                          User ID: {order.user_id}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.timestamp
                            ? new Date(order.timestamp).toLocaleString()
                            : "No time"}
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
                        {order.status === "processing" ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDirectUpdate(order, "processing")
                                }
                              >
                                Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setCurrentOrder(order);
                                  setModalStatus("cancelled");
                                  setReasonModalOpen(true);
                                }}
                              >
                                Cancelled
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setCurrentOrder(order);
                                  setModalStatus("completed");
                                  setReasonModalOpen(true);
                                }}
                              >
                                Completed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled
                          >
                            <MoreVertical className="h-4 w-4 opacity-50" />
                            <span className="sr-only">No Actions</span>
                          </Button>
                        )}
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
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </CardFooter>
          </Card>

          {/* Queues Section */}
          <Card>
            <CardHeader>
              <CardTitle>Queues</CardTitle>
              <CardDescription>Current order queues</CardDescription>
            </CardHeader>
            <CardContent>
              {queueData.length ? (
                <div className="space-y-4">
                  {queueData.map((queue) => (
                    <div
                      key={queue.queue_no}
                      className="rounded border p-4 text-sm"
                    >
                      <div className="font-medium">
                        Order ID: {queue.order_id}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {queue.time
                          ? new Date(queue.time).toLocaleString()
                          : "No time"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No queues available.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Queues
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Reason Modal */}
      <Dialog open={reasonModalOpen} onOpenChange={setReasonModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {modalStatus === "cancelled"
                ? "Cancel Order"
                : modalStatus === "completed"
                ? "Complete Order"
                : ""}
            </DialogTitle>
            <DialogDescription>
              Please enter a reason for setting the order as {modalStatus}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              className="w-full rounded border p-2"
              placeholder="Enter your reason..."
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReasonInput("");
                setModalStatus(null);
                setCurrentOrder(null);
                setReasonModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleModalConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster/>
    </div>
  );
}
