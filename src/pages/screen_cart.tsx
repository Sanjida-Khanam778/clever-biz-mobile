import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const ScreenCart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCart();
  console.log(cart);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleOrderNow = async () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) {
        toast.error("User info not found");
        return;
      }

      const userData = JSON.parse(userInfo);
      const restaurant = userData.user.restaurants[0].id;
      const device = userData.user.restaurants[0].device_id;

      const orderItems = cart.map((item) => ({
        item: item.id,
        quantity: item.quantity,
      }));

      const orderData = {
        restaurant,
        device,
        order_items: orderItems,
      };
      console.log(orderData);

      await axiosInstance.post("/customer/orders/", orderData);
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/dashboard/orders");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="h-full p-4 flex flex-col items-center">
      <div>
        <h1 className="text-3xl font-medium">Cart List</h1>
      </div>
      <div className="flex-1 flex flex-col gap-y-2 mt-8 w-full max-w-2xl">
        {cart.length === 0 ? (
          <p className="text-center text-primary/60">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm"
            >
              {/* Image */}
              <img
                src={item.image1}
                alt={item.item_name}
                className="w-16 h-16 object-cover rounded-md"
              />
              {/* Text & Price */}
              <div className="ml-4 flex-1">
                <h2 className="text-primary">{item.item_name}</h2>
                <p className="text-primary/40">${item.price}</p>
                {/* Quantity Controller */}
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">
                    Quantity: {item.quantity}
                  </span>
                </div>
              </div>
              {/* Remove Button */}
              <button
                className="ml-4 text-gray-500 hover:text-gray-800"
                onClick={() => removeFromCart(item.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
      <div className="w-full mt-4">
        <div className="w-full flex flex-col gap-2 rounded-lg shadow-md bg-[#F6F9FF] p-4 text-primary">
          <div className="flex flex-wrap justify-center gap-3 text-sm font-medium">
            <span>
              Total Quantity:{" "}
              <span className="border px-2 py-1 rounded-md">
                {totalQuantity}
              </span>
            </span>
            <span>
              Total Cost:{" "}
              <span className="border px-2 py-1 rounded-md">${totalCost}</span>
            </span>
          </div>
          <button
            className="button-primary w-full"
            onClick={handleOrderNow}
            disabled={cart.length === 0}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreenCart;
