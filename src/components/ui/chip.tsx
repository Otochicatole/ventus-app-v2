import { HTMLAttributes } from "react";

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
            default: "bg-neutral-700 text-neutral-200",
            primary: "bg-white text-black",
            success: "bg-green-600 text-white",
            error: "bg-red-600 text-white",
            warning: "bg-amber-600 text-black",
        },
        outlined: {
            default: "border-2 border-neutral-600 text-neutral-300 bg-transparent",
            primary: "border-2 border-white text-white bg-transparent",
            success: "border-2 border-green-500 text-green-400 bg-transparent",
            error: "border-2 border-red-500 text-red-400 bg-transparent",
            warning: "border-2 border-amber-500 text-amber-400 bg-transparent",
        },
        soft: {
            default: "bg-neutral-800/50 text-neutral-300 border border-neutral-700",
            primary: "bg-white/10 text-white border border-white/20",
            success: "bg-green-500/10 text-green-400 border border-green-500/20",
            error: "bg-red-500/10 text-red-400 border border-red-500/20",
            warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
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
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}
