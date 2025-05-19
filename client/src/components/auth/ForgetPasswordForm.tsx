import FormikFormField from "../../containers/common/FormikFormField";
import endpoints from "../../helper/endpoints";
import Button from "../ui/button/Button";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { apiPost } from "../../services/apiMethods";
import { useNavigate } from "react-router";
import routes from "../../helper/routes";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

const initialValues = {
  email: "",
};

export default function ForgetPasswordForm() {
  const navigate = useNavigate();

  const handleForgetPassword = async (
    values: { email: string },
    { setSubmitting }: { setSubmitting: (bool: boolean) => void }
  ) => {
    const payload = { email: values.email };

    apiPost({
      endpoint: endpoints.forgetPassword,
      payload,
      onSuccess: (data: any) => {
        toast.success(data?.message);
        navigate(routes.changePassword);
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
              Forget Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email address and we’ll send you a one-time password
              (OTP) to reset your password.
            </p>
          </div>
          <div>
            <Formik
              validateOnBlur={true}
              validateOnChange={true}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleForgetPassword}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <FormikFormField isRequired name="email" label="Email" />

                  <Button
                    size="sm"
                    type="submit"
                    className="w-full bg-gradient"
                    loading={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send"}
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
