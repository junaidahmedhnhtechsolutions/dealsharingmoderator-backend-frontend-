import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DashboardCard from "../../containers/common/DashboardCard";
import DealCard from "../../containers/common/DealCard";
import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../../services/apiMethods";
import endpoints from "../../helper/endpoints";
import { DealType } from "../../helper/types";
import { useLocation } from "react-router";
import routes from "../../helper/routes";

export default function DealReportsPage() {
  const { state } = useLocation();

  const data: DealType = useMemo(() => state?.data, [state?.data]);

  const [counts, setCounts] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = () => {
    setIsLoading(true);

    apiGet({
      endpoint: endpoints.allCount,
      onSuccess: (data: any) => {
        setCounts(data?.data);
      },
      onFinally: () => {
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <PageBreadcrumb pageTitle="Deal Reports" />
      <div className="">
        <DealCard data={state.data} isLoading={isLoading} />
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-6 gap-4 mt-4">
        {data?.reported_deals?.map((item) => (
          <DashboardCard
            title="Deal"
            key={item?.id}
            href={routes?.deal}
            isLoading={isLoading}
            iconPath="./svgs/deal.svg"
            quantity={counts?.totalDeals ?? 0}
          />
        ))}
      </div>
    </>
  );
}
