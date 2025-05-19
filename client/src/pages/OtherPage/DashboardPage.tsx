import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DashboardCard from "../../containers/common/DashboardCard";
import { useAuth } from "../../context/AuthContext";
import { apiGet } from "../../services/apiMethods";
import endpoints from "../../helper/endpoints";
import { useEffect, useState } from "react";
import routes from "../../helper/routes";

type CountType = {
  allDeals?: number;
  allVouchers?: number;
  allPending?: number;
  allActive?: number;
  expireDeals?: number;
  allCount?: number;
  pendingDeals?: number;
  pendingVouchers?: number;
  activeDeals?: number;
  activeVouchers?: number;
  expireVouchers?: number;
  totalCategories?: number;
  totalUsers?: number;
  allExpired?: number;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const isVendor = user?.role === "Vendor";
  const isReviewDeals = user?.permissions?.includes("review_deals");
  const isUserManagement = user?.permissions?.includes("user_management");

  const [counts, setCounts] = useState<CountType>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllCounts = () => {
    setIsLoading(true);

    apiGet({
      endpoint: endpoints.allCount,
      onSuccess: (data: any) => {
        setCounts(data?.data);
        // toast.success(data?.message); // optional
      },
      onFinally: () => {
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    fetchAllCounts();
  }, []);

  return (
    <>
      <PageBreadcrumb hideBackBtn pageTitle="Dashboard" />

      {isVendor && !isUserManagement && !isReviewDeals && (
        <div className="h-[60dvh]">
          <p className="text-base dark:text-white text-black">
            You do not have any permissions to access any section.
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-4 grid-cols-2 md:gap-6 gap-4">
        {((isVendor && isReviewDeals) || !isVendor) && (
          <>
            {/* deals */}
            <>
              <DashboardCard
                title="Pending Deals"
                isLoading={isLoading}
                iconPath="./svgs/new/pendingDeal.svg"
                quantity={counts?.pendingDeals ?? 0}
                href={`${routes?.deal}?status=Inactive&type=In_Store`}
              />
              <DashboardCard
                title="Active Deals"
                isLoading={isLoading}
                iconPath="./svgs/new/activeDeal.svg"
                quantity={counts?.activeDeals ?? 0}
                href={`${routes?.deal}?status=Active&type=In_Store`}
              />
              <DashboardCard
                title="Expire Deals"
                isLoading={isLoading}
                iconPath="./svgs/new/expiredDeal.svg"
                quantity={counts?.expireDeals ?? 0}
                href={`${routes?.deal}?status=Expired&type=In_Store`}
              />
              <DashboardCard
                title="All Deals"
                isLoading={isLoading}
                iconPath="./svgs/deal.svg"
                quantity={counts?.allDeals ?? 0}
                href={`${routes?.deal}?type=In_Store`}
              />
            </>

            {/* vouchers */}
            <>
              <DashboardCard
                title="Pending Vouchers"
                isLoading={isLoading}
                iconPath="./svgs/new/pendingVoucher.svg"
                quantity={counts?.pendingVouchers ?? 0}
                href={`${routes?.deal}?status=Inactive&type=Discount_Only`}
              />
              <DashboardCard
                title="Active Vouchers"
                isLoading={isLoading}
                iconPath="./svgs/new/activeVoucher.svg"
                quantity={counts?.activeVouchers ?? 0}
                href={`${routes?.deal}?status=Active&type=Discount_Only`}
              />
              <DashboardCard
                title="Expire Vouchers"
                isLoading={isLoading}
                iconPath="./svgs/new/expiredVoucher.svg"
                quantity={counts?.expireVouchers ?? 0}
                href={`${routes?.deal}?status=Expired&type=Discount_Only`}
              />
              <DashboardCard
                title="All Vouchers"
                isLoading={isLoading}
                iconPath="./svgs/new/activeVoucher.svg"
                quantity={counts?.allVouchers ?? 0}
                href={`${routes?.deal}?type=Discount_Only`}
              />
            </>

            {/* all pending, all active, all expired, all */}
            <>
              <DashboardCard
                title="Pending All"
                isLoading={isLoading}
                iconPath="./svgs/new/pendingVoucher.svg"
                quantity={counts?.allPending ?? 0}
                href={`${routes?.deal}?status=Inactive`}
              />
              <DashboardCard
                title="Active All"
                isLoading={isLoading}
                iconPath="./svgs/new/activeVoucher.svg"
                quantity={counts?.allActive ?? 0}
                href={`${routes?.deal}?status=Active`}
              />
              <DashboardCard
                title="Expire All"
                isLoading={isLoading}
                iconPath="./svgs/new/expiredVoucher.svg"
                quantity={counts?.allExpired ?? 0}
                href={`${routes?.deal}?status=Expired`}
              />
              <DashboardCard
                title="All"
                isLoading={isLoading}
                iconPath="./svgs/new/activeVoucher.svg"
                quantity={counts?.allCount ?? 0}
                href={`${routes?.deal}`}
              />
            </>
          </>
        )}

        {((isVendor && isUserManagement) || !isVendor) && (
          <DashboardCard
            title="Users"
            isLoading={isLoading}
            iconPath="./svgs/users.svg"
            quantity={counts?.totalUsers ?? 0}
            href={routes?.user}
          />
        )}
      </div>
    </>
  );
}
