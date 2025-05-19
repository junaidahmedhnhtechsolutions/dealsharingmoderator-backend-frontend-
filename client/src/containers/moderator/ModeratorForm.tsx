import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { UserType } from "../../helper/types";
import { toast } from "react-toastify";
import FormikPasswordInput from "../common/FormikPasswordInput";
import FormikFormField from "../common/FormikFormField";
import endpoints from "../../helper/endpoints";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PasswordRequirementsChecklist from "../../components/common/PasswordRequirementsChecklist";
import { apiPost } from "../../services/apiMethods";

// ✅ Validation Schema
const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
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

const editValidationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must include uppercase, lowercase, and number"
    )
    .notRequired(),

  confirmPassword: Yup.string().when("password", {
    is: (val: string) => val && val.length > 0,
    then: () =>
      Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    otherwise: () => Yup.string().notRequired(),
  }),
});

type PropsType = {
  setModerators: Function;
  fetchModerators: Function;
  toggleModeratorForm: () => void;
  selectedModerator: UserType;
  setSelectedModerator: Function;
};

export default function ModeratorForm(props: PropsType) {
  const {
    fetchModerators,
    selectedModerator,
    toggleModeratorForm,
    setSelectedModerator,
  } = props;

  const isForEdit = selectedModerator?.id;

  const initialValues = {
    email: selectedModerator?.email ?? "",
    username: selectedModerator?.username ?? "",
    lastName: selectedModerator?.last_name ?? "",
    firstName: selectedModerator?.first_name ?? "",
    password: "",
    confirmPassword: "",
  };

  const handleEditModerator = async (values: typeof initialValues) => {
    const payload = {
      username: values.username.trim(),
      first_name: values.firstName.trim(),
      last_name: values.lastName.trim(),
      email: values.email.trim(),
      ...(values.password ? { password: values.password } : {}),
    };

    apiPost({
      endpoint: endpoints.updateModerator(selectedModerator?.id ?? ""),
      payload,
      onSuccess: (data: any) => {
        toast.success(data?.message);
        fetchModerators?.();
        toggleModeratorForm();
      },
    });

    setSelectedModerator({});
  };

  const handleCreateModerator = async (values: typeof initialValues) => {
    const payload = {
      username: values.username.trim(),
      first_name: values.firstName.trim(),
      last_name: values.lastName.trim(),
      email: values.email.trim(),
      password: values.password,
    };

    apiPost({
      endpoint: endpoints.createModerator,
      payload,
      onSuccess: (data: any) => {
        toast.success(data?.message);
        fetchModerators?.();
        toggleModeratorForm();
      },
    });
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (bool: boolean) => void }
  ) => {
    try {
      if (isForEdit) {
        await handleEditModerator(values);
      } else {
        await handleCreateModerator(values);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentCard
      title={`${isForEdit ? "Edit" : "Create"} Moderator`}
      className="max-w-2xl mx-auto"
    >
      <Formik
        validateOnBlur={true}
        validateOnChange={true}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={isForEdit ? editValidationSchema : validationSchema}
      >
        {({ values, isSubmitting }) => (
          <Form className="sm:space-y-6 space-y-4">
            <div className="flex gap-x-2 gap-y-4 sm:flex-row flex-col">
              <FormikFormField isRequired name="firstName" label="First Name" />
              <FormikFormField isRequired name="lastName" label="Last Name" />
            </div>

            <div className="flex gap-x-2 gap-y-4 sm:flex-row flex-col">
              <FormikFormField isRequired name="username" label="Username" />
              <FormikFormField isRequired name="email" label="Email" />
            </div>

            <div className="flex gap-x-2 gap-y-4 sm:flex-row flex-col">
              <FormikPasswordInput
                isRequired={!isForEdit}
                name="password"
                label="Password"
              />
              <FormikPasswordInput
                isRequired={!isForEdit}
                name="confirmPassword"
                label="Confirm Password"
              />
            </div>

            <PasswordRequirementsChecklist password={values.password} />

            <div className="flex justify-center">
              <Button
                size="sm"
                type="submit"
                loading={isSubmitting}
                className="bg-gradient"
              >
                {isForEdit
                  ? isSubmitting
                    ? "Editing..."
                    : "Edit Moderator"
                  : isSubmitting
                  ? "Creating..."
                  : "Create Moderator"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ComponentCard>
  );
}
