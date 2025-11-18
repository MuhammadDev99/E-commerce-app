import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout.tsx';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetail from "./pages/ProductDetail/index.tsx";
import Cart from "./pages/Cart/index.tsx";
import Register from "./pages/Register/index.tsx";
import Dashboard from "./pages/Dashboard/index.tsx";
import Checkout from './pages/Checkout/index.tsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="login" element={<Login />} />
                    <Route path="products" element={<Products />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="register" element={<Register />} />
                    <Route path="products/:productId" element={<ProductDetail />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="checkout" element={<Checkout />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App
