import Button from "../../../components/ui/button/Button";
import TableSearchBar from "../../common/TableSearchBar";
import { FaPlus } from "react-icons/fa6";

interface DealTableWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  onRightBtnClick: () => void;
  rightBtnTitle: string;
}

const DealTableWrapper: React.FC<DealTableWrapperProps> = ({
  // title,
  // desc = "",
  children,
  className = "",
  onRightBtnClick,
  rightBtnTitle,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="sm:px-6 sm:py-5 p-4 gap-4 flex items-center justify-between sm:flex-row flex-col-reverse">
        {/* <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
          {desc && (<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>)}
          <TableSearchBar placeholder="Search your deal here" />
        </div> */}

        <TableSearchBar placeholder="Search your deal here" />
        <Button
          size="sm"
          onClick={onRightBtnClick}
          className="bg-gradient max-sm:self-end"
        >
          <FaPlus /> <span>{rightBtnTitle}</span>
        </Button>
      </div>

      {/* Card Body */}
      <div className="sm:p-6 p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default DealTableWrapper;
