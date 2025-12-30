"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Package, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardActions } from "@/components/ui/card";
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
                duration: "",
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

    const filteredServices = services.filter((service) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            service.name.toLowerCase().includes(searchLower) ||
            (service.description && service.description.toLowerCase().includes(searchLower)) ||
            service.price.toString().includes(searchLower)
        );
    });

    if (loading) {
        return (
            <div className="flex items-center gap-3 py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                <p className="text-gray-600">Cargando servicios...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
                <Button
                    onClick={() => handleOpenDialog()}
                    startIcon={<Plus className="w-5 h-5" />}
                >
                    Agregar Servicio
                </Button>
            </div>

            {message && (
                <Alert severity={message.type}>
                    {message.text}
                </Alert>
            )}

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Buscar servicios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12"
                />
            </div>

            {filteredServices.length === 0 ? (
                <Card>
                    <CardContent>
                        <div className="flex flex-col items-center gap-4 py-12 text-gray-500">
                            <Package className="w-16 h-16 text-gray-300" />
                            <p>
                                {searchTerm
                                    ? "No se encontraron servicios con ese criterio"
                                    : "No hay servicios registrados"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredServices.map((service) => (
                        <Card key={service.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {service.name}
                                            </h3>
                                            <Chip
                                                label={service.active ? "Activo" : "Inactivo"}
                                                color={service.active ? "success" : "default"}
                                                variant="soft"
                                                size="small"
                                            />
                                        </div>
                                        {service.description && (
                                            <p className="text-gray-600 mb-4">{service.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="font-semibold">${service.price}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                                <span>{service.duration} min</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenDialog(service)}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            <span className="sm:hidden">Editar</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteId(service.id)}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span className="sm:hidden">Eliminar</span>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                title={editingService ? "Editar Servicio" : "Agregar Servicio"}
            >
                <DialogContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Nombre del servicio"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            fullWidth
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Descripción
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                                placeholder="Descripción del servicio (opcional)"
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
                            />

                            <Input
                                label="Duración (min)"
                                type="number"
                                min="1"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                required
                                fullWidth
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="active"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            />
                            <label htmlFor="active" className="text-sm font-medium text-gray-700">
                                Servicio activo
                            </label>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
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
                                {editingService ? "Actualizar" : "Crear"}
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

