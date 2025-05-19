import moment from "moment";
import ComponentCard from "../../components/common/ComponentCard";
import { DealType } from "../../helper/types";
import GradientText from "../../components/common/GradientText";
import clsx from "clsx";
import { calculateDiscountPercentage } from "../../helper/utils";
import DescriptionSection from "./DescriptionSection";
import CommentSection from "./CommentSection";
import ReportSection from "./ReportSection";
import DetailImages from "./DetailImages";

type PropsType = {
  deal?: DealType;
  fetchDealById: () => void;
};

const badgeClass = (
  type: "status" | "active" | "expire",
  value: string | number | undefined | boolean
) => {
  switch (type) {
    case "status":
      return clsx(
        "px-2 py-0.5 rounded text-xs font-semibold",
        value === "Approved"
          ? "bg-green-100 text-green-800"
          : value === "Rejected"
          ? "bg-red-100 text-red-800"
          : "bg-gray-100 text-gray-800"
      );
    case "active":
      return clsx(
        "px-2 py-0.5 rounded text-xs font-semibold",
        value === "Active"
          ? "bg-green-200 text-green-900"
          : "bg-red-200 text-red-900"
      );
    case "expire":
      return clsx(
        "px-2 py-0.5 rounded text-xs font-semibold",
        value ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
      );
  }
};

const DealOrVoucherDetail = ({ deal, fetchDealById }: PropsType) => {
  if (!deal?.id) {
    return (
      <ComponentCard title="Deal Details">
        <p className="text-gray-500">No deal data available.</p>
      </ComponentCard>
    );
  }

  const isVoucher = deal.type === "Discount_Only";
  const discountPercent =
    deal.price && deal.next_price
      ? calculateDiscountPercentage(deal.price, deal.next_price)
      : null;

  return (
    <ComponentCard
      title={`${isVoucher ? "Voucher" : "Deal"} Details`}
      className="relative space-y-8"
    >
      <span className="absolute top-5 right-6 text-base text-gray-400">
        Posted {moment(deal.created_at).fromNow()}
      </span>

      {deal?.deal_images && deal?.deal_images?.length > 0 && (
        <DetailImages deal={deal} />
      )}

      <h3 className="font-semibold text-2xl text-gray-800 dark:text-white/90">
        <GradientText>{deal?.title ?? ""}</GradientText>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 dark:text-white/80">
        {deal.title && (
          <div>
            <strong>Title:</strong> {deal.title}
          </div>
        )}
        {deal.price && (
          <div>
            <strong>Price:</strong>{" "}
            <GradientText>{`${deal.price} AED`}</GradientText>
          </div>
        )}
        {deal.next_price && (
          <div>
            <strong>Next Price:</strong> {deal.next_price} AED
          </div>
        )}
        {discountPercent !== null && (
          <div>
            <strong>Discount %:</strong> {discountPercent}%
          </div>
        )}
        {deal.discount_price && (
          <div>
            <strong>Discount Price:</strong> {deal.discount_price}
          </div>
        )}
        {deal.reduction_price && (
          <div>
            <strong>Reduction Price:</strong> {deal.reduction_price} AED
          </div>
        )}
        {deal.discount_code && (
          <div>
            <strong>Discount Code:</strong> {deal.discount_code}
          </div>
        )}
        {deal.delivery_charges && (
          <div>
            <strong>Delivery Charges:</strong> {deal.delivery_charges} AED
          </div>
        )}
        {deal.shipping_country && (
          <div>
            <strong>Shipping Country:</strong> {deal.shipping_country}
          </div>
        )}
        {deal.start_date && (
          <div>
            <strong>Start Date:</strong>{" "}
            {moment(deal.start_date).format("YYYY-MM-DD HH:mm")}
          </div>
        )}
        {deal.expire_date && (
          <div>
            <strong>Expire Date:</strong>{" "}
            {moment(deal.expire_date).format("YYYY-MM-DD HH:mm")}
          </div>
        )}
        {deal.deal_link && (
          <div>
            <strong>Deal Link:</strong>{" "}
            <a
              href={deal.deal_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Deal
            </a>
          </div>
        )}
        {deal.category?.name && (
          <div>
            <strong>Category:</strong> {deal.category.name}
          </div>
        )}
        {deal.merchant && (
          <div>
            <strong>Merchant:</strong> {deal.merchant}
          </div>
        )}
        {deal.type && (
          <div>
            <strong>Type:</strong>{" "}
            <span className="inline-block px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
              {deal.type}
            </span>
          </div>
        )}
        {deal.status && (
          <div>
            <strong>Status:</strong>{" "}
            <span className={badgeClass("status", deal.status)}>
              {deal.status}
            </span>
          </div>
        )}
        {deal.is_active && (
          <div>
            <strong>Active:</strong>{" "}
            <span className={badgeClass("active", deal.is_active)}>
              {deal.is_active}
            </span>
          </div>
        )}
        {deal.is_expire !== undefined && (
          <div>
            <strong>Expired:</strong>{" "}
            <span className={badgeClass("expire", deal.is_expire)}>
              {deal.is_expire ? "Expired" : "Valid"}
            </span>
          </div>
        )}
        {deal.store_name && (
          <div>
            <strong>Store Name:</strong> {deal.store_name}
          </div>
        )}
        {deal.users?.username && (
          <div>
            <strong>Posted By:</strong> {deal.users.username}
          </div>
        )}
        {/* Newly Added */}
        {deal.is_active && (
          <div>
            <strong>Active Status:</strong> {deal?.is_active}
          </div>
        )}
        {deal.reported_deals && deal.reported_deals?.length > 0 && (
          <div>
            <strong>Reports:</strong> {deal.reported_deals.length}
          </div>
        )}
        {deal.edit_reason && (
          <div>
            <strong>Edit Reason:</strong> {deal.edit_reason}
          </div>
        )}

        {deal.voucher_type && (
          <div>
            <strong>Voucher Type:</strong> {deal.voucher_type}
          </div>
        )}

        {deal.approve_date && (
          <div>
            <strong>Approved On:</strong>{" "}
            {moment(deal.approve_date).format("YYYY-MM-DD HH:mm")}
          </div>
        )}

        {deal.deal_locations && deal.deal_locations?.length > 0 && (
          <div>
            <strong>Locations:</strong>{" "}
            {deal.deal_locations.map((loc) => loc?.address).join(", ")}
            {/* {deal.deal_locations.map((loc) => loc?.address).join(", ")} */}
          </div>
        )}

        <div>
          <strong>Votes:</strong> {deal.votes}
        </div>

        <div>
          <strong>Comments:</strong> {deal?.comments?.length}
        </div>

        <div>
          <strong>Reports:</strong> {deal?.reported_deals?.length}
        </div>

        {deal.approval_status && (
          <div>
            <strong>Approval Status:</strong> {deal.approval_status}
          </div>
        )}
      </div>

      <DescriptionSection deal={deal} />

      {deal?.reported_deals && deal?.reported_deals?.length > 0 && (
        <ReportSection deal={deal} fetchDealById={fetchDealById} />
      )}

      {deal?.comments && deal?.comments?.length > 0 && (
        <CommentSection deal={deal} fetchDealById={fetchDealById} />
      )}
    </ComponentCard>
  );
};

export default DealOrVoucherDetail;
