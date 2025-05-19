import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import { ChevronDownIcon, HorizontaLDots } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import routes from "../helper/routes";
import { MdOutlineDashboard } from "react-icons/md";
import { TbTagStarred } from "react-icons/tb";
import { PiUserCircle } from "react-icons/pi";
import { useAuth } from "../context/AuthContext";
// import { PiUserCircle } from "react-icons/pi";

type NavItem = {
  name: string;
  darkIcon: string;
  whiteIcon: string;
  colorIcon: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const masterNavItems: NavItem[] = [
  {
    name: "Dashboard",
    path: routes.dashboard,
    icon: <MdOutlineDashboard />,
    whiteIcon: "./svgs/dashboardWhite.svg",
    colorIcon: "./svgs/dashboard.svg",
    darkIcon: "./svgs/dashboardDark.svg",
  },
  {
    name: "Deal",
    path: routes.deal,
    icon: <TbTagStarred />,
    whiteIcon: "./svgs/dealWhite.svg",
    colorIcon: "./svgs/deal.svg",
    darkIcon: "./svgs/dealDark.svg",
  },
  {
    name: "Moderators",
    path: routes.moderator,
    icon: <PiUserCircle />,
    whiteIcon: "./svgs/userWhite.svg",
    colorIcon: "./svgs/user.svg",
    darkIcon: "./svgs/userDark.svg",
  },
  {
    name: "Users",
    path: routes.user,
    icon: <PiUserCircle />,
    whiteIcon: "./svgs/usersWhite.svg",
    colorIcon: "./svgs/users.svg",
    darkIcon: "./svgs/usersDark.svg",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();

  const isMaster = user?.role === "Master_Vendor";
  const isUserManagement = user?.permissions?.includes("user_management");
  const isReviewDeals = user?.permissions?.includes("review_deals");

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      path: routes.dashboard,
      icon: <MdOutlineDashboard />,
      whiteIcon: "./svgs/dashboardWhite.svg",
      colorIcon: "./svgs/dashboard.svg",
      darkIcon: "./svgs/dashboardDark.svg",
    },
    ...(isReviewDeals
      ? [
          {
            name: "Deal",
            path: routes.deal,
            icon: <TbTagStarred />,
            whiteIcon: "./svgs/dealWhite.svg",
            colorIcon: "./svgs/deal.svg",
            darkIcon: "./svgs/dealDark.svg",
          },
        ]
      : []),

    ...(isUserManagement
      ? [
          {
            name: "Users",
            path: routes.user,
            icon: <PiUserCircle />,
            whiteIcon: "./svgs/usersWhite.svg",
            colorIcon: "./svgs/users.svg",
            darkIcon: "./svgs/usersDark.svg",
          },
        ]
      : []),
  ];

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <img
                  alt="icon"
                  src={isActive(nav.path) ? nav.colorIcon : nav.whiteIcon}
                  className="w-6 h-6 hidden dark:block"
                />
                <img
                  alt="icon-dark"
                  src={isActive(nav.path) ? nav.colorIcon : nav.darkIcon}
                  className="w-6 h-6 block dark:hidden"
                />

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span
                    className={`menu-item-text ${
                      isActive(nav.path) ? "text-gradient" : ""
                    }`}
                  >
                    {nav.name}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-5 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <img
              className="h-8 object-cover object-center"
              src="/driveImages/bubbl-logo.png"
              alt="Logo"
            />
          ) : (
            <img
              className="w-10 h-10 object-cover object-center rounded-md"
              src="/driveImages/Icon.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(isMaster ? masterNavItems : navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
