import Button from "@/components/ui/button";
import Dialog, { DialogContent } from "@/components/ui/dialog";
import Input from "@/components/ui/input";
import type { ExpenseFormState } from "../domain/expenses.types";

type ExpenseDialogProps = {
    open: boolean;
    editing: boolean;
    form: ExpenseFormState;
    submitting: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onFieldChange: (field: keyof ExpenseFormState, value: string) => void;
};

export function ExpenseDialog({
    open,
    editing,
    form,
    submitting,
    onClose,
    onSubmit,
    onFieldChange,
}: ExpenseDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={editing ? "Editar gasto" : "Agregar gasto del día a día"}
        >
            <DialogContent>
                <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }} className="space-y-4">
                    <Input
                        label="Concepto"
                        value={form.name}
                        onChange={(event) => onFieldChange("name", event.target.value)}
                        required
                    />
                    <Input
                        label="Monto"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.amount}
                        onChange={(event) => onFieldChange("amount", event.target.value)}
                        required
                    />
                    <Input
                        label="Fecha del gasto"
                        type="date"
                        value={form.spentAt}
                        onChange={(event) => onFieldChange("spentAt", event.target.value)}
                        required
                    />
                    <Input
                        label="Descripción"
                        value={form.description}
                        onChange={(event) => onFieldChange("description", event.target.value)}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outlined" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" loading={submitting}>
                            {editing ? "Guardar cambios" : "Agregar gasto"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
