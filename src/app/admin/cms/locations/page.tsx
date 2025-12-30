"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Edit2, Trash2 } from "lucide-react";
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
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-start flex-wrap gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-3">Ubicaciones</h1>
                    <p className="text-neutral-400 text-lg">Gestión de sedes y direcciones</p>
                </div>
                <Link href="/admin/cms/locations/new">
                    <Button size="large" startIcon={
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    }>
                        Nueva Ubicación
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Todas las Ubicaciones</h2>
                        <p className="text-neutral-400 text-sm mt-1">
                            {filteredLocations.length} de {locations.length} ubicación(es)
                        </p>
                    </div>
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o dirección..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {filteredLocations.length === 0 ? (
                    <Card>
                        <CardContent>
                            <div className="flex flex-col items-center gap-4 py-12 text-neutral-500">
                                <MapPin className="w-16 h-16 text-neutral-700" />
                                <p>{searchTerm ? "No se encontraron ubicaciones con ese criterio" : "No hay ubicaciones registradas"}</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredLocations.map((location) => (
                            <Card key={location.id}>
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-black" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-semibold text-lg mb-1">
                                                {location.name}
                                            </h3>
                                            <p className="text-neutral-400 text-sm">
                                                {location.address}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Link href={`/admin/cms/locations/${location.id}/edit`}>
                                                <button className="w-10 h-10 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 hover:border-white text-white transition-all flex items-center justify-center group">
                                                    <Edit2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(location.id)}
                                                className="w-10 h-10 rounded-lg border border-red-900 bg-red-950 hover:bg-red-900 hover:border-red-500 text-red-500 transition-all flex items-center justify-center group"
                                            >
                                                <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
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
