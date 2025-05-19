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

const FormikFormNumField = (props: PropsType) => {
  const { name, label, isRequired, placeholder, hideErrorMsg, ...rest } = props;

  return (
    <Field name={name}>
      {({ field, form }: any) => (
        <div className="w-full">
          {label && (
            <Label>
              {label} {isRequired && <span className="text-error-500">*</span>}
            </Label>
          )}
          <div className="relative">
            <Input
              {...field}
              type="text" // Force text so we can control input
              inputMode="numeric" // Mobile numeric keyboard
              placeholder={placeholder}
              onChange={(e) => {
                const val = e.target.value;

                // Allow only positive integers
                if (/^\d*$/.test(val)) {
                  form.setFieldValue(name, val);
                }
              }}
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
      )}
    </Field>
  );
};

export default FormikFormNumField;
