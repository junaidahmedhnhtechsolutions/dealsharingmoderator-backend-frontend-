import { useState } from "react";
import { Field, ErrorMessage } from "formik";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { GoEye, GoEyeClosed } from "react-icons/go";

type PropsType = {
  name: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  [key: string]: any;
};

const FormikPasswordInput = ({
  name,
  label = "Password",
  isRequired,
  placeholder,
  ...rest
}: PropsType) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {label && (
        <Label>
          {label} {isRequired && <span className="text-error-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <Field
          as={Input}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder || "********"}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 cursor-pointer"
        >
          {showPassword ? (
            <GoEye className="fill-gray-500 dark:fill-gray-400 size-5" />
          ) : (
            <GoEyeClosed className="fill-gray-500 dark:fill-gray-400 size-5" />
          )}
        </button>
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-xs mt-1"
      />
    </div>
  );
};

export default FormikPasswordInput;
