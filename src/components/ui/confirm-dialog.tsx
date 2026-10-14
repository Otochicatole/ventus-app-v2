import { AlertTriangle } from "lucide-react";
import Button from "./button";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    loading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    loading = false,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
            <div
                className="absolute inset-0 bg-stone-950/50 backdrop-blur-xs cursor-pointer"
                onClick={onClose}
            />
            <div className="relative bg-white border border-stone-200 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-start gap-3.5 mb-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center border border-red-100 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1">{title}</h3>
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{message}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={onConfirm}
                        loading={loading}
                        disabled={loading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
