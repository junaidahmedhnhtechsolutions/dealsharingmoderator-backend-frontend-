import { useEffect, useState } from "react";
import DealAndVoucherFormWrapper from "../../containers/deal/dealForm/DealAndVoucherFormWrapper";
import { sortByDate } from "../../helper/utils";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  DealActiveStatusType,
  DealStatusType,
  DealType,
} from "../../helper/types";
import DealTable from "../../containers/deal/dealTable/DealTable";
import endpoints from "../../helper/endpoints";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";
import DealRejectReasonModal from "../../containers/common/DealRejectReasonModal";
import { apiGet, apiPost } from "../../services/apiMethods";

type TabType = "deal" | "voucher";

export default function DealPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("search")?.toLowerCase() || "";
  const formParam = searchParams.get("form");
  const isDealFormVisible = formParam === "deal";
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";

  const [deals, setDeals] = useState<DealType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<TabType | string>("deal");
  const [selectedDeal, setSelectedDeal] = useState<DealType>({});
  const [showRejectReasonModal, setShowRejectReasonModal] = useState(false);

  const filteredDeals = deals.filter((deal: DealType) => {
    const titleMatch = deal?.title?.toLowerCase().includes(searchValue);
    const typeMatch = deal?.type?.toLowerCase().includes(searchValue);
    return titleMatch || typeMatch;
  });

  const fetchDeals = () => {
    setIsLoading(true);

    apiGet({
      endpoint:
        type || status
          ? `${endpoints.getDeals}?is_active=${status}&type=${type}`
          : endpoints.getDeals,
      onSuccess: (data: any) => {
        setDeals(sortByDate(data?.data || []));
      },
      onFinally: () => setIsLoading(false),
    });
  };

  useEffect(() => {
    fetchDeals();
  }, [type, status]);

  const handleSelectTab = (value: TabType | string) => setTab(value);

  const toggleRejectReasonModal = () =>
    setShowRejectReasonModal((prev) => !prev);

  const toggleDealForm = () => {
    if (isDealFormVisible) {
      searchParams.delete("form");
    } else {
      searchParams.set("form", "deal");
    }
    setSearchParams(searchParams);
  };

  const onAddDeal = () => {
    setSelectedDeal({});
    toggleDealForm();
  };

  const handleUpdateDealStatus = (data: DealType, status: DealStatusType) => {
    apiPost({
      endpoint: endpoints.updateDealStatus(data?.id ?? ""),
      payload: { status },
      onSuccess: (res: any) => {
        toast.success(res?.message);
        fetchDeals?.();
      },
    });
  };

  const handleUpdateActiveStatus = (
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
      onSuccess: (res: any) => {
        toast.success(res?.message);
        fetchDeals?.();
      },
    });
  };

  return (
    <>
      <DealRejectReasonModal
        fetchDeals={fetchDeals}
        selectedDeal={selectedDeal}
        isOpen={showRejectReasonModal}
        setSelectedDeal={setSelectedDeal}
        onClose={toggleRejectReasonModal}
      />

      <PageBreadcrumb
        pageTitle={
          isDealFormVisible
            ? `${selectedDeal?.id ? "Edit" : "Create"} ${
                tab === "deal" ? "Deal" : "Voucher"
              }`
            : "Deal"
        }
      />

      {isDealFormVisible ? (
        <DealAndVoucherFormWrapper
          tab={tab}
          handleSelectTab={handleSelectTab}
          setDeals={setDeals}
          fetchDeals={fetchDeals}
          selectedDeal={selectedDeal}
          toggleDealForm={toggleDealForm}
          setSelectedDeal={setSelectedDeal}
        />
      ) : (
        <DealTable
          deals={filteredDeals}
          setDeals={setDeals}
          isLoading={isLoading}
          fetchDeals={fetchDeals}
          selectedDeal={selectedDeal}
          toggleDealForm={toggleDealForm}
          setSelectedDeal={setSelectedDeal}
          handleUpdateDealStatus={handleUpdateDealStatus}
          handleUpdateActiveStatus={handleUpdateActiveStatus}
          onAddDeal={onAddDeal}
        />
      )}
    </>
  );
}
