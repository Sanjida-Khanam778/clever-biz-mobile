import { useEffect, useState } from "react";
import veg from "../assets/veg.png";
import axiosInstance from "../lib/axios";
import CheckoutButton from "./CheckoutButton";
import ReviewModal from "../components/ReviewModal";

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
  }, []);

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
      <div className="flex flex-col bg-white rounded-xl shadow-sm mb-8 border border-gray-100 overflow-hidden">
        {/* Main Content Container */}
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Left Section: Image and Item Info */}
            <div className="flex gap-3 sm:gap-4 flex-1">
              {/* Food Image */}
              <div className="flex-shrink-0">
                <img
                  src={veg}
                  alt="Food"
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-lg shadow-sm"
                />
              </div>

              {/* Order Details */}
              <div className="flex-1 min-w-0 md:flex-row">
                {" "}
                {/* min-w-0 prevents text overflow */}
                <h2 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl truncate">
                  {items[0]?.item_name || `Order #${order.id}`}
                </h2>
                {/* Price and Date Row */}
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2 mt-1">
                  <p className="text-gray-700 font-medium text-sm sm:text-base">
                    Total: {formatMoney(order.total_price)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 xs:text-right">
                    {new Date(order.created_time).toLocaleString()}
                  </p>
                </div>
                {/* Items List */}
                {items.length > 0 ? (
                  <div className="mt-3 space-y-1.5">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
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
            <div className="flex flex-row lg:flex-col gap-2 sm:gap-3 lg:w-auto lg:min-w-[140px] lg:justify-start">
              <div className="flex-1 lg:flex-none">
                <CheckoutButton orderId={order.id} />
              </div>
              <div className="flex-1 lg:flex-none">
                <button
                  onClick={handleReview}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-green-600 text-white text-sm sm:text-base font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
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

// Main ProgressBar Component
// import { useEffect, useState } from "react";
// import { useEffect, useState } from "react";

type ProgressBarProps = {
  status: string;
  orderId: string;
};

const ProgressBar = ({ status, orderId }: ProgressBarProps) => {
  const [currentStatus, setCurrentStatus] = useState(status.toLowerCase());

  const statusOrder = [
    "pending",
    "accepted",
    "preparing",
    "prepared",
    "served",
    "completed",
  ];

  const steps = [
    { key: "accepted", label: "Accepted" },
    { key: "preparing", label: "Preparing" },
    { key: "served", label: "Served" },
    { key: "completed", label: "Completed" },
  ];

  const currentIndex = Math.max(0, statusOrder.indexOf(currentStatus));
  const progressPercentage = (currentIndex / (statusOrder.length - 1)) * 100;

  useEffect(() => {
    setCurrentStatus(status.toLowerCase());

    // 🔹 Create a WebSocket connection per order
    const ws = new WebSocket(`wss://abc.winaclaim.com/ws/order/${orderId}/`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status) {
          setCurrentStatus(data.status.toLowerCase());
        }
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => {
      ws.close();
    };
  }, [orderId, status]);

  return (
    <div className="w-full">
      {/* Title + Status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-800">
          Order Progress
        </span>
        <span className="text-xs sm:text-sm capitalize bg-gray-100 px-2 py-1 rounded-full text-gray-600">
          {currentStatus}
        </span>
      </div>

      {/* Smooth Horizontal Progress */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Milestone Steps */}
      <div className="flex justify-between relative">
        {steps.map((step, idx) => {
          const isCompleted = statusOrder.indexOf(step.key) <= currentIndex;
          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-500 text-white shadow-md scale-110"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>
              <span
                className={`mt-2 text-[11px] sm:text-xs font-medium ${
                  isCompleted ? "text-green-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// export default ProgressBar;

// export default ProgressBar;

export default ScreenOrders;
