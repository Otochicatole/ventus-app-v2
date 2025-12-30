import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    options?: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, helperText, fullWidth = false, options = [], className = "", children, ...props }, ref) => {
        return (
            <div className={`flex flex-col gap-2 ${fullWidth ? "w-full" : ""}`}>
                {label && (
                    <label className="text-sm font-semibold text-gray-700">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`
                        px-4 py-3
                        bg-white
                        border border-gray-300
                        rounded-xl
                        text-gray-900
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-transparent
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        disabled:bg-gray-50
                        cursor-pointer
                        transition-all
                        ${error ? "border-red-500 focus:ring-red-500" : ""}
                        ${className}
                    `}
                    {...props}
                >
                    {options.length > 0
                        ? options.map((option) => (
                              <option key={option.value} value={option.value}>
                                  {option.label}
                              </option>
                          ))
                        : children}
                </select>
                {(error || helperText) && (
                    <span className={`text-xs font-medium ${error ? "text-red-500" : "text-gray-500"}`}>
                        {error || helperText}
                    </span>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";

export default Select;
