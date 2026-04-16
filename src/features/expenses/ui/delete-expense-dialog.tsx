import ConfirmDialog from "@/components/ui/confirm-dialog";
import type { DeleteTarget } from "../domain/expenses.types";

type DeleteExpenseDialogProps = {
    target: DeleteTarget | null;
    submitting: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function DeleteExpenseDialog({
    target,
    submitting,
    onClose,
    onConfirm,
}: DeleteExpenseDialogProps) {
    return (
        <ConfirmDialog
            isOpen={Boolean(target)}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Eliminar registro"
            message={`Se va a eliminar ${target?.label ?? "este registro"}. Esta acción borra el dato de la base.`}
            confirmText="Eliminar"
            loading={submitting}
        />
    );
}
