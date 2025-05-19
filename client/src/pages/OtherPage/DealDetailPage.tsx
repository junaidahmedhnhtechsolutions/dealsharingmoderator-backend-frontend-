import DealOrVoucherDetail from "../../containers/dealDetail/DealOrVoucherDetail";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useParams } from "react-router";
import endpoints from "../../helper/endpoints";
import { DealType } from "../../helper/types";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { apiGet } from "../../services/apiMethods";

export default function DealDetailPage() {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [deal, setDeal] = useState<DealType>({});

  const isVoucher = deal?.type === "Discount_Only";

  const fetchDealById = () => {
    setIsLoading(true);

    apiGet({
      endpoint: endpoints.getDealById(id ?? ""),
      onSuccess: (data: any) => {
        setDeal(data?.data || {});
      },
      onFinally: () => {
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    fetchDealById();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80dvh] w-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle={`${isVoucher ? "Voucher" : "Deal"} Details`} />

      <DealOrVoucherDetail deal={deal} fetchDealById={fetchDealById} />
    </>
  );
}
