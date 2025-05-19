import FormikPasswordInput from "../../containers/common/FormikPasswordInput";
import endpoints from "../../helper/endpoints";
import { useNavigate } from "react-router";
import routes from "../../helper/routes";
import Button from "../ui/button/Button";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import PasswordRequirementsChecklist from "../common/PasswordRequirementsChecklist";
import FormikFormField from "../../containers/common/FormikFormField";
import { apiPost } from "../../services/apiMethods";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  otp: Yup.string().required("Otp is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must include uppercase, lowercase, and number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const initialValues = {
  otp: "",
  password: "",
  confirmPassword: "",
};

export default function ChangePasswordForm() {
  const navigate = useNavigate(); // Get auth status

  const handleLogin = async (
    values: { otp: string; password: string; confirmPassword: string },
    { setSubmitting }: { setSubmitting: (bool: boolean) => void }
  ) => {
    const payload = {
      token: values.otp,
      password: values.password,
      password_confirmation: values.confirmPassword,
    };

    apiPost({
      endpoint: endpoints.resetPassword,
      payload,
      onSuccess: (data: any) => {
        toast.success(data?.message);
        navigate(routes.signin);
      },
      onFinally: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-gradient mb-2 font-semibold text-title-sm sm:text-title-md">
              Change Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your new password below to update your account credentials.
            </p>
          </div>
          <div>
            <Formik
              validateOnBlur={true}
              validateOnChange={true}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ values, isSubmitting }) => (
                <Form className="space-y-6">
                  <FormikFormField isRequired name="otp" label="OTP" />
                  <FormikPasswordInput
                    isRequired
                    name="password"
                    label="Password"
                  />
                  <FormikPasswordInput
                    isRequired
                    name="confirmPassword"
                    label="Confirm Password"
                  />
                  <PasswordRequirementsChecklist password={values.password} />
                  <Button
                    size="sm"
                    type="submit"
                    className="w-full bg-gradient"
                    loading={isSubmitting}
                  >
                    {isSubmitting ? "Changing Password..." : "Change Password"}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
