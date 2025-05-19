import Input from "../../components/form/input/InputField";
import { ErrorMessage, Field } from "formik";
import Label from "../../components/form/Label";

type PropsType = {
  name: string;
  type?: string;
  label?: string;
  isRequired?: boolean;
  hideErrorMsg?: boolean;
  placeholder?: string;
  [key: string]: any;
};

const FormikFormField = (props: PropsType) => {
  const {
    name,
    label,
    type = "text",
    isRequired,
    placeholder,
    hideErrorMsg,
    ...rest
  } = props;

  return (
    <div className="w-full">
      {label && (
        <Label>
          {label} {isRequired && <span className="text-error-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <Field
          as={Input}
          name={name}
          type={type}
          placeholder={placeholder}
          {...rest}
        />
        {!hideErrorMsg && (
          <ErrorMessage
            name={name}
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        )}
      </div>
    </div>
  );
};

export default FormikFormField;
