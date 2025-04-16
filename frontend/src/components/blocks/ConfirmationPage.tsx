import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Payment, orderFood } from "../../services/api";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/supabaseClient";

interface OrderItem {
    item: string;
    quantity: number;
    details: {
        price: number;
        desc: string;
        photo?: string;
    };
    restaurant?: string;
}
interface Order {
    orderNumber: string;
    orderDate: string;
    paymentMethod: string;
    paymentId: string;
    total: number;
    items: OrderItem[];
    subtotal: number;
    serviceFee: number;
    creditsUsed: number;
}

export default function ConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { state } = location;
    const { clearCart } = useCart();
    const orderProcessedRef = useRef(false);

    useEffect(() => {
        if (state && state.order) {
            setOrder(state.order);
            return;
        }

        const sessionId = new URLSearchParams(location.search).get('session_id');
        if (!sessionId) return;

        if (orderProcessedRef.current) return;
        orderProcessedRef.current = true;

        const fetchSessionDetails = async () => {
            setLoading(true);

            try {
                const pendingOrderRaw = localStorage.getItem('pendingOrder');
                if (!pendingOrderRaw) {
                    console.log("No pending order found.");
                    setError('No pending order found.');
                    setTimeout(() => navigate('/cart'), 3000);
                    return;
                }

                let pendingOrder;
                try {
                    pendingOrder = JSON.parse(pendingOrderRaw);
                } catch (parseError) {
                    console.error('Error parsing pending order:', parseError);
                    setError('Invalid order data found. Please try again.');
                    setTimeout(() => navigate('/cart'), 3000);
                    return;
                }

                if (!pendingOrder.items || !Array.isArray(pendingOrder.items) || pendingOrder.items.length === 0) {
                    console.log("No items to process, skipping API call");
                    setError('No items found to process the order.');
                    setTimeout(() => navigate('/cart'), 3000);
                    return;
                }

                const response = await Payment.sessionStatus(sessionId);
                if (response.data.status === 'complete' && response.data.payment_status === 'paid') {
                    const itemsByRestaurant: any = {};
                    pendingOrder.items.forEach((item: any) => {
                        const restaurantName = item.restaurant || item.restaurantName || 'Unknown';
                        if (!itemsByRestaurant[restaurantName]) {
                            itemsByRestaurant[restaurantName] = [];
                        }
                        itemsByRestaurant[restaurantName].push({
                            qty: item.quantity,
                            dish: (item.item || "").replace(/ /g, '_'),
                            price: item.details?.price || 0,
                        });
                    });

                    const { data: userData, error: authError } = await supabase.auth.getUser();
                    if (authError) {
                        console.error("Error fetching user:", authError);
                        setError('Failed to verify your account. Please try again.');
                        setTimeout(() => navigate('/cart'), 3000);
                        return;
                    }

                    const user = userData?.user;
                    if (!user) {
                        console.error("User not found.");
                        setError('User account not found. Please log in and try again.');
                        setTimeout(() => navigate('/cart'), 3000);
                        return;
                    }

                    const orderContent = Object.keys(itemsByRestaurant).map((restaurant) => ({
                        user_id: user.id,
                        info: {
                            items: itemsByRestaurant[restaurant],
                        },
                        restaurant: restaurant,
                        total: parseFloat(
                            itemsByRestaurant[restaurant]
                                .reduce((sum: any, item: any) => sum + item.qty * item.price, 0)
                                .toFixed(2)
                        ),
                    }));

                    if (orderContent.length > 0) {
                        const orderData = {
                            orderContent: orderContent,
                            creditsContent: {},
                        };
                        console.log('Sending order data:', orderData);

                        const orderResponse = await orderFood.addOrder(orderData);
                        console.log('Order created:', orderResponse.data);

                        const orderIdsByRestaurant = orderResponse.data.order.map((orderItem: any) => ({
                            restaurant: orderItem.restaurant,
                            orderId: orderItem.order_id,
                        }));

                        setOrder({
                            orderNumber: orderIdsByRestaurant
                                .map((o: any ) => `${o.restaurant}: ${o.orderId}`)
                                .join(', ') || 'N/A',
                            orderDate: new Date().toLocaleString(),
                            paymentMethod: 'Credit Card',
                            paymentId: sessionId,
                            items: pendingOrder.items,
                            subtotal: pendingOrder.subtotal || 0,
                            serviceFee: pendingOrder.serviceFee || 1.5,
                            total: response.data.amount_total || 0,
                            creditsUsed: pendingOrder.creditsUsed || 0,
                        });

                        localStorage.removeItem('pendingOrder');
                        clearCart();
                    } else {
                        setError('Payment was not completed successfully.');
                        setTimeout(() => navigate('/cart'), 3000);
                    }
                } else {
                    setError('Payment not completed or invalid status.');
                    setTimeout(() => navigate('/cart'), 3000);
                }
            } catch (err) {
                console.error('Error fetching session details:', err);
                setError('Failed to verify payment details.');
                setTimeout(() => navigate('/cart'), 3000);
            } finally {
                setLoading(false);
            }
        };

        fetchSessionDetails();
    }, [location.search, state, navigate]);

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center">Loading order details...</div>;
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-xl font-semibold text-red-500">{error}</p>
                <p>Redirecting to cart...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-xl font-semibold">No order data found.</p>
                <Link to="/">
                    <Button className="mt-4">Back to Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-center">
                    <h1 className="text-xl font-semibold">Order Confirmation</h1>
                </div>
            </header>
            <main className="flex-1">
                <div className="container max-w-2xl py-8 px-4">
                    <div className="text-center mb-8">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                            <Check className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
                        <p className="mt-2 text-muted-foreground">
                            Thank you for your purchase! Your order has been placed successfully.
                        </p>
                    </div>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Order Number(s)</span>
                                <span className="font-medium">{order.orderNumber}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Order Date</span>
                                <span>{order.orderDate}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Payment Method</span>
                                <span>{order.paymentMethod}</span>
                            </div>
                            <Separator />
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span>
                                            {(item.item || `Item ${index + 1}`).replace(/_/g, ' ')} x {item.quantity}
                                        </span>
                                        <span>
                                            $
                                            {typeof item.details?.price === 'number'
                                                ? (item.details.price * item.quantity).toFixed(2)
                                                : '0.00'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex justify-between text-sm">
                                    <span>Items</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>${(order.subtotal || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Service Fee</span>
                                <span>${(order.serviceFee || 0).toFixed(2)}</span>
                            </div>
                            {order.creditsUsed > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Credits Applied</span>
                                    <span>-${order.creditsUsed.toFixed(2)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-medium">
                                <span>Total</span>
                                <span>${(order.total || 0).toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Link to="/home">
                                <Button
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                    size="lg"
                                    aria-label="Continue shopping"
                                >
                                    Continue Shopping
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
}
