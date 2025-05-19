import Button from "../../components/ui/button/Button";
import { Formik, Form, ErrorMessage } from "formik";
import { Modal } from "../../components/ui/modal";
import { IoClose } from "react-icons/io5";
import * as Yup from "yup";
import Label from "../../components/form/Label";
import TextArea from "../../components/form/input/TextArea";
import GradientText from "../../components/common/GradientText";
import endpoints from "../../helper/endpoints";
import { toast } from "react-toastify";
import { DealType } from "../../helper/types";
import { apiPost } from "../../services/apiMethods";

const validationSchema = Yup.object().shape({
  reason: Yup.string()
    .required("Reason is required")
    .min(20, "Reason is too short"),
});

const initialValues = {
  reason: "",
};

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
  selectedDeal?: DealType;
};

const DealEditRequestModal = (props: PropsType) => {
  const { isOpen, onClose, selectedDeal } = props;

  const handleSubmit = async (
    values: { reason: string },
    { setSubmitting }: { setSubmitting: (bool: boolean) => void }
  ) => {
    const payload = { edit_reason: values.reason };

    apiPost({
      endpoint: endpoints.dealEditRequest(selectedDeal?.id ?? ""),
      payload,
      onSuccess: (data: any) => {
        toast.success(data?.message);
        onClose?.();
      },
      onFinally: () => {
        setSubmitting(false);
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
        className="absolute right-2 top-2 w-10 h-10 z-999 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <IoClose />
      </button>
      {/* close button end */}

      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl p-4 bg-white dark:bg-gray-900">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl font-semibold">
            <GradientText>Request Deal Edit</GradientText>
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            To update the details of this deal, please provide a clear
            description of the changes you want to request. Once submitted, an
            admin will review and approve your request.
          </p>
        </div>

        <Formik
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4">
              <div>
                <Label>
                  Reason for Edit <span className="text-error-500">*</span>
                </Label>
                <TextArea
                  rows={6}
                  value={values.reason}
                  onChange={(value) => setFieldValue("reason", value)}
                  placeholder="Describe the changes you need (e.g., update the discount from 10% to 15%, change the deal title, etc.)"
                />
                <ErrorMessage
                  name="reason"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              <div className="flex justify-end items-center gap-4">
                <Button
                  size="sm"
                  onClick={onClose}
                  className="bg-gray-100 transition-colors hover:bg-gray-200 !text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:!text-white"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  loading={isSubmitting}
                  className="bg-gradient"
                >
                  {isSubmitting ? "Submitting..." : " Submit Request"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default DealEditRequestModal;
