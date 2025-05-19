import TableSearchBar from "../common/TableSearchBar";

interface UsersTableWrapperProps {
  // title: string;
  // desc?: string; // Description text
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
}

const UsersTableWrapper: React.FC<UsersTableWrapperProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="sm:px-6 sm:py-5 p-4 gap-4 flex items-center justify-between sm:flex-row flex-col-reverse">
        <TableSearchBar placeholder="Search user" />
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default UsersTableWrapper;
