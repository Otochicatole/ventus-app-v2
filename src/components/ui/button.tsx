import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

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
                default: "bg-gray-900 text-white hover:bg-gray-800 shadow-sm",
                primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
                success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
                error: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
                warning: "bg-amber-600 text-white hover:bg-amber-700 shadow-sm",
            },
            outlined: {
                default: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
                primary: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
                success: "border-2 border-green-600 text-green-600 hover:bg-green-50",
                error: "border-2 border-red-600 text-red-600 hover:bg-red-50",
                warning: "border-2 border-amber-600 text-amber-600 hover:bg-amber-50",
            },
            text: {
                default: "text-gray-700 hover:bg-gray-100",
                primary: "text-blue-600 hover:bg-blue-50",
                success: "text-green-600 hover:bg-green-50",
                error: "text-red-600 hover:bg-red-50",
                warning: "text-amber-600 hover:bg-amber-50",
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
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {!loading && startIcon && startIcon}
                {children}
                {endIcon && endIcon}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
