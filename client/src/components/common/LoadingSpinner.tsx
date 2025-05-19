// const LoadingSpinner = () => {
//   return (
//     <div className="flex items-center justify-center">
//       <div className="w-6 h-6 border-4 !border-t-transparent border-gray-900 dark:border-white rounded-full animate-spin"></div>
//     </div>
//   );
// };

// export default LoadingSpinner;

import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const spinner = tv({
  base: "rounded-full animate-spin !border-t-transparent",
  variants: {
    size: {
      sm: "h-4 w-4 border-2",
      md: "h-6 w-6 border-2",
      lg: "h-10 w-10 border-4",
    },
    color: {
      white: "border-white",
      primary: "border-pink",
      secondary: "border-purple-500",
      danger: "border-red-500",
      gray: "border-gray-400",
    },
  },
  defaultVariants: {
    size: "md",
    color: "primary",
  },
});

type SpinnerProps = VariantProps<typeof spinner> & {
  className?: string;
};

const LoadingSpinner: React.FC<SpinnerProps> = ({ size, color, className }) => {
  return (
    <div className={spinner({ size, color, class: className })} role="status" />
  );
};

export default LoadingSpinner;
