import ComponentCard from "../../components/common/ComponentCard";
import FormikFormField from "../common/FormikFormField";
import Button from "../../components/ui/button/Button";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import endpoints from "../../helper/endpoints";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { apiPost } from "../../services/apiMethods";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
});

type PropsType = {};

export default function PersonalInfoForm(props: PropsType) {
  const {} = props;

  const { user, updateUser } = useAuth();

  const initialValues = {
    username: user?.username ?? "",
    firstName: user?.first_name ?? "",
    lastName: user?.last_name ?? "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (bool: boolean) => void }
  ) => {
    const payload = {
      username: values?.username ?? "",
      first_name: values?.firstName ?? "",
      last_name: values?.lastName ?? "",
    };

    apiPost({
      endpoint: endpoints.updateProfile(user?.id ?? ""),
      payload,
      onSuccess: (data: any) => {
        updateUser(data?.user);
        toast.success(data?.message);
      },
      onFinally: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <ComponentCard title="Personal Information" className="max-w-2xl mx-auto">
      <Formik
        validateOnBlur={true}
        validateOnChange={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div className="flex gap-x-2 gap-y-4 sm:flex-row flex-col">
              <FormikFormField
                name="firstName"
                label="First Name"
                placeholder="John"
              />
              <FormikFormField
                name="lastName"
                label="Last Name"
                placeholder="Doe"
              />
            </div>
            <FormikFormField
              name="username"
              label="Username"
              placeholder="john-doe"
            />

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
