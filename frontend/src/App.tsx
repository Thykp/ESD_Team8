import { Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Restaurants from './pages/Restaurants';
import Shop from './pages/Shop';
import Product from './pages/Product';
import BusinessHomePage from './components/blocks/BusinessHomePage';
import ConfirmationPage from './components/blocks/ConfirmationPage';
import './App.css'

const stripePromise = loadStripe('STRIPE_PUBLIC_KEY');

const App = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <Elements stripe={stripePromise}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product" element={<Product />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/confirmation" element={<ConfirmationPage />} />
                        <Route path="/restaurants" element={<Restaurants />} />
                        <Route path="/business-home" element={<BusinessHomePage />} />
                    </Routes>
                </Elements>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
