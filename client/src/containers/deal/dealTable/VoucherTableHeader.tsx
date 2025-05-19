import { TableCell, TableHeader, TableRow } from "../../../components/ui/table";

const VoucherTableHeader = () => {
  return (
    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
      <TableRow>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Deal Title
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          User
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Deal Type
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Image
        </TableCell>

        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Status
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Category
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Voucher Type
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Reduction
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Discount
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Discount Code
        </TableCell>

        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Create Date
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Approve Date
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Merchant
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Deal Link
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Description
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Active/Deactive
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Report
        </TableCell>
        <TableCell
          isHeader
          className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Edit Request
        </TableCell>
      </TableRow>
    </TableHeader>
  );
};

export default VoucherTableHeader;
