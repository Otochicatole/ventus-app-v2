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
            <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
                {label && (
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    suppressHydrationWarning
                    className={`
                        px-3.5 py-2.5
                        bg-white
                        border border-stone-300
                        rounded-lg
                        text-sm
                        text-stone-900
                        placeholder:text-stone-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#0b3a60]
                        focus:border-transparent
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        disabled:bg-stone-50
                        transition-all duration-150
                        ${error ? "border-red-500 focus:ring-red-500" : ""}
                        ${className}
                    `}
                    {...props}
                />
                {(error || helperText) && (
                    <span className={`text-xs font-medium ${error ? "text-red-500" : "text-stone-500"}`}>
                        {error || helperText}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
