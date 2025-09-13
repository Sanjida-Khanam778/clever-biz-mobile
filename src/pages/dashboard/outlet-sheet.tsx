import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Outlet } from "react-router";

type OutletSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const OutletSheet = ({ open, onOpenChange }: OutletSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger className="bg-blue-100 p-3 rounded-full  lg:hidden outline-none hover:bg-blue-200">
        <Menu />
      </SheetTrigger>

      <SheetContent side="right" className="p-6">
        <Outlet />
      </SheetContent>
    </Sheet>
  );
};
