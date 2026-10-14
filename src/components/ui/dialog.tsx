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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
            <div
                className="absolute inset-0 bg-stone-950/50 backdrop-blur-xs cursor-pointer transition-opacity"
                onClick={onClose}
            />
            <div className={`relative bg-white border border-stone-200 rounded-xl w-full ${maxWidthClasses[maxWidth]} shadow-2xl max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden`}>
                {title && (
                    <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between shrink-0 bg-stone-50/50">
                        <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">{title}</h2>
                        <button
                            onClick={onClose}
                            aria-label="Cerrar modal"
                            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function DialogContent({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function DialogActions({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`px-6 py-3.5 border-t border-stone-100 flex justify-end gap-3 bg-stone-50/50 ${className}`}>
            {children}
        </div>
    );
}
