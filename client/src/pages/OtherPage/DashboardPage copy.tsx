import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DashboardCard from "../../containers/common/DashboardCard copy";
import endpoints from "../../helper/endpoints";
import { TbTagStarred } from "react-icons/tb";
import { useEffect, useState } from "react";
import routes from "../../helper/routes";
import { useAuth } from "../../context/AuthContext";
import { apiGet } from "../../services/apiMethods";

type CountType = {
  activeDeals?: number;
  activeVouchers?: number;
  pendingDeals?: number;
  pendingVouchers?: number;
  expireDeals?: number;
  expireVouchers?: number;
  totalCategories?: number;
  totalUsers?: number;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const isVendor = user?.role === "Vendor";
  const isReviewDeals = user?.permissions?.includes("review_deals");
  const isUserManagement = user?.permissions?.includes("user_management");

  const [counts, setCounts] = useState<CountType>({});
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
      <PageBreadcrumb hideBackBtn pageTitle="Dashboard" />

      {isVendor && !isUserManagement && !isReviewDeals && (
        <div className="">
          <p className="text-base dark:text-white text-black">
            You do not have any permissions to access any section.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-6 gap-4">
        {((isVendor && isUserManagement) || !isVendor) && (
          <DashboardCard
            title="Users"
            isLoading={isLoading}
            icon={<TbTagStarred />}
            iconPath="./svgs/users.svg"
            quantity={counts?.totalUsers ?? 0}
            href={routes?.user}
          />
        )}

        {((isVendor && isReviewDeals) || !isVendor) && (
          <>
            <DashboardCard
              title="Active Deals"
              isLoading={isLoading}
              icon={<TbTagStarred />}
              iconPath="./svgs/new/activeDeal.svg"
              quantity={counts?.activeDeals ?? 0}
              href={`${routes?.deal}?status=Active&type=In_Store`}
            />
            <DashboardCard
              title="Active Vouchers"
              isLoading={isLoading}
              icon={<TbTagStarred />}
              iconPath="./svgs/new/activeVoucher.svg"
              quantity={counts?.activeVouchers ?? 0}
              href={`${routes?.deal}?status=Active&type=Discount_Only`}
            />
            <DashboardCard
              title="Pending Deals"
              isLoading={isLoading}
              icon={<TbTagStarred />}
              iconPath="./svgs/new/pendingDeal.svg"
              quantity={counts?.pendingDeals ?? 0}
              href={`${routes?.deal}?status=Pending&type=In_Store`}
            />
            <DashboardCard
              title="Pending Vouchers"
              isLoading={isLoading}
              icon={<TbTagStarred />}
              iconPath="./svgs/new/pendingVoucher.svg"
              quantity={counts?.pendingVouchers ?? 0}
              href={`${routes?.deal}?status=Pending&type=Discount_Only`}
            />
            <DashboardCard
              title="Expire Deals"
              isLoading={isLoading}
              icon={<TbTagStarred />}
              iconPath="./svgs/new/expiredDeal.svg"
              quantity={counts?.expireDeals ?? 0}
              href={`${routes?.deal}?status=Expired&type=In_Store`}
            />
            <DashboardCard
              title="Expire Vouchers"
              isLoading={isLoading}
              icon={<TbTagStarred />}
              iconPath="./svgs/new/expiredVoucher.svg"
              quantity={counts?.expireVouchers ?? 0}
              href={`${routes?.deal}?status=Expired&type=Discount_Only`}
            />
          </>
        )}
      </div>
    </>
  );
}
