import {
  calculateDiscountPercentage,
  handleFormatDate,
  copyToClipboard,
  getDealUser,
} from "../../../helper/utils";
import { TableCell, TableRow } from "../../../components/ui/table";
import DealStatusDropdown from "../../common/DealStatusDropdown";
import DealActiveDropdown from "../../common/DealActiveDropdown";
import Button from "../../../components/ui/button/Button";
import { GoPencil, GoTrash } from "react-icons/go";
import { FaRegCopy } from "react-icons/fa6";
import {
  DealActiveStatusType,
  DealStatusType,
  DealType,
} from "../../../helper/types";
import _ from "lodash";

type PropsType = {
  data: DealType;
  onItemClick?: (data: DealType) => void;
  handleEditDeal: (data: DealType) => void;
  handleDeleteDeal: (data: DealType) => void;
  handleShowReports: (data: DealType) => void;
  handleShowEditReason: (data: DealType) => void;
  handleUpdateDealStatus: (data: DealType, status: DealStatusType) => void;
  handleUpdateActiveStatus?: (
    data: DealType,
    status: DealActiveStatusType
  ) => void;
};

const DealTableListItem = (props: PropsType) => {
  const {
    data,
    onItemClick,
    handleEditDeal,
    handleDeleteDeal,
    handleShowReports,
    handleShowEditReason,
    handleUpdateDealStatus,
    handleUpdateActiveStatus,
  } = props;

  return (
    <TableRow>
      <TableCell
        onClick={() => onItemClick?.(data)}
        className="px-5 py-3 min-w-44 font-medium text-gray-800 text-theme-sm dark:text-white/90 hover:underline cursor-pointer"
      >
        {data?.title ?? "-"}
      </TableCell>
      <TableCell className="px-4 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
        <div className="flex flex-col">
          <span>{getDealUser(data)?.username}</span>
          <a
            href={`mailto:${getDealUser(data)?.email}`}
            className="font-normal text-gray-500 dark:text-gray-400 hover:underline"
          >
            {getDealUser(data)?.email}
          </a>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 min-w-44 font-medium text-gray-800 text-theme-sm dark:text-white/90">
        {data?.type === "Discount_Only" ? "Voucher" : "Deal"}
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <img
          src={
            data?.deal_images && data?.deal_images[0]
              ? data?.deal_images[0]?.image_url
              : "/images/placeholderImg.jpg"
          }
          alt="Deal image"
          className="min-w-10 w-10 h-10 object-cover object-center rounded"
        />
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <DealStatusDropdown
          data={data}
          handleUpdateDealStatus={handleUpdateDealStatus}
        />
      </TableCell>
      <TableCell className="px-4 py-3 min-w-44 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {data?.category?.name}
      </TableCell>
      <TableCell className="px-4 py-3 min-w-44 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {data?.price ? `${data?.price} AED` : "-"}
      </TableCell>
      <TableCell className="px-4 py-3 min-w-44 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {data?.next_price ? `${data?.next_price} AED` : "-"}
      </TableCell>
      <TableCell className="px-4 py-3 min-w-44 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {data?.next_price
          ? `${calculateDiscountPercentage(data.price, data.next_price)}%`
          : "-"}
      </TableCell>
      <TableCell className="px-4 py-3 min-w-44 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {data?.discount_code ?? "-"}
      </TableCell>
      <TableCell className="px-4 py-3 min-w-44 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {data?.delivery_charges ? `${data?.delivery_charges} AED` : "-"}
      </TableCell>
      <TableCell className="px-4 py-3 min-w-44 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {data?.created_at ? handleFormatDate(data?.created_at ?? "") : "-"}
      </TableCell>
      <TableCell className="px-4 py-3 min-w-44 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {data?.approve_date ? handleFormatDate(data?.approve_date ?? "") : "-"}
      </TableCell>
      <TableCell className="px-4 py-3 min-w-44 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {data?.start_date ? handleFormatDate(data?.expire_date ?? "") : "-"}
      </TableCell>
      <TableCell className="px-4 py-3 min-w-44 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {data?.expire_date ? handleFormatDate(data?.expire_date ?? "") : "-"}
      </TableCell>
      <TableCell className="px-4 py-3 min-w-44 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {data?.merchant}
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <div className="flex items-center gap-2">
          <p className="text-gray-500 dark:text-gray-400 text-theme-sm line-clamp-1 max-w-40 overflow-hidden text-ellipsis">
            {data?.deal_link ?? "-"}
          </p>
          {data?.deal_link && (
            <Button
              size="sm"
              variant="outline"
              className="!flex !rounded-full w-10 h-10 items-center justify-center !p-1"
              onClick={() => copyToClipboard(data?.deal_link ?? "")}
            >
              <FaRegCopy />
            </Button>
          )}
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-start text-theme-sm max-w-xs">
        <div
          className="text-gray-500 dark:text-gray-400 text-theme-sm line-clamp-3 max-w-xs overflow-hidden text-ellipsis"
          dangerouslySetInnerHTML={{
            __html: data?.description_html || "",
          }}
        />
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <DealActiveDropdown
          data={data}
          handleUpdateActiveStatus={handleUpdateActiveStatus}
        />
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {!_.isEmpty(data?.reported_deals) ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShowReports?.(data)}
          >
            {data?.reported_deals?.length}{" "}
            {data?.reported_deals?.length && data?.reported_deals?.length < 2
              ? "Report"
              : "Reports"}
          </Button>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {data?.edit_reason ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShowEditReason(data)}
          >
            Show Edit Reason
          </Button>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="!rounded-full w-10 h-10 flex items-center justify-center !p-1"
            onClick={() => handleDeleteDeal(data)}
          >
            <GoTrash />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="!flex !rounded-full w-10 h-10 items-center justify-center !p-1"
            onClick={() => handleEditDeal(data)}
          >
            <GoPencil />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default DealTableListItem;
