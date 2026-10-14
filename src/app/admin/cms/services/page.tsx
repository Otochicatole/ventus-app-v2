"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, Search, Scissors, DollarSign, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Dialog, { DialogContent } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import Alert from "@/components/ui/alert";
import Chip from "@/components/ui/chip";

type Service = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        duration: "",
        active: true,
    });
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services", {
                cache: "no-store",
            });
            const data = await res.json();
            setServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (service?: Service) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                description: service.description || "",
                price: service.price.toString(),
                duration: service.duration.toString(),
                active: service.active,
            });
        } else {
            setEditingService(null);
            setFormData({
                name: "",
                description: "",
                price: "",
                duration: "30",
                active: true,
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingService(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            duration: "",
            active: true,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const url = editingService
                ? `/api/services/${editingService.id}`
                : "/api/services";
            const method = editingService ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error al guardar servicio");
            }

            setMessage({
                type: "success",
                text: editingService
                    ? "Servicio actualizado exitosamente"
                    : "Servicio creado exitosamente",
            });

            handleCloseDialog();
            fetchServices();
        } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Error al guardar servicio",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`/api/services/${deleteId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Error al eliminar servicio");
            }

            setMessage({
                type: "success",
                text: "Servicio eliminado exitosamente",
            });

            fetchServices();
        } catch (error) {
            setMessage({
                type: "error",
                text: "Error al eliminar servicio",
            });
        } finally {
            setDeleteId(null);
        }
    };

    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                service.name.toLowerCase().includes(searchLower) ||
                (service.description && service.description.toLowerCase().includes(searchLower)) ||
                service.price.toString().includes(searchLower)
            );
        });
    }, [services, searchTerm]);

    const activeCount = useMemo(() => services.filter((s) => s.active).length, [services]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0b3a60] border-t-transparent"></div>
                <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Cargando catálogo...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Servicios</h1>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                        Catálogo de cortes, afeitados y tratamientos de Ventus
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    startIcon={<Plus className="w-4 h-4" />}
                >
                    Agregar Servicio
                </Button>
            </div>

            {message && (
                <Alert severity={message.type}>
                    {message.text}
                </Alert>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-4">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">Total Servicios</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-stone-900">{services.length}</span>
                </div>
                <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-4">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">Activos para reserva</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-emerald-700">{activeCount}</span>
                </div>
                <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-4 col-span-2 sm:col-span-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">Inactivos / Pausados</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-stone-500">{services.length - activeCount}</span>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Buscar servicios por nombre, descripción o precio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b3a60] focus:border-transparent transition-all"
                />
            </div>

            {/* List */}
            {filteredServices.length === 0 ? (
                <Card>
                    <CardContent>
                        <div className="flex flex-col items-center gap-3 py-16 text-stone-400">
                            <Scissors className="w-12 h-12 text-stone-300" />
                            <p className="text-xs uppercase tracking-wider font-semibold">
                                {searchTerm
                                    ? "No se encontraron servicios con ese criterio"
                                    : "No hay servicios registrados en el sistema"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredServices.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-[#0b3a60] hover:shadow-xs space-y-4"
                        >
                            <div className="space-y-2.5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-[#0b3a60]/10 text-[#0b3a60] flex items-center justify-center shrink-0">
                                            <Scissors className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-base font-bold text-stone-900 leading-tight">
                                            {service.name}
                                        </h3>
                                    </div>
                                    <span
                                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                            service.active
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-stone-100 text-stone-500 border border-stone-200"
                                        }`}
                                    >
                                        {service.active ? (
                                            <>
                                                <CheckCircle2 className="w-3 h-3" />
                                                Activo
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-3 h-3" />
                                                Inactivo
                                            </>
                                        )}
                                    </span>
                                </div>

                                {service.description ? (
                                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                                        {service.description}
                                    </p>
                                ) : (
                                    <p className="text-xs text-stone-400 italic">
                                        Sin descripción cargada
                                    </p>
                                )}
                            </div>

                            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <span className="text-lg font-extrabold text-[#0b3a60] tracking-tight block">
                                        ${service.price.toLocaleString("es-AR")}
                                    </span>
                                    <div className="flex items-center gap-1 text-[11px] text-stone-500">
                                        <Clock className="w-3 h-3 text-stone-400" />
                                        <span>{service.duration} min</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenDialog(service)}
                                        className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                                        title="Editar servicio"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteId(service.id)}
                                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        title="Eliminar servicio"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                title={editingService ? "Editar Servicio" : "Nuevo Servicio"}
            >
                <DialogContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Nombre del servicio"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            fullWidth
                            placeholder="Ej. Corte Tradicional + Lavado"
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                                Descripción
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b3a60] focus:border-transparent transition-all resize-none"
                                placeholder="Detalles de lo que incluye el servicio..."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Precio ($)"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                fullWidth
                                placeholder="0.00"
                            />

                            <Input
                                label="Duración (minutos)"
                                type="number"
                                min="1"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                required
                                fullWidth
                                placeholder="30"
                            />
                        </div>

                        <div className="flex items-center gap-2.5 pt-2">
                            <input
                                type="checkbox"
                                id="active"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="w-4 h-4 rounded border-stone-300 text-[#0b3a60] focus:ring-[#0b3a60] cursor-pointer"
                            />
                            <label htmlFor="active" className="text-xs font-semibold text-stone-700 cursor-pointer select-none">
                                Servicio activo y disponible para agendamiento
                            </label>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-4 border-t border-stone-100">
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={handleCloseDialog}
                                disabled={submitting}
                                className="w-full sm:w-auto"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                loading={submitting}
                                className="w-full sm:w-auto"
                            >
                                {editingService ? "Actualizar Servicio" : "Crear Servicio"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar Servicio"
                message="¿Estás seguro de que querés eliminar este servicio? Esta acción no se puede deshacer."
            />
        </div>
    );
}
