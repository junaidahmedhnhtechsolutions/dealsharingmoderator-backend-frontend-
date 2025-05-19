import { ReactElement } from "react";
import { Link } from "react-router";

type PropsType = {
  title: string;
  quantity: number;
  iconPath: string;
  icon?: ReactElement;
  isLoading?: boolean;
  href: string;
};

export default function DashboardCard(props: PropsType) {
  const { title, quantity, iconPath, isLoading, href } = props;

  return (
    <Link to={href}>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 md:p-6 flex flex-col items-center gap-2 hover:scale-105 transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-800">
          <img src={iconPath} alt="icon" className="w-6 h-6" />
        </div>
        <span className="text-base text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
          {isLoading ? <span className="text-xs">Loading...</span> : quantity}
        </h4>
      </div>
    </Link>
  );
}
