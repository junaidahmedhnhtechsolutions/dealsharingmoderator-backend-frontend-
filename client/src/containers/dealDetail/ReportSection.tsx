import GradientText from "../../components/common/GradientText";
import { DealType, ReportType } from "../../helper/types";
import { apiDelete } from "../../services/apiMethods";
import endpoints from "../../helper/endpoints";
import { GoTrash } from "react-icons/go";
import { toast } from "react-toastify";

type PropsType = {
  deal: DealType;
  fetchDealById: () => void;
};

const ReportSection = ({ deal, fetchDealById }: PropsType) => {
  const handleDeleteReport = async (report: ReportType) => {
    apiDelete({
      endpoint: endpoints.deleteReport(report?.id ?? ""),
      onSuccess: (data: any) => {
        toast.success(data?.message);
        fetchDealById();
      },
    });
  };

  return (
    <div>
      <h3 className="mb-4 font-semibold text-2xl text-gray-800 dark:text-white/90">
        <GradientText>Reports</GradientText>
      </h3>
      <div className="space-y-4">
        {deal?.reported_deals?.map((item, index) => {
          const isLastIndex = deal?.reported_deals?.length === index + 1;
          return (
            <>
              <div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-400">
                  <img
                    alt="User"
                    src="/images/userPlaceholder.png"
                    className="rounded-full h-11 w-11"
                  />

                  <div className="flex flex-col items-start">
                    <span className="block mr-1 font-medium text-theme-sm">
                      {item?.users?.username}
                    </span>
                    <span className="block mr-1 font-medium text-theme-sm">
                      {item?.users?.email}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-base text-gray-800 dark:text-white/80">
                  {item?.reason_for_report}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleDeleteReport(item)}
                    className="flex items-center gap-1 text-base dark:text-white/50 hover:text-pink dark:hover:text-pink"
                  >
                    <GoTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
              {!isLastIndex && (
                <div className="border-b border-gray-200 dark:border-gray-800" />
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default ReportSection;
