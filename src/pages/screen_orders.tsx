import { useState } from "react";
import veg from "../assets/veg.png";

const ScreenOrders = () => {
  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-medium">Order List</h1>
      </div>
      <OrderItem />
    </div>
  );
};
const OrderItem = () => {
  const [quantity] = useState(4);

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center">
        {/* Image */}
        <img
          src={veg} // You can replace with your own image
          alt="Pizza"
          className="w-16 h-16 object-cover rounded-md"
        />

        {/* Text & Price */}
        <div className="ml-4 flex-1">
          <h2 className="font-semibold text-gray-800">
            Four-Cheese Margherita Pizza with Sun-Dried Tomatoes
          </h2>
          <p className="text-gray-600">${169.43}</p>

          {/* Quantity Controller */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold">Quantity: {quantity}</span>
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
      <ProgressBar />
    </div>
  );
};

const ProgressBar = () => {
  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between w-full">
        {/* Step 1 */}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <svg
              className="w-4 h-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-blue-500">Accepted</p>
        </div>
        {/* Step 2 */}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-white">
            <svg
              className="w-4 h-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p>Preparing</p>
        </div>
        {/* Step 3 */}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-white">
            <svg
              className="w-4 h-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p>Prepared</p>
        </div>
      </div>

      {/* Progress Line */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex-1 border-t-2 border-blue-500"></div>
        <div className="flex-1 border-t-2 border-gray-300"></div>
        <div className="flex-1 border-t-2 border-gray-300"></div>
      </div>
    </div>
  );
};
export default ScreenOrders;
