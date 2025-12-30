import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, fullWidth = false, className = "", ...props }, ref) => {
        return (
            <div className={`flex flex-col gap-2 ${fullWidth ? "w-full" : ""}`}>
                {label && (
                    <label className="text-sm font-semibold text-gray-700">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    suppressHydrationWarning
                    className={`
                        px-4 py-3
                        bg-white
                        border border-gray-300
                        rounded-xl
                        text-gray-900
                        placeholder:text-gray-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-transparent
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        disabled:bg-gray-50
                        transition-all
                        ${error ? "border-red-500 focus:ring-red-500" : ""}
                        ${className}
                    `}
                    {...props}
                />
                {(error || helperText) && (
                    <span className={`text-xs font-medium ${error ? "text-red-500" : "text-gray-500"}`}>
                        {error || helperText}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
