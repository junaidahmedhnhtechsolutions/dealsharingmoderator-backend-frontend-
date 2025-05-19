import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { DealType } from "../../helper/types";
import { IoClose } from "react-icons/io5";

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
  selectedDeal?: DealType;
};

const DealEditRequestReasonModal = (props: PropsType) => {
  const { isOpen, onClose, selectedDeal } = props;

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
        className="absolute right-2 top-2 w-10 h-10 z-999 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <IoClose />
      </button>
      {/* close button end */}

      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl p-4 bg-white dark:bg-gray-900">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl font-semibold bg-gradient text-transparent bg-clip-text">
            Deal Edit Request Reason
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {selectedDeal?.edit_reason}
          </p>
        </div>

        <div className="flex justify-end items-center gap-4">
          <Button
            size="sm"
            onClick={onClose}
            className="bg-gray-100 transition-colors hover:bg-gray-200 !text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:!text-white"
          >
            Cancel
          </Button>
          <Button size="sm" className="bg-gradient" onClick={onClose}>
            Okay
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DealEditRequestReasonModal;
