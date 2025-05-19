import { GoTrash } from "react-icons/go";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { CommentType, ReportType } from "../../helper/types";
import { apiDelete } from "../../services/apiMethods";
import endpoints from "../../helper/endpoints";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
  selectedComment?: CommentType;
};

const CommentReportsModal = (props: PropsType) => {
  const { isOpen, onClose, selectedComment } = props;

  const handleDeleteReport = async (report: ReportType) => {
    apiDelete({
      endpoint: endpoints.deleteCommentReport({
        commentId: selectedComment?.id ?? "",
        reportId: report?.id ?? "",
      }),
      onSuccess: (data: any) => {
        toast.success(data?.message);
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-lg m-4"
    >
      {/* close button start */}
      <button
        onClick={onClose}
        className="absolute right-2 top-2 sm:w-10 sm:h-10 w-8 h-8 z-999 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <IoClose />
      </button>
      {/* close button end */}

      <div className="max-h-[80vh] no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900">
        <div className="sm:px-6 p-4 sm:py-4 py-3 sticky top-0 bg-white dark:bg-gray-900">
          <h4 className="text-xl font-semibold bg-gradient text-transparent bg-clip-text">
            Comment Reports
          </h4>
        </div>

        <div className="sm:px-6 p-4 space-y-4">
          {selectedComment?.reported_comments?.map((item) => (
            <div
              key={item.id}
              className="relative w-full py-2 sm:px-4 px-2 rounded-lg bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 !rounded-full w-10 h-10 flex items-center justify-center !p-1"
                onClick={() => handleDeleteReport(item)}
              >
                <GoTrash />
              </Button>
              <div>
                <h6 className="font-medium text-base text-black dark:text-white">
                  {item?.report?.replace(/_/g, " ")}
                </h6>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item?.reason_for_report ?? "Description not provided"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default CommentReportsModal;
