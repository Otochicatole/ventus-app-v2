"use client";

import Modal, { ModalFooter } from "./modal";
import Button from "@/shared/components/buttons/button";

type ConfirmDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    loading?: boolean;
};

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    loading = false,
}: ConfirmDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p className="text-neutral-300">{message}</p>

            <ModalFooter>
                <Button onClick={onClose} disabled={loading}>
                    {cancelText}
                </Button>
                <Button onClick={onConfirm} disabled={loading} isLoading={loading}>
                    {confirmText}
                </Button>
            </ModalFooter>
        </Modal>
    );
}

