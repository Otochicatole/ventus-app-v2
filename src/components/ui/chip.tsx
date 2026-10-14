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
    size = "small",
    variant = "soft",
    onDelete,
    onClick,
    className = "",
    ...props
}: ChipProps) {
    const sizeStyles = {
        small: "px-2.5 py-0.5 text-xs",
        medium: "px-3 py-1 text-xs sm:text-sm",
    };

    const colorStyles = {
        filled: {
            default: "bg-stone-900 text-white",
            primary: "bg-[#0b3a60] text-white",
            success: "bg-emerald-700 text-white",
            error: "bg-red-600 text-white",
            warning: "bg-amber-600 text-white",
        },
        outlined: {
            default: "border border-stone-300 text-stone-700 bg-transparent",
            primary: "border border-[#0b3a60] text-[#0b3a60] bg-transparent",
            success: "border border-emerald-600 text-emerald-700 bg-transparent",
            error: "border border-red-500 text-red-600 bg-transparent",
            warning: "border border-amber-500 text-amber-700 bg-transparent",
        },
        soft: {
            default: "bg-stone-100 text-stone-700 border border-stone-200",
            primary: "bg-[#0b3a60]/10 text-[#0b3a60] border border-[#0b3a60]/20",
            success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
            error: "bg-red-50 text-red-700 border border-red-200",
            warning: "bg-amber-50 text-amber-800 border border-amber-200",
        },
    };

    const cursorClass = onClick || onDelete ? "cursor-pointer" : "";

    return (
        <div
            className={`inline-flex items-center gap-1.5 rounded-md font-medium transition-colors ${sizeStyles[size]} ${colorStyles[variant][color]} ${cursorClass} ${className}`}
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
                    className="hover:opacity-75 transition-opacity cursor-pointer p-0.5 rounded hover:bg-black/5"
                    title="Eliminar"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}
