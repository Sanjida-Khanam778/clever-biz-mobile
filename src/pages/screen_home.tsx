import { ChefAvatar } from "../components/icons";

const ScreenHome = () => {
  return (
    <div className="h-full p-4 flex flex-col items-center justify-between">
      {/* Top section */}
      <div>
        <div className="h-full flex flex-col gap-y-2 rounded-lg shadow-md bg-[#F6F9FF] p-4 text-primary">
          <h1 className="text-3xl font-medium">Hi, There</h1>
          <h6 className="text-lg">Welcome! Thank you for joining us today!.</h6>
          <p className="text-primary/60 mt-4">
            We're so happy to see you! Get ready to indulge in somedelicious
            flavors and a warm,friendly atmosphere
          </p>
        </div>
      </div>
      {/* Chef Avatar */}
      <ChefAvatar />
      {/* Bottom Section */}
      <div className="flex flex-col">
        <h6 className="text-3xl text-primary font-medium text-center">
          Select delicious items for your meal
        </h6>
        <p className="text-primary/60 text-center">
          Here's our menu—take your time to explore our delicious categories and
          items
        </p>
      </div>
    </div>
  );
};

export default ScreenHome;
