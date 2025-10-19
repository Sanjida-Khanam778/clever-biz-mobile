import { cn } from "clsx-for-tailwind";
export type FoodItemTypes = {
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

type Props = {
  item: FoodItemTypes;
  showFood: (id: number) => void;
};

export const FoodItems = ({ item, showFood }: Props) => {
  return (
    <>
      {item.availability && (
        <div
          onClick={() => showFood(item.id)}
          className={cn(
            "bg-sidebar flex flex-col items-center justify-between rounded-xl shadow-md p-4 select-none cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
            "w-[300px] sm:w-[220px] md:w-[220px] lg:w-[200px] xl:w-[250px] h-[330px]" 
          )}
        >
 
          <div className="w-full h-[200px] rounded-lg overflow-hidden flex justify-center items-center bg-[#f9f9f9]">
            <img
              src={item.image1}
              alt={item.item_name}
              className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
            />
          </div>

        
          <p className="text-icon-active/80 font-medium mt-1 text-base truncate w-full">
            {item.item_name}
          </p>

     
          <p className="text-icon-active font-bold text-lg mt-1">
            AED {item.price}
            <span className="text-sm font-normal text-gray-400 ml-1">
              / {item.category_name}
            </span>
          </p>
        </div>
      )}
    </>
  );
};
