import { ChefAvatar } from "../components/icons";

const ScreenHome = () => {
  return (
    <div className="h-screen md:h-[100dvh] flex flex-col justify-between items-center px-4 py-6">
      {/* Top section */}
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-y-3 rounded-lg shadow-md bg-[#F6F9FF] p-4 sm:p-6 md:p-4 text-primary">
          <h1 className="text-2xl sm:text-3xl md:text-2xl font-medium text-center md:text-left">
            Hi, There
          </h1>
          <h6 className="text-base sm:text-lg md:text-xl text-center md:text-left">
            Welcome! Thank you for joining us today!
          </h6>
          <p className="text-sm sm:text-base md:text-md text-primary/60 mt-2 sm:mt-4 text-center md:text-left">
            We're so happy to see you! Get ready to indulge in some delicious
            flavors and a warm, friendly atmosphere.
          </p>
        </div>
      </div>

      {/* Chef Avatar */}
      <div className="flex justify-center w-full my-6 sm:my-8">
        <ChefAvatar  />
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-2xl text-center space-y-3 px-2">
        <h6 className="text-2xl sm:text-2xl md:text-xl text-primary font-medium">
          Select delicious items for your meal
        </h6>
        <p className="text-sm sm:text-base md:text-md text-primary/60">
          Here's our menu—take your time to explore our delicious categories and
          items
        </p>
      </div>
    </div>
  );
};

export default ScreenHome;
