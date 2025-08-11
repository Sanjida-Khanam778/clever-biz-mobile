import { useEffect, useState } from "react";
import veg from "../assets/veg.png";
import axiosInstance from "../lib/axios";
import CheckoutButton from "./CheckoutButton";

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
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-sm mb-4">
      <div className="flex items-start w-full gap-4">
        <img
          src={veg}
          alt="Food"
          className="w-16 h-16 object-cover rounded-md"
        />

        <div className="flex-1">
          <h2 className="font-semibold text-gray-800">
            {items[0]?.item_name || `Order #${order.id}`}
          </h2>
          <p className="text-gray-600">
            Total: {formatMoney(order.total_price)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(order.created_time).toLocaleString()}
          </p>

          {/* Full line item list */}
          {items.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {items.map((it, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  <span className="font-medium">{it.item_name}</span>{" "}
                  <span className="text-gray-500">× {it.quantity}</span>{" "}
                  <span className="text-gray-600">
                    — {formatMoney(it.price)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-400">
              No items in this order.
            </p>
          )}
        </div>

        {/* Pay now */}
        <div className="shrink-0 self-start">
          <CheckoutButton orderId={order.id} />
        </div>
      </div>

      <ProgressBar status={order.status} />
    </div>
  );
};

const ProgressBar = ({ status }: { status: string }) => {
  const statusOrder = [
    "pending",
    "accepted",
    "preparing",
    "prepared",
    "served",
    "completed",
  ];
  const currentIndex = Math.max(0, statusOrder.indexOf(status?.toLowerCase()));
  const getStepStatus = (step: string) => {
    const stepIndex = statusOrder.indexOf(step);
    if (status?.toLowerCase() === "pending" && step === "accepted")
      return "completed";
    return stepIndex <= currentIndex ? "completed" : "pending";
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
        {steps.map((step) => {
          const stepStatus = getStepStatus(step.key);
          return (
            <div
              key={step.key}
              className={`flex-1 border-t-2 ${
                stepStatus === "completed"
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ScreenOrders;
