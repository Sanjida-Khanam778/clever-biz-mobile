import { Route, Routes } from "react-router";
import { PrivateRouteGuard, PublicRouteGuard } from "./components/route-guard";
import CancelPage from "./pages/CancelPage";
import CheckoutPage from "./pages/CheckoutPage";
import LayoutDashboard from "./pages/layout_dashboard";
import ScreenCart from "./pages/screen_cart";
import ScreenHome from "./pages/screen_home";
import ScreenLogin from "./pages/screen_login";
import ScreenMessage from "./pages/screen_message";
import ScreenOrders from "./pages/screen_orders";
import SuccessPage from "./pages/SuccessPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRouteGuard>
            <ScreenLogin />
          </PublicRouteGuard>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRouteGuard>
            <LayoutDashboard />
          </PrivateRouteGuard>
        }
      >
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
