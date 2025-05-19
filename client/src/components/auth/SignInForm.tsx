import FormikPasswordInput from "../../containers/common/FormikPasswordInput";
import FormikFormField from "../../containers/common/FormikFormField";
import { getUpdatedVendorOnly } from "../../helper/utils";
import { useAuth } from "../../context/AuthContext";
import endpoints from "../../helper/endpoints";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import routes from "../../helper/routes";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import { Link } from "react-router";
import * as Yup from "yup";
import { apiPost } from "../../services/apiMethods";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  rememberMe: Yup.boolean(),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const getInitialValues = () => {
  const savedEmail = localStorage.getItem("rememberedEmail");
  return {
    email: savedEmail || "",
    password: "",
    rememberMe: !!savedEmail,
  };
};

export default function SignInForm() {
  const { login } = useAuth(); // Get auth status

  const handleLogin = async (
    values: { email: string; password: string; rememberMe: boolean },
    { setSubmitting }: { setSubmitting: (bool: boolean) => void }
  ) => {
    const payload = { email: values.email, password: values.password };

    if (values.rememberMe) {
      localStorage.setItem("rememberedEmail", values.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    apiPost({
      endpoint: endpoints.login,
      payload,
      onSuccess: (data: any) => {
        toast.success(data?.message || "Login successful!");
        login(data.token, getUpdatedVendorOnly(data?.data));
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
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <Formik
              validateOnBlur
              validateOnChange
              initialValues={getInitialValues()}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form className="space-y-6">
                  <FormikFormField isRequired name="email" label="Email" />
                  <FormikPasswordInput
                    isRequired
                    name="password"
                    label="Password"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={values.rememberMe}
                        onChange={(val) => setFieldValue("rememberMe", val)}
                      />
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Remember Me
                      </span>
                    </div>
                    <Link
                      to={routes.resetPassword}
                      className="text-sm font-normal text-gray-700 dark:text-gray-400"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    size="sm"
                    type="submit"
                    className="w-full bg-gradient"
                    loading={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
          {/* <p className="mt-5 text-sm font-normal text-center sm:text-start text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to={routes.signup}
              className="text-transparent bg-gradient bg-clip-text font-medium"
            >
              Sign up
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}
