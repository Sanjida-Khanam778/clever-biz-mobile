import { Circle, Lock, type LucideIcon } from "lucide-react";
import { Logo } from "../components/icons";
import { useNavigate } from "react-router";
import chef from "../assets/chef.png";
import { cn } from "clsx-for-tailwind";
import toast from "react-hot-toast";
import { useState } from "react";
import axiosInstance from "../lib/axios";
import { ImSpinner6 } from "react-icons/im";

const ScreenLogin = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const navigateToDashboard = () => {
    navigate("/dashboard");
  };
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/login/", {
        email: data.email,
        password: data.password,
      });

      console.log(response.data);

      // Use the hook to update user data

      setLoading(false);

      // Show success message with role info
      toast.success(`Welcome! You are logged in.`);
    } catch (error: any) {
      setLoading(false);
      console.error("Login failed:", error);
    }
  };
  return (
    <div className="h-full bg-background relative">
      {/* Bottom image and other */}
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-row">
        <div className="basis-[55%] login-bg h-full z-0 relative">
          <div className="absolute left-4 top-4">
            <img src={chef} alt="Chef" />
          </div>
          <div className="absolute bottom-4 w-full">
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 ">
              <p className="text-primary-text text-2xl text-center mb-4 font-medium">
                FOLLOW US ON
              </p>
              <div className="flex flex-row gap-x-8 items-center mb-8">
                <svg
                  width="46"
                  height="46"
                  viewBox="0 0 46 46"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23 0.589844C10.625 0.589844 0.5 10.6923 0.5 23.1348C0.5 34.3848 8.735 43.7223 19.49 45.4098V29.6598H13.775V23.1348H19.49V18.1623C19.49 12.5148 22.8425 9.40984 27.995 9.40984C30.4475 9.40984 33.0125 9.83734 33.0125 9.83734V15.3948H30.1775C27.3875 15.3948 26.51 17.1273 26.51 18.9048V23.1348H32.765L31.7525 29.6598H26.51V45.4098C31.812 44.5725 36.64 41.8673 40.1223 37.7825C43.6047 33.6977 45.512 28.5025 45.5 23.1348C45.5 10.6923 35.375 0.589844 23 0.589844Z"
                    fill="#FEFEFE"
                  />
                </svg>

                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 14.9704C18.1293 14.9704 14.9705 18.1292 14.9705 21.9999C14.9705 25.8706 18.1293 29.0294 22 29.0294C25.8707 29.0294 29.0295 25.8706 29.0295 21.9999C29.0295 18.1292 25.8707 14.9704 22 14.9704ZM43.0832 21.9999C43.0832 19.089 43.1096 16.2044 42.9461 13.2987C42.7826 9.92374 42.0127 6.92842 39.5447 4.46045C37.0715 1.98721 34.0815 1.22256 30.7065 1.05909C27.7955 0.895611 24.9109 0.921979 22.0053 0.921979C19.0943 0.921979 16.2098 0.895611 13.3041 1.05909C9.92911 1.22256 6.93379 1.99249 4.46583 4.46045C1.99258 6.9337 1.22794 9.92374 1.06446 13.2987C0.900983 16.2097 0.92735 19.0942 0.92735 21.9999C0.92735 24.9056 0.900983 27.7954 1.06446 30.7011C1.22794 34.0761 1.99786 37.0714 4.46583 39.5394C6.93907 42.0126 9.92911 42.7773 13.3041 42.9407C16.215 43.1042 19.0996 43.0778 22.0053 43.0778C24.9162 43.0778 27.8008 43.1042 30.7065 42.9407C34.0815 42.7773 37.0768 42.0073 39.5447 39.5394C42.018 37.0661 42.7826 34.0761 42.9461 30.7011C43.1149 27.7954 43.0832 24.9108 43.0832 21.9999ZM22 32.8157C16.0147 32.8157 11.1842 27.9853 11.1842 21.9999C11.1842 16.0146 16.0147 11.1841 22 11.1841C27.9854 11.1841 32.8158 16.0146 32.8158 21.9999C32.8158 27.9853 27.9854 32.8157 22 32.8157ZM33.2588 13.2671C31.8613 13.2671 30.7328 12.1386 30.7328 10.7411C30.7328 9.34366 31.8613 8.21514 33.2588 8.21514C34.6563 8.21514 35.7848 9.34366 35.7848 10.7411C35.7852 11.073 35.7201 11.4016 35.5933 11.7083C35.4665 12.0149 35.2805 12.2935 35.0459 12.5282C34.8112 12.7628 34.5326 12.9489 34.2259 13.0757C33.9193 13.2025 33.5906 13.2675 33.2588 13.2671Z"
                    fill="#FEFEFE"
                  />
                </svg>

                <svg
                  width="45"
                  height="45"
                  viewBox="0 0 45 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_39_1308)">
                    <path
                      d="M22.5 0C34.9393 0 45 10.0607 45 22.5C45 34.9393 34.9393 45 22.5 45C10.0607 45 0 34.9393 0 22.5C0 10.0607 10.0607 0 22.5 0ZM18.3857 34.3607C28.35 34.3607 33.8143 26.1 33.8143 18.9321V18.225C34.875 17.4536 35.8071 16.4893 36.5143 15.3964C35.55 15.8143 34.4893 16.1036 33.3964 16.2643C34.5214 15.5893 35.3893 14.5286 35.775 13.275C34.7143 13.8857 33.5571 14.3357 32.3357 14.5929C31.3393 13.5321 29.925 12.8893 28.3821 12.8893C25.3929 12.8893 22.95 15.3321 22.95 18.3214C22.95 18.7393 22.9821 19.1571 23.1107 19.5429C18.6107 19.3179 14.5929 17.1643 11.925 13.8857C11.475 14.6893 11.1857 15.6214 11.1857 16.6179C11.1857 18.4821 12.15 20.1536 13.5964 21.1179C12.6964 21.1179 11.8607 20.8607 11.1536 20.4429V20.5071C11.1536 23.1429 13.0179 25.3286 15.4929 25.8429C15.0429 25.9714 14.5607 26.0357 14.0786 26.0357C13.725 26.0357 13.4036 26.0036 13.05 25.9393C13.725 28.0929 15.75 29.6679 18.0964 29.7C16.2321 31.1464 13.8857 32.0143 11.3464 32.0143C10.8964 32.0143 10.4786 32.0143 10.0607 31.95C12.4393 33.4929 15.3 34.3929 18.3536 34.3929"
                      fill="#FEFEFE"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_39_1308">
                      <rect width="45" height="45" rx="22.5" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <svg
                  width="41"
                  height="41"
                  viewBox="0 0 41 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_39_1310)">
                    <path
                      d="M0 2.90081C0 1.29853 1.33144 0 2.97422 0H37.5258C39.1686 0 40.5 1.29853 40.5 2.90081V37.5992C40.5 39.2015 39.1686 40.5 37.5258 40.5H2.97422C1.33144 40.5 0 39.2015 0 37.5992V2.90081ZM9.4732 33.9036C11.1515 33.9036 12.512 32.5431 12.512 30.8648V18.654C12.512 16.9758 11.1515 15.6153 9.4732 15.6153C7.79494 15.6153 6.43444 16.9758 6.43444 18.654V30.8648C6.43444 32.5431 7.79494 33.9036 9.4732 33.9036ZM9.47447 13.1169C11.5931 13.1169 12.9119 11.7146 12.9119 9.95794C12.8739 8.16328 11.5957 6.79894 9.51497 6.79894C7.43428 6.79894 6.075 8.16581 6.075 9.95794C6.075 11.7146 7.39378 13.1169 9.43397 13.1169H9.47447ZM18.8673 33.9036C20.541 33.9036 21.8978 32.5467 21.8978 30.873V23.69C21.8978 23.1432 21.9383 22.5965 22.1003 22.2067C22.5382 21.1157 23.5381 19.9842 25.2188 19.9842C27.4185 19.9842 28.2968 21.6599 28.2968 24.1203V30.8648C28.2968 32.5431 29.6573 33.9036 31.3356 33.9036C33.0139 33.9036 34.3744 32.5431 34.3744 30.8648V23.4141C34.3744 17.7947 31.3774 15.1824 27.378 15.1824C24.1532 15.1824 22.7078 16.9543 21.8978 18.2022V18.2512C21.8978 18.2591 21.8914 18.2655 21.8835 18.2655C21.8722 18.2655 21.8654 18.253 21.8715 18.2435L21.8978 18.2022C21.8978 16.7735 20.7396 15.6153 19.3109 15.6153H18.9275C17.2355 15.6153 15.8491 17.0234 15.8538 18.7154C15.8631 22.1451 15.8473 27.5137 15.8351 30.8642C15.8289 32.5433 17.1882 33.9036 18.8673 33.9036Z"
                      fill="#FEFEFE"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_39_1310">
                      <rect width="40.5" height="40.5" rx="4" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="basis-[45%] flex flex-col items-center justify-between rounded-l-xl z-5 p-6">
          <div className="mt-8">
            <Logo className="h-[60px] w-[290px]" />
          </div>

          {/* Input container */}
          <div className="w-1/2">
            {/* Login Page */}
            <h1 className="text-2xl text-start font-bold text-primary mt-4">
              Hello Again!
            </h1>
            <p className="text-start text-primary">Welcome back</p>
            <div className="space-y-4 mt-6">
              {/* Text Input Field */}
              <InputField icon={Circle} placeholder="Table No." />
              {/* Password Input Field */}
              <InputField icon={Lock} placeholder="Password" />
            </div>

            <div className="flex flex-row justify-center items-center">
              <button
                type="submit"
                className="w-full h-12 px-8 text-white bg-[#0575E6] focus:outline-none font-medium rounded-full text-sm mb-4 mt-4"
                onClick={() => navigateToDashboard()}
              >
                {loading ? (
                  <span className="flex gap-3 items-center justify-center">
                    <ImSpinner6 className="animate-spin" /> Loading...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<
  React.ComponentProps<"div"> &
    React.ComponentProps<"input"> & {
      icon: LucideIcon;
    }
> = ({ className, placeholder, type, icon: LucidIcon, ...props }) => {
  return (
    <div className={cn(className, "relative")} {...props}>
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        {<LucidIcon className="text-primary/40" />}
      </div>
      <input
        type={type}
        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-background focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  );
};

export default ScreenLogin;
