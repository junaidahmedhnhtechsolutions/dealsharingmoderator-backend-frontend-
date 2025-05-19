import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuth } from "../../context/AuthContext";
import { PiUserCircle } from "react-icons/pi";
import { TbLogout2 } from "react-icons/tb";
import routes from "../../helper/routes";
import { useNavigate } from "react-router";

export default function UserDropdown() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = () => {
    navigate(routes.signin);
    logout();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full sm:h-11 sm:w-11 h-10 w-10">
          <img src="/images/userPlaceholder.png" alt="User" />
        </span>

        <div className="flex flex-col items-start">
          <span className="block font-medium text-theme-sm max-w-40 truncate overflow-hidden whitespace-nowrap">
            {user?.username}
          </span>
          <span className="block font-medium text-theme-sm max-w-40 truncate overflow-hidden whitespace-nowrap">
            {user?.email}
          </span>
        </div>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="flex items-center gap-3">
          <span className="overflow-hidden rounded-full min-h-10 max-h-10 min-w-10 max-w-10">
            <img alt="User" src="/images/userPlaceholder.png" />
          </span>
          <div>
            <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
              {user?.username}
            </span>
            <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </span>
          </div>
        </div>

        <ul className="flex flex-col gap-1 pt-3 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to={routes.profile}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <PiUserCircle size={20} />
              Edit profile
            </DropdownItem>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <TbLogout2 size={20} />
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
