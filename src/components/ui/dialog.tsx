import { ReactNode } from "react";
import { X } from "lucide-react";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    maxWidth?: "sm" | "md" | "lg";
    children: ReactNode;
}

export default function Dialog({ open, onClose, title, maxWidth = "md", children }: DialogProps) {
    if (!open) return null;

    const maxWidthClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            />
            <div className={`relative bg-white border border-gray-200 rounded-2xl w-full ${maxWidthClasses[maxWidth]} shadow-2xl animate-fadeIn`}>
                {title && (
                    <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

export function DialogContent({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`px-8 py-6 ${className}`}>{children}</div>;
}

export function DialogActions({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`px-8 py-6 border-t border-gray-200 flex justify-end gap-4 ${className}`}>
            {children}
        </div>
    );
}
