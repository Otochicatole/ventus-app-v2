"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-white">Ubicaciones</h1>
                <Link
                    href="/admin/cms/locations/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all"
                >
                    + Nueva Ubicación
                </Link>
            </div>

            <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-700">
                    <h2 className="text-xl font-bold text-white">Todas las Ubicaciones</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-900">
                            <tr>
                                <th className="text-left py-3 px-6 text-neutral-400 font-semibold text-sm">Nombre</th>
                                <th className="text-left py-3 px-6 text-neutral-400 font-semibold text-sm">Dirección</th>
                                <th className="text-right py-3 px-6 text-neutral-400 font-semibold text-sm">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-neutral-500">
                                        No hay ubicaciones registradas
                                    </td>
                                </tr>
                            ) : (
                                locations.map((location) => (
                                    <tr key={location.id} className="border-b border-neutral-800 hover:bg-neutral-900/50">
                                        <td className="py-3 px-6 text-white">{location.name}</td>
                                        <td className="py-3 px-6 text-neutral-300">{location.address}</td>
                                        <td className="py-3 px-6">
                                            <div className="flex gap-2 justify-end">
                                                <Link
                                                    href={`/admin/cms/locations/${location.id}/edit`}
                                                    className="px-3 py-1.5 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-600/10 text-sm font-medium transition-all"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(location.id)}
                                                    className="px-3 py-1.5 border-2 border-red-600 text-red-600 rounded-md hover:bg-red-600/10 text-sm font-medium transition-all"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar Ubicación"
                message="¿Estás seguro de eliminar esta ubicación? Esto también eliminará todos los turnos, horarios y fechas bloqueadas asociadas. Esta acción no se puede deshacer."
                confirmText="Eliminar"
                loading={deleting}
            />
        </div>
    );
}
