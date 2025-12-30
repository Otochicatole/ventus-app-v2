import { HTMLAttributes } from "react";
import { X } from "lucide-react";

interface ChipProps extends HTMLAttributes<HTMLDivElement> {
    label: string;
    color?: "default" | "primary" | "success" | "error" | "warning";
    size?: "small" | "medium";
    variant?: "filled" | "outlined" | "soft";
    onDelete?: () => void;
}

export default function Chip({
    label,
    color = "default",
    size = "medium",
    variant = "soft",
    onDelete,
    onClick,
    className = "",
    ...props
}: ChipProps) {
    const sizeStyles = {
        small: "px-3 py-1.5 text-xs min-h-[28px]",
        medium: "px-4 py-2 text-sm min-h-[32px]",
    };

    const colorStyles = {
        filled: {
            default: "bg-gray-900 text-white",
            primary: "bg-blue-600 text-white",
            success: "bg-green-600 text-white",
            error: "bg-red-600 text-white",
            warning: "bg-amber-600 text-white",
        },
        outlined: {
            default: "border-2 border-gray-300 text-gray-700 bg-transparent",
            primary: "border-2 border-blue-600 text-blue-600 bg-transparent",
            success: "border-2 border-green-600 text-green-600 bg-transparent",
            error: "border-2 border-red-600 text-red-600 bg-transparent",
            warning: "border-2 border-amber-600 text-amber-600 bg-transparent",
        },
        soft: {
            default: "bg-gray-100 text-gray-700 border border-gray-200",
            primary: "bg-blue-50 text-blue-700 border border-blue-200",
            success: "bg-green-50 text-green-700 border border-green-200",
            error: "bg-red-50 text-red-700 border border-red-200",
            warning: "bg-amber-50 text-amber-700 border border-amber-200",
        },
    };

    const cursorClass = onClick || onDelete ? "cursor-pointer" : "";

    return (
        <div
            className={`inline-flex items-center gap-2 rounded-lg font-medium transition-all ${sizeStyles[size]} ${colorStyles[variant][color]} ${cursorClass} ${className}`}
            onClick={onClick}
            {...props}
        >
            <span>{label}</span>
            {onDelete && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="hover:opacity-70 transition-opacity cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
