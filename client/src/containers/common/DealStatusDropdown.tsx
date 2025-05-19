import { useRef, useState } from "react";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";
import { Dropdown2 } from "../../components/ui/dropdown/Dropdown2";
import { DealStatusType, DealType } from "../../helper/types";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Badge from "../../components/ui/badge/Badge";

const STATUS_COLORS: Record<
  NonNullable<DealStatusType>,
  "primary" | "error" | "warning" | "info"
> = {
  All: "primary",
  Hottest: "error",
  Popular: "warning",
  Trending: "info",
};

export default function DealStatusDropdown({
  data,
  handleUpdateDealStatus,
}: {
  data: DealType;
  handleUpdateDealStatus: (data: DealType, status: DealStatusType) => void;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(data?.status);

  const badgeColor = status ? STATUS_COLORS[status] || "primary" : "primary";

  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleItemClick = (status: DealStatusType) => {
    setStatus(status);
    handleUpdateDealStatus(data, status);
    closeDropdown();
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className="h-fit flex items-center gap-1 text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <Badge size="md" color={badgeColor}>
          {status}
        </Badge>
        {isOpen ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
      </button>
      <Dropdown2
        isOpen={isOpen}
        triggerRef={triggerRef}
        onClose={closeDropdown}
        className="mt-4 w-40 p-3"
      >
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={() => handleItemClick("All")}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              All
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={() => handleItemClick("Hottest")}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Hottest
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={() => handleItemClick("Popular")}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Popular
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={() => handleItemClick("Trending")}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Trending
            </DropdownItem>
          </li>
        </ul>
      </Dropdown2>
    </div>
  );
}
