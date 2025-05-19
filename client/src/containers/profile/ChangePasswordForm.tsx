import PasswordRequirementsChecklist from "../../components/common/PasswordRequirementsChecklist";
import ComponentCard from "../../components/common/ComponentCard";
import FormikPasswordInput from "../common/FormikPasswordInput";
import Button from "../../components/ui/button/Button";
import { apiPost } from "../../services/apiMethods";
import endpoints from "../../helper/endpoints";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must include uppercase, lowercase, and number"
    )
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), ""], "Passwords must match")
    .required("Confirm password is required"),
});

type PropsType = {};

export default function ChangePasswordForm(props: PropsType) {
  const {} = props;

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (bool: boolean) => void; resetForm: any }
  ) => {
    const payload = {
      old_password: values?.currentPassword,
      password: values?.newPassword,
      password_confirmation: values?.confirmPassword,
    };

    apiPost({
      endpoint: endpoints.changePassword,
      payload,
      onSuccess: (data: any) => {
        toast.success(data?.message);
        resetForm();
      },
      onFinally: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <ComponentCard title="Update Password" className="max-w-2xl mx-auto">
      <Formik
        validateOnBlur={true}
        validateOnChange={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form className="space-y-6">
            <FormikPasswordInput
              name="currentPassword"
              label="Current Password"
            />
            <FormikPasswordInput name="newPassword" label="New Password" />
            <FormikPasswordInput
              name="confirmPassword"
              label="Confirm Password"
            />
            <PasswordRequirementsChecklist password={values.newPassword} />
            <div className="flex justify-center">
              <Button
                size="sm"
                type="submit"
                loading={isSubmitting}
                className="bg-gradient"
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ComponentCard>
  );
}
