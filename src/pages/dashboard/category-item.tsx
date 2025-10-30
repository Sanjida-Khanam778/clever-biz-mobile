import { cn } from "clsx-for-tailwind";

export type CategoryItemType = {
  id: number;
  Category_name: string;
  slug: string;
  image: string;
};

type Props = {
  cat: CategoryItemType;
  i: number;
  selectedCategory: number | null;
  setSelectedCategory: (ind: number) => void;
};

// category-item.tsx
export const CategoryItem = ({
  cat,
  setSelectedCategory,
  i,
  selectedCategory,
}: Props) => {
  return (
    <div
      onClick={() => setSelectedCategory(i)}
      className={cn(
        "flex-shrink-0 h-40 w-38 truncate bg-sidebar flex flex-col gap-y-4 items-center justify-center rounded-lg shadow-sm py-4 last:mr-4 select-none cursor-pointer",
        "transition-all duration-200", // ADD THIS LINE
        {
          "bg-[#F1F5FF] border border-[#ABC1FF]": selectedCategory === i,
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
      <p className="text-primary font-medium">{`${cat.Category_name.substring(
        0,
        17
      )}`}</p>
    </div>
  );
};
