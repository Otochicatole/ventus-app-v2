import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "contained" | "outlined" | "text";
    color?: "primary" | "success" | "error" | "warning" | "default";
    size?: "small" | "medium" | "large";
    fullWidth?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = "contained",
            color = "primary",
            size = "medium",
            fullWidth = false,
            startIcon,
            endIcon,
            loading = false,
            className = "",
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]";

        const sizeStyles = {
            small: "px-4 py-2 text-sm gap-2 min-h-[36px]",
            medium: "px-6 py-3 text-base gap-2.5 min-h-[44px]",
            large: "px-8 py-4 text-lg gap-3 min-h-[52px]",
        };

        const variantStyles = {
            contained: {
                default: "bg-neutral-700 text-white hover:bg-neutral-600 shadow-md",
                primary: "bg-white text-black hover:bg-neutral-100 shadow-md",
                success: "bg-green-600 text-white hover:bg-green-700 shadow-md",
                error: "bg-red-600 text-white hover:bg-red-700 shadow-md",
                warning: "bg-amber-600 text-black hover:bg-amber-700 shadow-md",
            },
            outlined: {
                default: "border-2 border-neutral-600 text-neutral-300 hover:bg-neutral-800/50",
                primary: "border-2 border-white text-white hover:bg-white/10",
                success: "border-2 border-green-500 text-green-400 hover:bg-green-500/10",
                error: "border-2 border-red-500 text-red-400 hover:bg-red-500/10",
                warning: "border-2 border-amber-500 text-amber-400 hover:bg-amber-500/10",
            },
            text: {
                default: "text-neutral-300 hover:bg-neutral-800/50",
                primary: "text-white hover:bg-white/10",
                success: "text-green-400 hover:bg-green-500/10",
                error: "text-red-400 hover:bg-red-500/10",
                warning: "text-amber-400 hover:bg-amber-500/10",
            },
        };

        const widthStyle = fullWidth ? "w-full" : "";

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant][color]} ${widthStyle} ${className}`}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {!loading && startIcon && startIcon}
                {children}
                {endIcon && endIcon}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
