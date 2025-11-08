/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CallerModal from "@/components/CallerModal";
import {
  ModalCall,
  ModalCallConfirm,
  ModalFoodDetail,
} from "@/components/dialog";
import { SocketContext } from "@/components/SocketContext";
import { useWebSocket } from "@/components/WebSocketContext";
import { cn } from "clsx-for-tailwind";
import { UtensilsCrossed } from "lucide-react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { CartProvider } from "../context/CartContext";
import axiosInstance from "../lib/axios";
import { type CategoryItemType, CategoryItem } from "./dashboard/category-item";
import { DashboardHeader } from "./dashboard/dashboard-header";
import { DashboardLeftSidebar } from "./dashboard/dashboard-left-sidebar";
import { FoodItemTypes, FoodItems } from "./dashboard/food-items";
// import Pagination from "./order/items-pagination";

const LayoutDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [categories, setCategories] = useState<CategoryItemType[]>([]);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isCallConfirmOpen, setCallConfirmOpen] = useState(false);
  const [isCallOpen, setCallOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);

  const socketContext = useContext(SocketContext) as any;
  const NewUpdate = useMemo(
    () => socketContext?.response ?? {},
    [socketContext?.response]
  );

  // Access WebSocket context to use setNewMessageFlag
  const { setNewMessageFlag } = useWebSocket();

  // Check localStorage for newMessage flag when component mounts
  useEffect(() => {
    const newMessage = localStorage.getItem("newMessage");
    setHasNewMessage(newMessage === "true"); // Show the green dot if newMessage is "true"
  }, []); // Run only once when component mounts

  // Listen for changes to the newMessage flag in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newMessage = localStorage.getItem("newMessage");
      setHasNewMessage(newMessage === "true");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleMessageClick = () => {
    // When clicked, clear the newMessage flag from localStorage
    localStorage.setItem("newMessage", "false");
    setHasNewMessage(false); // Immediately update the state to hide the green dot
    setNewMessageFlag(false); // Update the global WebSocket context as well
  };

  const [items, setItems] = useState<FoodItemTypes[]>([]);
  const [search, setSearch] = useState("");
  const searchTimeout = useRef<any>(null);
  const [tableName, setTableName] = useState("");
  console.log(items);
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/customer/categories/");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };
  useEffect(() => {
    if (
      NewUpdate.type === "category_created" ||
      NewUpdate.type === "category_updated" ||
      NewUpdate.type === "category_deleted"
    ) {
      fetchCategories();
    }
    fetchCategories();
  }, [NewUpdate]);

  const fetchItems = async () => {
    try {
      let url = "/customer/items/";
      const params = [];
      if (selectedCategory !== null && categories[selectedCategory]) {
        params.push(`category=${categories[selectedCategory].id}`);
      }
      if (search) {
        params.push(`search=${encodeURIComponent(search)}`);
      }
      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }
      const response = await axiosInstance.get(url);
      console.log(response)
      setItems(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch items", error);
    }
  };
  useEffect(() => {
    // Debounced search effect
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(
      () => {
        fetchItems();
      },
      search ? 400 : 0
    ); // Only debounce when searching

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search, selectedCategory]); // Remove 'categories' and 'NewUpdate' from here

  // Separate effect for real-time updates
  useEffect(() => {
    if (
      NewUpdate.type === "item_created" ||
      NewUpdate.type === "item_updated" ||
      NewUpdate.type === "item_deleted"
    ) {
      fetchItems();
    }
  }, [NewUpdate]);
  // const handleCategorySelect = useCallback((ind: number | null) => {
  //   setSelectedCategory(ind);
  // }, []);
  useEffect(() => {
    // Log userInfo from localStorage
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setTableName(JSON.parse(userInfo)?.user?.restaurants[0]?.table_name);
    }
  }, []);

  const showFood = (id: number) => {
    setSelectedItemId(id);
    setDetailOpen(true);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    // Optional: redirect to home or login
    navigate("/");
  };

  ////////////////////// caller api /////////////////////////////////////////

  const [newsocket, setNewSocket] = useState<WebSocket | null>(null);
  const [response, setResponse] = useState<any>(null);
  const jwt = localStorage.getItem("accessToken");
  const [idCallingModal, setIsCallingModal] = useState(false);
  const userInfo = localStorage.getItem("userInfo");

  useEffect(() => {
    if (!jwt || !userInfo) {
      return;
    }
    const newSoket = new WebSocket(
      `wss://api.cleverbiz.ai//ws/call/${
        JSON.parse(userInfo as string).user?.restaurants[0].device_id
      }/?token=${jwt}`
    );
    newSoket.onopen = () => {
      console.log("Socket Opened");
    };
    newSoket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setResponse(data);

      if (data.action === "incoming_call") {
        setIsCallingModal(true);
      }
      if (data.action === "call_ended") {
        setIsCallingModal(false);
      }
      if (data.action === "call_accepted") {
        window.location.href = `https://clever-biz.vercel.app?device=${encodeURIComponent(
          data?.device_id
        )}&user=${encodeURIComponent(
          userInfo ? JSON.parse(userInfo).user?.restaurants[0]?.table_name : ""
        )}&deviceId=${encodeURIComponent("A1")}&receiver=${encodeURIComponent(
          "Hyatt Benjamin"
        )}&token=${encodeURIComponent(jwt)}`;
      }
      if (data.action === "call_accepted") {
        setTimeout(() => {
          const data = {
            action: "end_call",
            call_id: response?.call_id,
            device_id: response?.device_id,
          };
          newSoket.send(JSON.stringify(data));
        }, 5000);
      }
    };

    newSoket.onclose = () => {
      console.log("Socket Closed");
    };

    newSoket.onerror = () => {
      console.log("Socket Error");
    };

    setNewSocket(newSoket);

    return () => {
      newSoket.close();
    };
  }, [jwt, userInfo]);

  const handleEndCall = (callerId: string, deviceId: string) => {
    const data = {
      action: "end_call",
      call_id: callerId,
      device_id: deviceId,
    };
    newsocket!.send(JSON.stringify(data));
    setIsCallingModal(false);
  };

  const handleAnswerCall = (callerId: string, deviceId: string) => {
    const data = {
      action: "accept_call",
      call_id: callerId,
      device_id: deviceId,
    };
    newsocket!.send(JSON.stringify(data));
    setIsCallingModal(false);
  };

  const confirmToCall = (receiver_id: any) => {
    const data = {
      action: "start_call",
      receiver_id: receiver_id,
      device_id: userInfo
        ? JSON.parse(userInfo).user?.restaurants[0]?.device_id
        : undefined,
    };
    newsocket!.send(JSON.stringify(data));
    setIsCallingModal(true);
  };

  return (
    <CartProvider>
      <DashboardLeftSidebar
        confirmToCall={confirmToCall}
        userInfo={userInfo}
        handleMessageClick={handleMessageClick}
        hasNewMessage={hasNewMessage}
        handleLogout={handleLogout}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="h-full w-full overflow-y-auto ">
        {/* Left Sidebar  */}
        {/* Header */}
        <DashboardHeader
          tableName={tableName}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          search={search}
          setSearch={setSearch}
        />

        {/* Food item content */}
        <main className="flex flex-row mt-28 ">
          <div className="basis-[10%]">{/* VOID */}</div>
          {/* Main Content section */}
          <div className="basis-[90%] lg:basis-[60%] flex flex-col overflow-x-hidden">
            <h2 className="text-xl font-medium text-icon-active text-start">
              Choose Category
            </h2>
            {/* Horizontal scrollable category list */}
            <div className="w-full flex flex- flex-row gap-4 overflow-x-auto flex-wrap  py-4 scrollbar-hide">
              <div
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "flex-shrink-0 truncate h-40 w-38 bg-sidebar flex flex-col gap-y-4 items-center justify-center rounded-lg shadow-sm py-4 last:mr-4 select-none cursor-pointer border",
                  {
                    "bg-[#F1F5FF] border-[#ABC1FF]": selectedCategory === null,
                    "border-transparent": selectedCategory !== null,
                  }
                )}
              >
                <div className="h-16 w-16 rounded-xl overflow-hidden flex items-center justify-center bg-gray-100">
                  {/* Food icon SVG */}
                  <UtensilsCrossed />
                </div>
                <p className="text-primary font-medium">All Category</p>
              </div>
              {categories?.map((cat, i) => (
                <CategoryItem
                  cat={cat}
                  key={cat?.id}
                  i={i}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              ))}
            </div>
            <h2 className="text-xl font-medium text-icon-active text-start mt-4">
              Choose Your Items
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 me-4 py-4">
              {items?.map((item) => (
                <FoodItems key={item.id} item={item} showFood={showFood} />
              ))}
            </div>
          </div>
        </main>
        <div className="fixed top-0 right-0 w-[30%] h-full rounded-l-xl bg-sidebar shadow-md p-4 z-20 hidden lg:block">
          <Outlet />
        </div>
      </div>

      {/* Detail modal */}
      <ModalFoodDetail
        isOpen={isDetailOpen}
        close={() => setDetailOpen(false)}
        itemId={selectedItemId ?? undefined}
      />
      {/* Call modal */}
      <ModalCallConfirm
        isOpen={isCallConfirmOpen}
        close={() => {
          setCallConfirmOpen(false);
        }}
        confirm={() => {
          setCallConfirmOpen(false);
          setCallOpen(true);
        }}
      />
      {idCallingModal && (
        <CallerModal
          email={JSON.parse(userInfo as string).user.username}
          handleEndCall={handleEndCall}
          handleAnswerCall={handleAnswerCall}
          response={response}
        />
      )}
      {/* Call modal */}
      <ModalCall
        isOpen={isCallOpen}
        close={() => {
          setCallOpen(false);
        }}
      />
    </CartProvider>
  );
};

export default LayoutDashboard;
