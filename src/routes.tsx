import { Route, Routes } from "react-router";
import LayoutDashboard from "./pages/layout_dashboard";
import ScreenHome from "./pages/screen_home";
import ScreenMessage from "./pages/screen_message";
import ScreenLogin from "./pages/screen_login";
import ScreenOrders from "./pages/screen_orders";
import ScreenCart from "./pages/screen_cart";

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
      </Route>
    </Routes>
  );
}

export default App;
