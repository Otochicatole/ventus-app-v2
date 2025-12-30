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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            />
            <div className="relative bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-fadeIn">
                <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center border border-red-200">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                        <p className="text-gray-600">{message}</p>
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
