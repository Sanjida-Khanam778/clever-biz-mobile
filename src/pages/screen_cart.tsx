import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";

const ScreenCart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

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
      <div className="w-full text-primary/60 mt-4">
        <div className="w-full h-full flex flex-col gap-y-2 rounded-lg shadow-md bg-[#F6F9FF] p-4 text-primary">
          <p className="text-primary/60 mt-4 text-sm font-medium text-center">
            Total Quantity:
            <span className="ms-1 border border-[#CFCFCF] px-2 py-1 rounded-md">
              {totalQuantity}
            </span>
            <span className="ms-1">{"  "}</span>
            Total Cost:
            <span className="ms-1 border border-[#CFCFCF] px-2 py-1 rounded-md">
              ${totalCost}
            </span>
          </p>
          <button
            className="mt-4 button-primary"
            onClick={() => navigate("/dashboard/orders")}
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
