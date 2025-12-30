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
                    <label className="text-sm font-semibold text-slate-300">
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
                        px-4 py-3
                        bg-slate-800/50
                        border-2 border-slate-700/50
                        rounded-xl
                        text-white
                        placeholder:text-slate-500
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-transparent
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        transition-all
                        backdrop-blur-sm
                        ${error ? "border-red-500/50 focus:ring-red-500" : ""}
                        ${className}
                    `}
                    {...props}
                />
                {(error || helperText) && (
                    <span className={`text-xs font-medium ${error ? "text-red-400" : "text-slate-500"}`}>
                        {error || helperText}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
