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
      {item.availability ? (
        <div>
          <>
            <div
              onClick={() => showFood(item.id)}
              className={cn(
                "aspect-video md:aspect-[1/1.2] bg-sidebar flex flex-col gap-y-2 items-stretch justify-center rounded-lg shadow-sm p-4 select-none cursor-pointer"
              )}
            >
              <div className="aspect-video md:aspect-square rounded-xl overflow-hidden flex justify-center items-center object-contain">
                <img
                  src={item.image1}
                  alt={item.item_name}
                  className="object-cover w-full  h-full "
                />
              </div>
              <p className="text-icon-active/80 text-wrap font-medium">
                {item.item_name}
              </p>
              <p className="text-icon-active text-wrap text-start font-bold text-xl tr">
                {`AED${item.price}`}
                <span className="text-sm font-normal">
                  / {item.category_name}
                </span>
              </p>
            </div>
          </>
        </div>
      ) : null}
    </>
  );
};
