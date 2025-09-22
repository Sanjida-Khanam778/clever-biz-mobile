import { useEffect, useState } from "react";
import veg from "../assets/veg.png";
import axiosInstance from "../lib/axios";
import CheckoutButton from "./CheckoutButton";
import ReviewModal from "../components/ReviewModal";
// import { CheckCircle, Clock, Utensils, Package } from "lucide-react";
// import { CheckCircle, Clock, Utensils, Package } from "lucide-react";
type OrderItem = {
  item_name: string;
  quantity: number;
  price: string | number;
};

type Order = {
  id: number;
  order_items?: OrderItem[];
  items?: OrderItem[]; // fallback key
  status: string;
  total_price: string | number;
  created_time: string;
  updated_time: string;
  device: number;
  restaurant: number;
  device_name: string;
  stripe_publishable_key: string;
};

const ScreenOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken");
  const userInfo = localStorage.getItem("userInfo");
  const device_id = userInfo
    ? JSON.parse(userInfo).user.restaurants[0].device_id
    : null;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setErr(null);
        // Try without the search filter if unsure it’s correct:
        const res = await axiosInstance.get("/customer/uncomplete/orders/");
        const d = res?.data;

        // Handle multiple response shapes: array vs paginated object
        const list: Order[] = Array.isArray(d)
          ? d
          : d?.results ?? d?.orders ?? [];

        setOrders(Array.isArray(list) ? list : []);
      } catch (e: any) {
        console.error("Failed to fetch orders:", e);
        setErr(
          e?.response?.data?.detail || e?.message || "Failed to fetch orders."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    if (!accessToken) {
      return;
    }
    const newSoket = new WebSocket(
      `wss://abc.winaclaim.com/ws/order/${device_id}/?token=${accessToken}`
    );

    newSoket.onopen = () => {
      console.log("WebSocket connection established");
    };

    newSoket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);
      fetchOrders();
    };
    newSoket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      newSoket.close();
    };
  }, [device_id, accessToken]);

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-medium">Order List</h1>
      </div>

      {loading && <p className="text-gray-500">Loading orders…</p>}

      {err && !loading && <p className="text-red-600">{err}</p>}

      {!loading && !err && (
        <div className="flex flex-col max-h-[90vh] overflow-y-auto scrollbar-hide">
          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            orders.map((order) => <OrderRow key={order.id} order={order} />)
          )}
        </div>
      )}
    </div>
  );
};

