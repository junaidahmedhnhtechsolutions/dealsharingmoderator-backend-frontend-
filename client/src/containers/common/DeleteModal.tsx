import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { IoClose } from "react-icons/io5";

const DeleteModal = () => {
  return (
    <Modal
      isOpen
      onClose={() => {}}
      showCloseButton={false}
      className="max-w-sm m-4"
    >
      {/* close button start */}
      <button
        onClick={() => {}}
        className="absolute right-2 top-2 w-10 h-10 z-999 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <IoClose />
      </button>
      {/* close button end */}

      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl p-4 bg-white dark:bg-gray-900">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            Edit Personal Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button size="sm">Delete</Button>
          <Button size="sm">Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
