import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Checkout from './pages/Checkout.jsx'
import Admin from './pages/Admin.jsx'
import Shop from './pages/Shop.jsx'
import FishPage from './pages/FishPage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import TermsAndConditions from './pages/TermsAndConditions.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import About from './pages/About.jsx'
import Feedback from './pages/FeedbackForm.jsx'       


function Layout() {
  const location = useLocation()
  const isPayment = location.pathname === '/payment'

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />

      {!isPayment && <Navbar />}

      <main className="flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/fish" element={<FishPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/checkoutpage" element={<CheckoutPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<About />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </main>

      {!isPayment && <Footer />}
    </div>
  )
}

export default function App() {
  return <Layout />
}
