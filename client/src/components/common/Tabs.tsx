import { useState, useEffect } from "react";

type OptionType = {
  label: string;
  value: string;
};

type PropsType = {
  value: string;
  options: OptionType[];
  onChange?: (value: string) => void; // Optional callback when tab changes
};

const Tabs: React.FC<PropsType> = (props) => {
  const { value, options, onChange } = props;

  const [selected, setSelected] = useState<string>(value || "");

  // Update the selected state when the `value` prop changes.
  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelectTab = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className="flex items-center rounded-lg bg-white dark:bg-gray-800 p-2 space-x-2">
      {options.map(({ label, value: optionValue }) => {
        const isActive = selected === optionValue;

        return (
          <button
            role="tab"
            key={optionValue}
            type="button"
            onClick={() => handleSelectTab(optionValue)}
            aria-selected={isActive}
            className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
              ${
                isActive
                  ? "text-white bg-gradient shadow"
                  : "text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              }
              hover:text-gray-900 dark:hover:text-white
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
