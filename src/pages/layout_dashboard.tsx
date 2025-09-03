/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  IconCall,
  IconCart,
  IconHome,
  IconLogout,
  IconMessage,
  IconOrders,
  Logo,
} from "../components/icons";
import { cn } from "clsx-for-tailwind";
import { useState, useEffect, useRef } from "react";
import { SearchBox } from "../components/input";
import {
  ModalCall,
  ModalCallConfirm,
  ModalFoodDetail,
} from "../components/dialog";
import axiosInstance from "../lib/axios";
import { CartProvider } from "../context/CartContext";
import { UtensilsCrossed } from "lucide-react";
import CallerModal from "../components/CallerModal";

const LayoutDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  type Category = {
    id: number;
    Category_name: string;
    slug: string;
    image: string;
  };
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isCallConfirmOpen, setCallConfirmOpen] = useState(false);
  const [isCallOpen, setCallOpen] = useState(false);
  type Item = {
    id: number;
    item_name: string;
    price: string;
    description: string;
    slug: string;
    category: number;
    restaurant: number;
    category_name: string;
    image1: string;
    availability: boolean;
    video: string;
    restaurant_name: string;
  };
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const searchTimeout = useRef<any>(null);
  const [tableName, setTableName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/customer/categories/");
        setCategories(response.data.results || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
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
        setItems(response.data.results || []);
      } catch (error) {
        console.error("Failed to fetch items", error);
      }
    };
    fetchItems();
    // Debounced search effect
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchItems();
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search, selectedCategory, categories]);

  useEffect(() => {
    // Log userInfo from localStorage
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setTableName(JSON.parse(userInfo).user.restaurants[0].table_name);
      console.log(JSON.parse(userInfo).user);
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
      `wss://abc.winaclaim.com/ws/call/${
        JSON.parse(userInfo as string).user.restaurants[0].device_id
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
      if (data.action === "call_accepted") {
        window.location.href = `https://clever-biz.vercel.app?device=${encodeURIComponent(
          data?.device_id
        )}&user=${encodeURIComponent(
          userInfo ? JSON.parse(userInfo).user?.restaurants[0]?.table_name : ""
        )}&deviceId=${encodeURIComponent("A1")}&receiver=${encodeURIComponent(
          "Hyatt Benjamin"
        )}&token=${encodeURIComponent(jwt)}`;
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
  };

  return (
    <CartProvider>
      <div className="h-full w-full overflow-y-auto">
        {/* Left Sidebar  */}
        <nav className="fixed top-1/2 transform -translate-y-1/2 left-0 w-22 bg-sidebar rounded-r-xl shadow-lg flex flex-col items-center justify-center gap-y-4 py-4 text-xs font-light">
          {/* Home */}
          <NavLink
            to="/dashboard"
            type="button"
            end
            className={({ isActive }) =>
              cn("w-16 h-16 flex flex-col items-center justify-center", {
                "bg-icon-active-bg rounded-full fill-icon-active": isActive,
              })
            }
          >
            {({ isActive }) => (
              <>
                <IconHome
                  selected={isActive}
                  activeColor="#3E4F7E"
                  inActiveColor="#B2B5BE"
                />
                <p
                  className={cn("text-icon-inactive", {
                    "text-icon-active": isActive,
                  })}
                >
                  Home
                </p>
              </>
            )}
          </NavLink>
          {/* Call */}
          <button
            type="button"
            onClick={() =>
              confirmToCall(JSON.parse(userInfo as string).user.owner_id)
            }
            className={cn(
              "w-16 h-16 flex flex-col items-center justify-center",
              {
                "bg-icon-active-bg rounded-full": false,
              }
            )}
          >
            <IconCall
              selected={false}
              activeColor="#3E4F7E"
              inActiveColor="#B2B5BE"
            />
            <p
              className={cn("text-icon-inactive", {
                "text-icon-active": false,
              })}
            >
              Call
            </p>
          </button>
          {/* Message */}
          <NavLink
            to="/dashboard/message"
            className={({ isActive }) =>
              cn("w-16 h-16 flex flex-col items-center justify-center", {
                "bg-icon-active-bg rounded-full": isActive,
              })
            }
          >
            {({ isActive }) => (
              <>
                <IconMessage
                  selected={isActive}
                  activeColor="#3E4F7E"
                  inActiveColor="#B2B5BE"
                />
                <p
                  className={cn("text-icon-inactive", {
                    "text-icon-active": isActive,
                  })}
                >
                  Message
                </p>
              </>
            )}
          </NavLink>

          {/* Cart */}
          <NavLink
            to="/dashboard/cart"
            className={({ isActive }) =>
              cn("w-16 h-16 flex flex-col items-center justify-center", {
                "bg-icon-active-bg rounded-full": isActive,
              })
            }
          >
            {({ isActive }) => (
              <>
                <IconCart
                  selected={isActive}
                  activeColor="#3E4F7E"
                  inActiveColor="#B2B5BE"
                />
                <p
                  className={cn("text-icon-inactive", {
                    "text-icon-active": isActive,
                  })}
                >
                  Cart
                </p>
              </>
            )}
          </NavLink>
          {/* Orders */}
          <NavLink
            to="/dashboard/orders"
            className={cn(
              "w-16 h-16 flex flex-col items-center justify-center",
              {
                "bg-icon-active-bg rounded-full": false,
              }
            )}
          >
            {({ isActive }) => (
              <>
                <IconOrders
                  selected={isActive}
                  activeColor="#3E4F7E"
                  inActiveColor="#B2B5BE"
                />
                <p
                  className={cn("text-icon-inactive", {
                    "text-icon-active": false,
                  })}
                >
                  Orders
                </p>
              </>
            )}
          </NavLink>
          {/* Logout */}
          <button
            type="button"
            className={cn(
              "w-16 h-16 flex flex-col items-center justify-center",
              {
                "bg-icon-active-bg rounded-full": false,
              }
            )}
            onClick={handleLogout}
          >
            <IconLogout
              selected={false}
              activeColor="#3E4F7E"
              inActiveColor="#B2B5BE"
            />
            <p
              className={cn("text-icon-inactive", {
                "text-icon-active": false,
              })}
            >
              Logout
            </p>
          </button>
        </nav>
        {/* Header */}
        <header className="bg-background fixed right-0 top-0 left-0 me-[30%] h-24 flex items-center justify-between px-8 gap-x-16 z-10">
          <div>
            <Logo />
          </div>
          <div className="flex-1">
            <SearchBox
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 bg-accent/5 rounded-full flex justify-center items-center">
              <h2 className="font-bold text-lg text-accent">{tableName}</h2>
            </div>
            <h6 className="text-xs uppercase font-medium text-icon-active">
              Table No
            </h6>
          </div>
        </header>
        {/* Food item content */}
        <main className="flex flex-row mt-28">
          <div className="basis-[10%]">{/* VOID */}</div>
          {/* Main Content section */}
          <div className="basis-[60%] flex flex-col overflow-x-hidden">
            <h2 className="text-xl font-medium text-icon-active text-start">
              Choose Category
            </h2>
            {/* Horizontal scrollable category list */}
            <div className="w-full flex flex- flex-row gap-4 overflow-x-auto flex-wrap  py-4 scrollbar-hide">
              <div
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "flex-shrink-0 h-40 w-38 bg-sidebar flex flex-col gap-y-4 items-center justify-center rounded-lg shadow-sm py-4 last:mr-4 select-none cursor-pointer border",
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
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(i)}
                  className={cn(
                    "flex-shrink-0 h-40 w-38 bg-sidebar flex flex-col gap-y-4 items-center justify-center rounded-lg shadow-sm py-4 last:mr-4 select-none cursor-pointer",
                    {
                      "bg-[#F1F5FF] border border-[#ABC1FF]":
                        selectedCategory === i,
                    }
                  )}
                >
                  <div className="h-16 w-16 rounded-xl overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.Category_name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-primary font-medium">
                    {cat.Category_name}
                  </p>
                </div>
              ))}
            </div>
            <h2 className="text-xl font-medium text-icon-active text-start mt-4">
              Choose Your Items
            </h2>

            {/* Food Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 me-4 py-4">
              {items?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => showFood(item.id)}
                  className={cn(
                    "aspect-[1/1.2] bg-sidebar flex flex-col gap-y-2 items-stretch justify-center rounded-lg shadow-sm p-4 select-none cursor-pointer"
                  )}
                >
                  <div className="aspect-square rounded-xl overflow-hidden flex justify-center items-center object-contain">
                    <img
                      src={item.image1}
                      alt={item.item_name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-icon-active/80 text-wrap font-medium">
                    {item.item_name}
                  </p>
                  <p className="text-icon-active text-wrap text-start font-bold text-2xl">
                    {`$${item.price}`}
                    <span className="text-sm font-normal">
                      / {item.category_name}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
        <div className="fixed top-0 right-0 w-[30%] h-full rounded-l-xl bg-sidebar shadow-md p-4 z-20">
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
