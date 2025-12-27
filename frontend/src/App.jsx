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
import CrabsPage from './pages/CrabsPage.jsx'
import PrawnsPage from './pages/PrawnsPage.jsx'
import LobstersPage from './pages/LobstersPage.jsx'
import CuttleFishPage from './pages/CuttleFishPage.jsx'
import DriedFishPage from './pages/DriedFishPage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import TermsAndConditions from './pages/TermsAndConditions.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import About from './pages/About.jsx'
import Feedback from './pages/FeedbackForm.jsx'       
import Hotline from './pages/Hotline.jsx'
import DeliveryLocation from "./pages/DeliveryLocation.jsx"



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
          <Route path="/crabs" element={<CrabsPage />} />
          <Route path="/prawns" element={<PrawnsPage />} />
          <Route path="/lobsters" element={<LobstersPage />} />
          <Route path="/cuttlefish" element={<CuttleFishPage />} />
          <Route path="/driedfish" element={<DriedFishPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/checkoutpage" element={<CheckoutPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<About />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/hotline" element={<Hotline />} />
          <Route path="/delivery-location" element={<DeliveryLocation />} />
        </Routes>
      </main>

      {!isPayment && <Footer />}
    </div>
  )
}

export default function App() {
  return <Layout />
}
