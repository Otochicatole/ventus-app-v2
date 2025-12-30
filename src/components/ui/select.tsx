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
                    <label className="text-sm font-semibold text-neutral-300">
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`
                        px-4 py-3
                        bg-neutral-800/50
                        border-2 border-neutral-700/50
                        rounded-lg
                        text-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-white
                        focus:border-transparent
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        cursor-pointer
                        transition-all
                        ${error ? "border-red-500/50 focus:ring-red-500" : ""}
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
                    <span className={`text-xs font-medium ${error ? "text-red-400" : "text-neutral-500"}`}>
                        {error || helperText}
                    </span>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";

export default Select;
