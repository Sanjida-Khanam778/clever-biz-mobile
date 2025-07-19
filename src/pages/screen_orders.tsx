import { useEffect, useState } from "react";
import veg from "../assets/veg.png";
import axiosInstance from "../lib/axios";

type OrderItem = {
  item_name: string;
  quantity: number;
  price: string;
};

type Order = {
  id: number;
  order_items: OrderItem[];
  status: string;
  total_price: string;
  created_time: string;
  updated_time: string;
  device: number;
  restaurant: number;
  device_name: string;
};

const ScreenOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  console.log(orders);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(
          "/customer/uncomplete/orders/?search=1"
        );
        setOrders(response.data.results || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-medium">Order List</h1>
      </div>
      <div className="flex flex-col max-h-[90vh] overflow-y-auto scrollbar-hide">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          orders.map((order) => <OrderItem key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
};
const OrderItem = ({ order }: { order: Order }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm mb-4">
      <div className="flex items-center w-full">
        {/* Image */}
        <img
          src={veg}
          alt="Food"
          className="w-16 h-16 object-cover rounded-md"
        />

        {/* Text & Price */}
        <div className="ml-4 flex-1">
          <h2 className="font-semibold text-gray-800">
            {order.order_items[0]?.item_name || "Order Item"}
          </h2>
          <p className="text-gray-600">${order.total_price}</p>

          {/* Quantity Controller */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold">
              Quantity: {order.order_items[0]?.quantity || 0}
            </span>
          </div>

          {/* Date and Time */}
          <p className="text-xs text-gray-500 mt-1">
            {new Date(order.created_time).toLocaleString()}
          </p>
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
      <ProgressBar status={order.status} />
    </div>
  );
};

const ProgressBar = ({ status }: { status: string }) => {
  const getStepStatus = (step: string) => {
    const statusOrder = [
      "pending",
      "accepted",
      "preparing",
      "prepared",
      "served",
      "completed",
    ];
    const currentIndex = statusOrder.indexOf(status?.toLowerCase()) || 0;
    const stepIndex = statusOrder.indexOf(step);

    // If status is pending, show accepted as completed by default
    if (status?.toLowerCase() === "pending" && step === "accepted") {
      return "completed";
    }
    if (stepIndex <= currentIndex) return "completed";
    return "pending";
  };

  const steps = [
    { key: "accepted", label: "Accepted" },
    { key: "preparing", label: "Preparing" },
    { key: "served", label: "Served" },
  ];

  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between w-full">
        {steps.map((step) => {
          const stepStatus = getStepStatus(step.key);
          return (
            <div key={step.key} className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  stepStatus === "completed" ? "bg-blue-500" : "bg-gray-300"
                } text-white`}
              >
                {stepStatus === "completed" && (
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
                )}
              </div>
              <p
                className={
                  stepStatus === "completed" ? "text-blue-500" : "text-gray-500"
                }
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-2">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.key);
          return (
            <div
              key={step.key}
              className={`flex-1 border-t-2 ${
                stepStatus === "completed"
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
            ></div>
          );
        })}
      </div>
    </div>
  );
};
export default ScreenOrders;
