import React, { forwardRef, ReactElement } from "react";
import { useTheme } from "../../../context/ThemeContext";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startContent?: ReactElement | string;
  endContent?: ReactElement | string;
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { theme } = useTheme();

  const {
    type = "text",
    id,
    name,
    placeholder,
    value,
    onChange,
    className = "",
    min,
    max,
    step,
    disabled = false,
    success = false,
    error = false,
    hint,
    endContent,
    startContent,
    ...rest
  } = props;

  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${
    theme === "dark" ? "dateInputDark" : "dateInput"
  } ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800`;
  }

  // Adjust padding if start or end content exists
  if (startContent) inputClasses += " pl-10";
  if (endContent) inputClasses += " pr-10";

  return (
    <div className="relative">
      {startContent && (
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center text-gray-500 dark:text-gray-400 text-sm">
          {startContent}
        </span>
      )}

      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
        {...rest}
      />

      {endContent && (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center text-gray-500 dark:text-gray-400 text-sm">
          {endContent}
        </span>
      )}

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
