import FormikPasswordInput from "../../containers/common/FormikPasswordInput";
import FormikFormField from "../../containers/common/FormikFormField";
import { apiPost } from "../../services/apiMethods";
import { Link, useNavigate } from "react-router";
import endpoints from "../../helper/endpoints";
import routes from "../../helper/routes";
import Button from "../ui/button/Button";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  // password: Yup.string().required("Password is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    ),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
};

export default function SignUpForm() {
  const navigate = useNavigate();

  const handleSignUp = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (bool: boolean) => void }
  ) => {
    const payload = {
      name: values?.name,
      email: values.email,
      password: values.password,
    };

    apiPost({
      endpoint: endpoints.register,
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
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-gradient mb-2 font-semibold text-title-sm sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <Formik
              validateOnBlur={true}
              validateOnChange={true}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSignUp}
            >
              {({ isSubmitting }) => {
                return (
                  <Form className="space-y-6">
                    <FormikFormField
                      isRequired
                      name="name"
                      label="Name"
                      placeholder="Enter your name"
                    />
                    <FormikFormField isRequired name="email" label="Email" />
                    <FormikPasswordInput
                      isRequired
                      name="password"
                      label="Password"
                    />

                    <Button
                      size="sm"
                      type="submit"
                      className="w-full bg-gradient"
                      loading={isSubmitting}
                    >
                      {isSubmitting ? "Signing up..." : "Sign Up"}
                    </Button>
                  </Form>
                );
              }}
            </Formik>

            <p className="mt-5 text-sm font-normal text-center sm:text-start text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to={routes.signin}
                className="text-transparent bg-gradient bg-clip-text font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
