import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface BaseButtonProps {
    variant?: "contained" | "outlined" | "text";
    color?: "primary" | "success" | "error" | "warning" | "default";
    size?: "small" | "medium" | "large";
    fullWidth?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    loading?: boolean;
    href?: string;
}

export type ButtonProps = BaseButtonProps &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps>;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
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
            href,
            ...props
        },
        ref
    ) => {
        const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3a60] focus-visible:ring-offset-1 select-none";

        const sizeStyles = {
            small: "px-3.5 py-1.5 text-xs gap-1.5 min-h-[34px]",
            medium: "px-5 py-2.5 text-sm gap-2 min-h-[40px]",
            large: "px-7 py-3.5 text-base gap-2.5 min-h-[48px]",
        };

        const variantStyles = {
            contained: {
                default: "bg-stone-900 text-white hover:bg-stone-800 shadow-sm",
                primary: "bg-[#0b3a60] text-white hover:bg-[#072844] shadow-sm",
                success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
                error: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
                warning: "bg-amber-600 text-white hover:bg-amber-700 shadow-sm",
            },
            outlined: {
                default: "border border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400",
                primary: "border border-[#0b3a60] text-[#0b3a60] hover:bg-blue-50/50",
                success: "border border-emerald-600 text-emerald-700 hover:bg-emerald-50",
                error: "border border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400",
                warning: "border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400",
            },
            text: {
                default: "text-stone-700 hover:bg-stone-100",
                primary: "text-[#0b3a60] hover:bg-blue-50",
                success: "text-emerald-700 hover:bg-emerald-50",
                error: "text-red-600 hover:bg-red-50",
                warning: "text-amber-700 hover:bg-amber-50",
            },
        };

        const widthStyle = fullWidth ? "w-full" : "";
        const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant][color]} ${widthStyle} ${className}`;

        const innerContent = (
            <>
                {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                {!loading && startIcon && <span className="shrink-0">{startIcon}</span>}
                {children}
                {endIcon && <span className="shrink-0">{endIcon}</span>}
            </>
        );

        if (href) {
            return (
                <Link
                    href={href}
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    className={combinedClassName}
                    {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
                >
                    {innerContent}
                </Link>
            );
        }

        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                className={combinedClassName}
                disabled={disabled || loading}
                {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
            >
                {innerContent}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
