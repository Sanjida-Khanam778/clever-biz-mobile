import { Route, Routes } from "react-router";
import LayoutDashboard from "./pages/layout_dashboard";
import ScreenHome from "./pages/screen_home";
import ScreenMessage from "./pages/screen_message";
import ScreenLogin from "./pages/screen_login";
import ScreenOrders from "./pages/screen_orders";
import ScreenCart from "./pages/screen_cart";
// import CheckoutButton from "./pages/CheckoutButton";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ScreenLogin />} />
      <Route path="/dashboard" element={<LayoutDashboard />}>
        {/* <Route index={true} element={<ScreenLogin />} /> */}
        <Route index={true} element={<ScreenHome />} />
        <Route path="message" element={<ScreenMessage />} />
        <Route path="cart" element={<ScreenCart />} />
        <Route path="orders" element={<ScreenOrders />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="cancel" element={<CancelPage />} />
      </Route>
    </Routes>
  );
}

export default App;
