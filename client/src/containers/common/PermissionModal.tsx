import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import endpoints from "../../helper/endpoints";
import { UserType } from "../../helper/types";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { apiGet, apiPost } from "../../services/apiMethods";

const dealTypes = [
  { label: "Review Deals", value: "review_deals" },
  { label: "Review comments", value: "review_comments" },
  { label: "User management", value: "user_management" },
];

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
  selectedUser?: UserType;
  onSuccess?: Function;
};

const validationSchema = Yup.object().shape({
  // permissions: Yup.object()
  //   .test(
  //     "at-least-one-true",
  //     "Please select at least one permission.",
  //     (value) => Object.values(value ?? {}).some((v) => v === true)
  //   )
  //   .required(),
  permissions: Yup.object(),
});

const PermissionModal = ({
  isOpen,
  onClose,
  onSuccess,
  selectedUser,
}: PropsType) => {
  const [loading, setLoading] = useState(false);
  const [givenPermissions, setGivenPermissions] = useState<string[]>([]);

  const allPermissions = ["review_deals", "review_comments", "user_management"];

  const initialValues = {
    permissions: allPermissions.reduce((acc, key) => {
      acc[key] = givenPermissions.includes(key);
      return acc;
    }, {} as Record<string, boolean>),
  };

  // const initialValues = {
  //   permissions: {
  //     review_deals: false,
  //     review_comments: false,
  //     user_management: false,
  //   },
  // };

  const fetchModeratorById = async () => {
    setLoading(true);

    apiGet({
      endpoint: endpoints.getModeratorById(selectedUser?.id ?? ""),
      onSuccess: (data: any) => {
        setGivenPermissions(data?.data?.permissions);
      },
      onFinally: () => {
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    fetchModeratorById();
  }, []);

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: any
  ) => {
    const permissions = Object.entries(values.permissions)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    const payload = { permissions };

    apiPost({
      endpoint: endpoints.updatePermissions(selectedUser?.id ?? ""),
      payload,
      onSuccess: (data: any) => {
        toast.success(data?.message);
        onSuccess?.();
        onClose();
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
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-2 top-2 w-10 h-10 z-999 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <IoClose />
      </button>

      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl p-4 bg-white dark:bg-gray-900">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl font-semibold bg-gradient text-transparent bg-clip-text">
            {/* Assign Moderator Role to User */}
            Update Permissions
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            You're about to assign moderator permissions to this user. Please
            choose which moderation abilities you want to grant. You can update
            or remove these permissions anytime.
          </p>
        </div>
        <div className="px-2">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner />
            </div>
          ) : (
            <Formik
              validateOnBlur={true}
              validateOnChange={true}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                  <div className="flex flex-col gap-4">
                    {dealTypes.map((item) => (
                      <Checkbox
                        key={item.value}
                        label={item.label}
                        // @ts-ignore
                        checked={!!values.permissions[item.value]}
                        disabled={
                          item.value === "review_comments" &&
                          !values.permissions.review_deals
                        }
                        onChange={(checked) => {
                          setFieldValue(`permissions.${item.value}`, checked);

                          // If review_deals is unchecked, also uncheck review_comments
                          if (item.value === "review_deals" && !checked) {
                            setFieldValue("permissions.review_comments", false);
                          }
                        }}
                      />
                    ))}
                  </div>
                  <ErrorMessage
                    name="permissions"
                    render={(msg) => (
                      <p className="mt-1.5 text-sm text-red-500">{msg}</p>
                    )}
                  />

                  <div className="flex justify-end items-center gap-4 mt-6">
                    <Button
                      size="sm"
                      type="button"
                      onClick={onClose}
                      className="bg-gray-100 transition-colors hover:bg-gray-200 !text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:!text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient"
                      type="submit"
                      loading={isSubmitting}
                    >
                      {isSubmitting ? "Assigning..." : "Done"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PermissionModal;
