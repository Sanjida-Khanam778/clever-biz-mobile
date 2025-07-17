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
import { useState } from "react";
import veg from "../assets/veg.png";
import food from "../assets/food.webp";
import { SearchBox } from "../components/input";
import {
  ModalCall,
  ModalCallConfirm,
  ModalFoodDetail,
} from "../components/dialog";

const LayoutDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [isCallConfirmOpen, setCallConfirmOpen] = useState(false);
  const [isCallOpen, setCallOpen] = useState(false);

  const showFood = (_id: number) => {
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
  return (
    <>
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
            onClick={() => setCallConfirmOpen(true)}
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
            <SearchBox />
          </div>
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 bg-accent/5 rounded-full flex justify-center items-center">
              <h2 className="font-bold text-lg text-accent">2B</h2>
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
            <div className="w-full flex flex- flex-row gap-x-4 overflow-x-auto py-4 scrollbar-hide">
              {[...Array(10)].map((_value, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedCategory(i)}
                    className={cn(
                      "flex-shrink-0 h-40 w-38 bg-sidebar flex flex-col gap-y-4 items-center justify-center rounded-lg shadow-sm py-4 last:mr-4 select-none cursor-pointer",
                      {
                        "bg-[#F1F5FF] border border-[#ABC1FF]":
                          selectedCategory == i,
                      }
                    )}
                  >
                    <div className="h-16 w-16 rounded-xl overflow-hidden">
                      <img src={veg} alt="img" />
                    </div>
                    <p className="text-primary font-medium">{"Fast food"}</p>
                  </div>
                );
              })}
            </div>
            <h2 className="text-xl font-medium text-icon-active text-start mt-4">
              Choose Your Items
            </h2>
            {/* Food Items */}
            <div className="grid grid-cols-3 xl:grid-cols-4 gap-5 me-4 py-4">
              {[...Array(20)].map((value, i) => (
                <div
                  key={i}
                  onClick={() => showFood(value)}
                  className={cn(
                    "aspect-[1/1.2] bg-sidebar flex flex-col gap-y-2 items-stretch justify-center rounded-lg shadow-sm pb-4 pt-0 px-4 select-none cursor-pointer"
                  )}
                >
                  <div className="aspect-square rounded-xl overflow-hidden flex justify-center items-center object-contain">
                    <img src={food} alt="img" />
                  </div>
                  <p className="text-icon-active/80 text-wrap font-medium">
                    {"Thai Chicken Role"}
                  </p>
                  <p className="text-icon-active text-wrap text-start font-bold text-2xl">
                    {"$75"}
                    <span className="text-sm font-normal">/slice</span>
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
      {/* Call modal */}
      <ModalCall
        isOpen={isCallOpen}
        close={() => {
          setCallOpen(false);
        }}
      />
    </>
  );
};

export default LayoutDashboard;
