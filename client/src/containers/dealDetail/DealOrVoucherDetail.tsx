import moment from "moment";
import ComponentCard from "../../components/common/ComponentCard";
import GradientText from "../../components/common/GradientText";
import {
  calculateDiscountPercentage,
  handleFormatDate,
} from "../../helper/utils";
import DescriptionSection from "./DescriptionSection";
import { DealActiveStatusType, DealType } from "../../helper/types";
import CommentSection from "./CommentSection";
import ReportSection from "./ReportSection";
import DetailImages from "./DetailImages";
import { useState } from "react";
import endpoints from "../../helper/endpoints";
import { toast } from "react-toastify";
import DealActiveDropdown from "../common/DealActiveDropdown";
import DealRejectReasonModal from "../common/DealRejectReasonModal";
import { apiPost } from "../../services/apiMethods";

type PropsType = {
  deal?: DealType;
  fetchDealById: () => void;
};

const DealOrVoucherDetail = ({ deal, fetchDealById }: PropsType) => {
  // stats
  const [selectedDeal, setSelectedDeal] = useState<DealType>({});
  const [showRejectReasonModal, setShowRejectReasonModal] = useState(false);

  const toggleRejectReasonModal = () => {
    setShowRejectReasonModal((prev) => !prev);
  };

  const handleUpdateActiveStatus = async (
    data: DealType,
    status: DealActiveStatusType
  ) => {
    if (status === "Rejected") {
      setSelectedDeal(data);
      return toggleRejectReasonModal();
    }

    apiPost({
      endpoint: endpoints.approveDeal(data?.id ?? ""),
      payload: { is_active: status },
      onSuccess: (data: any) => {
        toast.success(data?.message);
        fetchDealById?.();
      },
    });
  };

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
    <>
      <DealRejectReasonModal
        fetchDeals={fetchDealById}
        selectedDeal={selectedDeal}
        isOpen={showRejectReasonModal}
        setSelectedDeal={setSelectedDeal}
        onClose={toggleRejectReasonModal}
      />

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
              <strong>Start Date:</strong> {handleFormatDate(deal.start_date)}
            </div>
          )}
          {deal.expire_date && (
            <div>
              <strong>Expire Date:</strong> {handleFormatDate(deal.expire_date)}
            </div>
          )}
          {deal.deal_link && (
            <div>
              <strong>Deal Link:</strong>{" "}
              <a
                href={deal.deal_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GradientText>View Deal</GradientText>
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
              {deal.type === "Discount_Only" ? "Voucher" : "Deal"}
            </div>
          )}
          {deal.status && (
            <div className="flex items-center gap-1">
              {/* <strong>Status:</strong> {deal.status} */}
              <strong>Status:</strong>{" "}
              <DealActiveDropdown
                data={deal}
                handleUpdateActiveStatus={handleUpdateActiveStatus}
              />
            </div>
          )}
          {deal.users?.username && (
            <div>
              <strong>Posted By:</strong> {deal.users.username}
            </div>
          )}
          {deal.is_active && (
            <div>
              <strong>Deal Active Status:</strong> {deal?.is_active}
            </div>
          )}
          {deal.edit_reason && (
            <div>
              <strong>Edit Reason:</strong> {deal.edit_reason}
            </div>
          )}
          {deal.voucher_type && (
            <div>
              <strong>Voucher Type:</strong>{" "}
              {deal.voucher_type.replace(/_/g, " ")}
            </div>
          )}
          {deal.approve_date && (
            <div>
              <strong>Approved On:</strong>{" "}
              {handleFormatDate(deal.approve_date)}
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
          {deal.deal_locations && deal.deal_locations?.length > 0 && (
            <div>
              <strong>Locations:</strong> <br />
              <ol className="list-decimal list-inside space-y-1">
                {deal.deal_locations.map((loc, index) => (
                  <li key={index}>{loc?.address}</li>
                ))}
              </ol>
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
    </>
  );
};

export default DealOrVoucherDetail;
