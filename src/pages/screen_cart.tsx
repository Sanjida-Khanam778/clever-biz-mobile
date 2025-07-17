import { useState } from "react";
import veg from "../assets/food.webp";
import { useNavigate } from "react-router";

const ScreenCart = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full p-4 flex flex-col items-center">
      <div>
        <h1 className="text-3xl font-medium">Cart List</h1>
      </div>
      <div className="flex-1 flex flex-col gap-y-2 mt-8">
        <CartItem />
        <CartItem />
      </div>
      <div className="w-full text-primary/60 mt-4">
        <div className="w-full h-full flex flex-col gap-y-2 rounded-lg shadow-md bg-[#F6F9FF] p-4 text-primary">
          <p className="text-primary/60 mt-4 text-sm font-medium text-center">
            Total Quantity:
            <span className="ms-1 border border-[#CFCFCF] px-2 py-1 rounded-md">
              2
            </span>
            <span className="ms-1">{"  "}</span>
            Total Cost:
            <span className="ms-1 border border-[#CFCFCF] px-2 py-1 rounded-md">
              $30
            </span>
          </p>

          <button
            className="mt-4 button-primary"
            onClick={() => navigate("/dashboard/orders")}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

const CartItem = () => {
  const [quantity, setQuantity] = useState(4);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
      {/* Image */}
      <img
        src={veg} // You can replace with your own image
        alt="Pizza"
        className="w-16 h-16 object-cover rounded-md"
      />

      {/* Text & Price */}
      <div className="ml-4 flex-1">
        <h2 className="text-primary">
          Four-Cheese Margherita Pizza with Sun-Dried Tomatoes
        </h2>
        <p className="text-primary/40">${30}</p>

        {/* Quantity Controller */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecrease}
            className="h-9 w-9 p-2 bg-primary/10 rounded-full text-primary"
          >
            -
          </button>
          <span className="font-semibold">Quantity: {quantity}</span>
          <button
            onClick={handleIncrease}
            className="h-9 w-9 p-2 bg-primary/10 rounded-full text-primary"
          >
            +
          </button>
        </div>
      </div>

      {/* Close Button */}
      <button className="ml-4 text-gray-500 hover:text-gray-800">
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
  );
};
export default ScreenCart;
