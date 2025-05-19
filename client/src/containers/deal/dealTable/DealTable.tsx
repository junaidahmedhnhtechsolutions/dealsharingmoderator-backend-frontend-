import _ from "lodash";
import { Table, TableBody } from "../../../components/ui/table";
import {
  DealActiveStatusType,
  DealStatusType,
  DealType,
} from "../../../helper/types";
import DealEditRequestReasonModal from "../../common/DealEditRequestReasonModal";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import DealReportsModal from "../../common/DealReportsModal";
import { useNavigate, useSearchParams } from "react-router";
import VoucherTableListItem from "./VoucherTableListItem";
import { apiDelete } from "../../../services/apiMethods";
import VoucherTableHeader from "./VoucherTableHeader";
import DealTableListItem from "./DealTableListItem";
import DealTableWrapper from "./DealTableWrapper";
import endpoints from "../../../helper/endpoints";
import DealTableHeader from "./DealTableHeader";
import routes from "../../../helper/routes";
import { toast } from "react-toastify";
import { useState } from "react";

type ModalType = "report" | "reason" | "";

type PropsType = {
  deals: DealType[];
  selectedDeal: DealType;
  isLoading: boolean;
  setDeals: Function;
  fetchDeals?: Function;
  onAddDeal: () => void;
  setSelectedDeal: Function;
  toggleDealForm: () => void;
  handleUpdateDealStatus: (data: DealType, status: DealStatusType) => void;
  handleUpdateActiveStatus?: (
    data: DealType,
    status: DealActiveStatusType
  ) => void;
};

export default function DealTable(props: PropsType) {
  const {
    deals,
    setDeals,
    isLoading,
    onAddDeal,
    fetchDeals,
    selectedDeal,
    toggleDealForm,
    setSelectedDeal,
    handleUpdateDealStatus,
    handleUpdateActiveStatus,
  } = props;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isVoucher = searchParams.get("type") === "Discount_Only";

  const [showReason, setShowReason] = useState(false);
  const [modal, setModal] = useState<ModalType>("");

  const toggleReasonModal = () => {
    setShowReason((prev) => !prev);
  };

  const handleShowEditReason = (deal: DealType) => {
    setSelectedDeal(deal);
    toggleReasonModal();
  };

  const handleShowReports = (deal: DealType) => {
    setSelectedDeal(deal);
    setModal("report");
  };

  const handleEditDeal = (deal: DealType) => {
    setSelectedDeal(deal);
    toggleDealForm();
  };

  const handleDeleteDeal = async (deal: DealType) => {
    apiDelete({
      endpoint: endpoints.deleteDeal(deal.id ?? ""),
      onSuccess: (data: any) => {
        toast.success(data?.message);
        setDeals((prev: DealType[]) =>
          prev.filter((item) => item.id !== deal.id)
        );
        fetchDeals?.();
      },
    });
  };

  const handleShowDealDetails = (data: DealType) => {
    navigate(`${routes.dealDetail}/${data?.id}`, { state: data });
  };

  return (
    <>
      {showReason && (
        <DealEditRequestReasonModal
          isOpen={showReason}
          onClose={toggleReasonModal}
          selectedDeal={selectedDeal}
        />
      )}

      {modal === "report" && (
        <DealReportsModal
          isOpen={modal === "report"}
          onClose={() => setModal("")}
          selectedDeal={selectedDeal}
        />
      )}

      <div className="space-y-6">
        <DealTableWrapper
          title="Deal List"
          rightBtnTitle="Add Deal"
          onRightBtnClick={onAddDeal}
        >
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="relative max-w-full overflow-x-auto">
              {isLoading && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center py-10">
                  <LoadingSpinner size="lg" />
                </div>
              )}
              <div className="min-w-[200rem]">
                <Table>
                  {/* Table Header */}
                  {isVoucher ? <VoucherTableHeader /> : <DealTableHeader />}

                  {/* Table Body */}
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {isLoading ? (
                      <div className="py-20 w-full" />
                    ) : _.isEmpty(deals) ? (
                      <p className="p-4 text-center font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        Empty List
                      </p>
                    ) : (
                      deals.map((item) =>
                        isVoucher ? (
                          <VoucherTableListItem
                            data={item}
                            key={`${item.id}_${item?.created_at}`}
                            onItemClick={handleShowDealDetails}
                            handleEditDeal={handleEditDeal}
                            handleDeleteDeal={handleDeleteDeal}
                            handleShowReports={handleShowReports}
                            handleShowEditReason={handleShowEditReason}
                            handleUpdateDealStatus={handleUpdateDealStatus}
                            handleUpdateActiveStatus={handleUpdateActiveStatus}
                          />
                        ) : (
                          <DealTableListItem
                            data={item}
                            key={`${item.id}_${item?.created_at}`}
                            onItemClick={handleShowDealDetails}
                            handleEditDeal={handleEditDeal}
                            handleDeleteDeal={handleDeleteDeal}
                            handleShowReports={handleShowReports}
                            handleShowEditReason={handleShowEditReason}
                            handleUpdateDealStatus={handleUpdateDealStatus}
                            handleUpdateActiveStatus={handleUpdateActiveStatus}
                          />
                        )
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DealTableWrapper>
      </div>
    </>
  );
}
