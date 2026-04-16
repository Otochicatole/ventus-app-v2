import Button from "@/components/ui/button";
import Dialog, { DialogContent } from "@/components/ui/dialog";
import Input from "@/components/ui/input";
import type { FixedExpenseFormState } from "../domain/expenses.types";

type FixedExpenseDialogProps = {
    open: boolean;
    editing: boolean;
    form: FixedExpenseFormState;
    submitting: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onFieldChange: (field: keyof FixedExpenseFormState, value: string) => void;
};

export function FixedExpenseDialog({
    open,
    editing,
    form,
    submitting,
    onClose,
    onSubmit,
    onFieldChange,
}: FixedExpenseDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={editing ? "Editar gasto fijo" : "Agregar gasto fijo"}
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
                        label="Monto mensual"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.amount}
                        onChange={(event) => onFieldChange("amount", event.target.value)}
                        required
                    />
                    <Input
                        label="Fecha de inicio"
                        type="date"
                        value={form.startsAt}
                        onChange={(event) => onFieldChange("startsAt", event.target.value)}
                        required
                    />
                    <Input
                        label="Descripción"
                        value={form.description}
                        onChange={(event) => onFieldChange("description", event.target.value)}
                    />

                    <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                        Este gasto se aplicará automáticamente todos los meses usando el día de la
                        fecha de inicio.
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outlined" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" loading={submitting}>
                            {editing ? "Guardar cambios" : "Agregar gasto fijo"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