const OrderRow = ({ order }: { order: Order }) => {
  // Support both order_items and items
  const items: OrderItem[] = order.order_items ?? order.items ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleReview = () => {
    setIsModalOpen(true); // Open the modal when "Review" button is clicked
  };

  const formatMoney = (v: string | number) => {
    const n = typeof v === "string" ? parseFloat(v) : v;
    if (Number.isFinite(n)) {
      try {
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: "USD", // or use your currency
        }).format(n);
      } catch {
        return `$${n}`;
      }
    }
    return v ?? "—";
  };

  return (
    <>
      <style>{`
  .custom-scroll::-webkit-scrollbar {
    width: 8px; /* Increase width for better visibility */
  }
  .custom-scroll::-webkit-scrollbar-track {
    background: #f0f0f0; /* Light gray background for the track */
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background: #ffffff; /* White color for the thumb */
    border-radius: 4px; /* Slightly rounded corners for the thumb */
    border: 2px solid #e0e0e0; /* Light border to make the thumb visible */
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background: #e0e0e0; /* Lighter gray thumb on hover for visibility */
  }
`}</style>

      <div className="flex flex-col bg-white rounded-xl shadow-sm mb-8 border border-gray-100 custom-scroll min-h-96 overflow-auto">
        {/* Main Content Container */}
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex-row custom-scroll lg:flex-row gap-4 lg:gap-6">
            <div className=" flex flex-col md:flex-row gap-3 sm:gap-4 flex-1">
              {/* Image */}
              <div className="flex-shrink-0 flex justify-center items-center md:justify-center">
                <img
                  src={veg}
                  alt="Food"
                  className="w-20 h-20 sm:w-29 sm:h-16 md:w-16 md:h-16 object-cover rounded-lg shadow-sm"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                {/* Title */}
                <h2 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl truncate">
                  {items[0]?.item_name || `Order #${order.id}`}
                </h2>

                {/* Price and Date Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mt-1">
                  <p className="text-gray-700 font-medium text-sm sm:text-base">
                    Total: {formatMoney(order.total_price)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 sm:text-right">
                    {new Date(order.created_time).toLocaleString()}
                  </p>
                </div>

                {/* Items List */}
                {items.length > 0 ? (
                  <div className="mt-3 space-y-1.5">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                      Order Items:
                    </p>
                    <ul className="space-y-1">
                      {items.map((it, idx) => (
                        <li
                          key={idx}
                          className="text-xs sm:text-sm text-gray-700 flex flex-wrap gap-1"
                        >
                          <span className="font-medium text-gray-900">
                            {it.item_name}
                          </span>
                          <span className="text-gray-500">× {it.quantity}</span>
                          <span className="text-gray-600 ml-auto">
                            {formatMoney(it.price)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="mt-3 text-xs sm:text-sm text-gray-400 italic">
                    No items in this order.
                  </p>
                )}
              </div>
            </div>

            {/* Right Section: Action Buttons */}
            <div className="flex  gap-4 mt-3">
              {/* Checkout Button */}
              <div className="w-full md:w-2/3 mx-auto">
                <CheckoutButton orderId={order.id} />
              </div>

              {/* Review Button */}
              <div className="w-full md:w-2/3 mx-auto">
                <button
                  onClick={handleReview}
                  className="w-full px-4 py-2 rounded-md bg-sky-500 text-white hover:bg-green-700 disabled:opacity-60 transition-colors duration-300 ease-in-out"
                  aria-label="Write a review for this order"
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="border-t border-gray-100 bg-gray-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6">
          <ProgressBar status={order.status} />
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={order.id}
      />
    </>
  );
};

type ProgressBarProps = {
  status: string;
};

const ProgressBar = ({ status }: ProgressBarProps) => {
  const [currentStatus] = useState(status.toLowerCase());
  const [connectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");

  const statusOrder = ["pending", "preparing", "served"]; // Only these three statuses
  const steps = [
    { key: "pending", label: "Pending" },
    { key: "preparing", label: "Preparing" },
    { key: "served", label: "Served" },
  ];

  const currentIndex = Math.max(0, statusOrder.indexOf(currentStatus)); // Find the index of the current status
  const progressPercentage = (currentIndex / (statusOrder.length - 1)) * 100; // Calculate the progress percentage

  // Debugging: log current status and progress
  console.log("Current Status:", currentStatus);
  console.log("Current Index:", currentIndex);
  console.log("Progress Percentage:", progressPercentage);

  if (currentIndex === -1) {
    console.warn(`Status "${currentStatus}" not found in statusOrder array`);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-gray-800">
          Order Progress
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm capitalize bg-gray-100 px-2 py-1 rounded-full text-gray-600">
            {currentStatus}
          </span>
          {/* Connection status indicator */}
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              connectionStatus === "connected"
                ? "bg-green-500"
                : connectionStatus === "connecting"
                ? "bg-yellow-500 animate-pulse"
                : connectionStatus === "error"
                ? "bg-red-500"
                : "bg-gray-400"
            }`}
            title={`WebSocket ${connectionStatus}`}
          />
        </div>
      </div>

      {/* Smooth Horizontal Progress */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.max(0, Math.min(100, progressPercentage))}%`,
            minWidth: progressPercentage > 0 ? "2px" : "0px",
          }}
        />
      </div>

      {/* Milestone Steps */}
      <div className="flex justify-between relative">
        {steps.map((step) => {
          const stepIndex = statusOrder.indexOf(step.key);
          const isCompleted = stepIndex !== -1 && stepIndex <= currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-500 text-white shadow-md scale-110"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? "✓" : "•"}
              </div>
              <span
                className={`mt-2 text-[11px] sm:text-xs font-medium text-center max-w-[60px] ${
                  isCompleted ? "text-green-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Connection error message */}
      {connectionStatus === "error" && (
        <div className="mt-3 text-xs text-red-600 bg-red-50 px-2 py-1 rounded flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          Connection issue. Updates may be delayed.
        </div>
      )}

      {/* Connecting message */}
      {connectionStatus === "connecting" && (
        <div className="mt-3 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
          <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
          Connecting to live updates...
        </div>
      )}
    </div>
  );
};

export default ScreenOrders;
