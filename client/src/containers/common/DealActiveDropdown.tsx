import { useRef, useState } from "react";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";
import { Dropdown2 } from "../../components/ui/dropdown/Dropdown2";
import { DealActiveStatusType, DealType } from "../../helper/types";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Badge from "../../components/ui/badge/Badge";

const STATUS_COLORS: Record<
  NonNullable<DealActiveStatusType>,
  "success" | "error" | "primary" | "dark"
> = {
  Expired: "dark",
  Active: "success",
  Inactive: "primary",
  Rejected: "error",
};

export default function DealActiveDropdown({
  data,
  handleUpdateActiveStatus,
}: {
  data: DealType;
  handleUpdateActiveStatus?: (
    data: DealType,
    status: DealActiveStatusType
  ) => void;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  // const [status, setStatus] = useState(data?.is_active);

  const status = data?.is_active ?? "Inactive";

  const badgeColor = status ? STATUS_COLORS[status] || "primary" : "primary";

  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleItemClick = (status: DealActiveStatusType) => {
    // setStatus(status);
    handleUpdateActiveStatus?.(data, status);
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
              onItemClick={() => handleItemClick("Active")}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Active
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={() => handleItemClick("Inactive")}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Inactive
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={() => handleItemClick("Expired")}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Expired
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={() => handleItemClick("Rejected")}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Rejected
            </DropdownItem>
          </li>
        </ul>
      </Dropdown2>
    </div>
  );
}
