"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Edit2, Trash2, Plus } from "lucide-react";
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ConfirmDialog from "@/components/ui/confirm-dialog";

type Location = {
    id: string;
    name: string;
    address: string;
    _count?: {
        shifts: number;
    };
};

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        const handleFocus = () => {
            fetchLocations();
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const fetchLocations = async () => {
        try {
            const res = await fetch("/api/locations", {
                cache: "no-store",
            });
            const data = await res.json();
            setLocations(data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/locations/${deleteId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setLocations(locations.filter((loc) => loc.id !== deleteId));
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Error deleting location:", error);
        } finally {
            setDeleting(false);
        }
    };

    const filteredLocations = locations.filter((location) => {
        if (!searchTerm) return true;
        
        const search = searchTerm.toLowerCase();
        const name = location.name.toLowerCase();
        const address = location.address.toLowerCase();
        
        return name.includes(search) || address.includes(search);
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0b3a60] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Ubicaciones</h1>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                            {locations.length} sedes
                        </span>
                    </div>
                    <p className="text-stone-500 text-sm mt-1">
                        Gestión de sedes, direcciones físicas y disponibilidad para turnos de Ventus Barbería
                    </p>
                </div>
                <Link href="/admin/cms/locations/new">
                    <Button startIcon={<Plus className="w-4 h-4" />}>
                        Nueva Ubicación
                    </Button>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o dirección..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b3a60]/20 focus:border-[#0b3a60] transition-all"
                    />
                </div>
                <p className="text-xs text-stone-500 font-medium shrink-0">
                    Mostrando {filteredLocations.length} de {locations.length} sede(s)
                </p>
            </div>

            {filteredLocations.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
                        <MapPin className="w-6 h-6 text-stone-400" />
                    </div>
                    <h3 className="text-base font-semibold text-stone-900">Sin ubicaciones encontradas</h3>
                    <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
                        {searchTerm
                            ? "No hay ubicaciones que coincidan con el término buscado."
                            : "No hay sedes registradas en el sistema todavía."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredLocations.map((location) => (
                        <div
                            key={location.id}
                            className="bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-300 transition-all flex flex-col justify-between gap-4 shadow-xs group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#0b3a60]/10 text-[#0b3a60] flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-bold text-stone-900 truncate">
                                            {location.name}
                                        </h3>
                                        {location._count?.shifts !== undefined && (
                                            <span className="text-[11px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                                                {location._count.shifts} turnos
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-stone-500 mt-1">
                                        {location.address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                                <Link href={`/admin/cms/locations/${location.id}/edit`}>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        <span>Editar</span>
                                    </button>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setDeleteId(location.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar Ubicación"
                message="¿Estás seguro de eliminar esta ubicación? Esto también eliminará todos los turnos, horarios y fechas bloqueadas asociadas a esta sede. Esta acción no se puede deshacer."
                confirmText="Eliminar Sede"
                loading={deleting}
            />
        </div>
    );
}
