import { getPasswordCriteria } from "../../helper/utils";

type PropsType = {
  password: string;
};

const PasswordRequirementsChecklist = (props: PropsType) => {
  const { password } = props;

  const { digit, length, uppercase, lowercase } = getPasswordCriteria(password);

  return (
    <div className="text-sm text-gray-600 space-y-1 pl-1">
      <h3 className="dark:text-white text-black">Password Requirements</h3>
      <p className={lowercase ? "text-green-600" : ""}>
        {lowercase ? "✓" : "•"} At least one lowercase letter
      </p>
      <p className={uppercase ? "text-green-600" : ""}>
        {uppercase ? "✓" : "•"} At least one uppercase letter
      </p>
      <p className={digit ? "text-green-600" : ""}>
        {digit ? "✓" : "•"} At least one digit
      </p>
      <p className={length ? "text-green-600" : ""}>
        {length ? "✓" : "•"} At least 8 characters in length
      </p>
    </div>
  );
};

export default PasswordRequirementsChecklist;
