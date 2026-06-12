"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import { Search, Plus, Package, MapPin, Calendar, X, History } from "lucide-react";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import ConfirmDialog from "@/components/ui/confirm-dialog";

type Shift = {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    confirmed: boolean;
    notes: string | null;
    location: {
        id: string;
        name: string;
    };
};

export default function ShiftsPage() {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending">("all");
    const [dateFilter, setDateFilter] = useState<Dayjs | null>(null);

    useEffect(() => {
        fetchShifts();
    }, []);

    useEffect(() => {
        const handleFocus = () => {
            fetchShifts();
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const fetchShifts = async () => {
        try {
            const res = await fetch("/api/shifts", {
                cache: "no-store",
            });
            const data = await res.json();
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const futureShifts = data.filter((shift: Shift) => {
                const dateStr = shift.date.split("T")[0];
                const [year, month, day] = dateStr.split("-");
                const shiftDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                shiftDate.setHours(0, 0, 0, 0);
                return shiftDate >= today;
            });
            
            setShifts(futureShifts);
        } catch (error) {
            console.error("Error fetching shifts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        const shiftToDelete = shifts.find(s => s.id === deleteId);
        
        setDeleting(true);
        try {
            const res = await fetch(`/api/shifts/${deleteId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                if (shiftToDelete && shiftToDelete.confirmed) {
                    const dateStr = shiftToDelete.date.split("T")[0];
                    const [year, month, day] = dateStr.split("-");
                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    const formattedDate = date.toLocaleDateString("es-AR");
                    
                    const phone = shiftToDelete.phone.replace(/\D/g, '');
                    const message = `Hola ${shiftToDelete.name}!

Lamentamos informarte que tu turno ha sido *cancelado*.

*Fecha:* ${formattedDate}
*Hora:* ${shiftToDelete.time}
*Ubicacion:* ${shiftToDelete.location.name}

Disculpa las molestias. Podes reservar un nuevo turno cuando gustes.

_Ventus Barberia_`;
                    
                    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                }
                
                setShifts(shifts.filter((shift) => shift.id !== deleteId));
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Error deleting shift:", error);
        } finally {
            setDeleting(false);
        }
    };

    const toggleConfirmed = async (shiftId: string, currentStatus: boolean) => {
        setConfirmingId(shiftId);
        try {
            const res = await fetch(`/api/admin/shifts/${shiftId}/confirm`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ confirmed: !currentStatus }),
            });

            if (res.ok) {
                const updatedShift = shifts.find(s => s.id === shiftId);
                
                setShifts(
                    shifts.map((shift) =>
                        shift.id === shiftId
                            ? { ...shift, confirmed: !currentStatus }
                            : shift
                    )
                );

                if (!currentStatus && updatedShift) {
                    const dateStr = updatedShift.date.split("T")[0];
                    const [year, month, day] = dateStr.split("-");
                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    const formattedDate = date.toLocaleDateString("es-AR");
                    
                    const phone = updatedShift.phone.replace(/\D/g, '');
                    const message = `Hola ${updatedShift.name}!

Tu turno ha sido *confirmado con exito*

*Fecha:* ${formattedDate}
*Hora:* ${updatedShift.time}
*Ubicacion:* ${updatedShift.location.name}

Te esperamos!

_Ventus Barberia_`;
                    
                    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                }
            }
        } catch (error) {
            console.error("Error toggling confirmed:", error);
        } finally {
            setConfirmingId(null);
        }
    };

    const filteredShifts = shifts.filter((shift) => {
        if (statusFilter === "confirmed" && !shift.confirmed) return false;
        if (statusFilter === "pending" && shift.confirmed) return false;
        
        if (dateFilter) {
            const filterDateStr = dateFilter.format("YYYY-MM-DD");
            const shiftDateStr = shift.date.split("T")[0];
            if (filterDateStr !== shiftDateStr) return false;
        }
        
        if (!searchTerm) return true;
        
        const search = searchTerm.toLowerCase();
        const fullName = `${shift.name} ${shift.lastName}`.toLowerCase();
        const email = shift.email.toLowerCase();
        const phone = shift.phone.toLowerCase();
        const location = shift.location.name.toLowerCase();
        const dateStr = shift.date.split("T")[0];
        const [year, month, day] = dateStr.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const formattedDate = date.toLocaleDateString("es-AR").toLowerCase();
        
        return (
            fullName.includes(search) ||
            email.includes(search) ||
            phone.includes(search) ||
            location.includes(search) ||
            formattedDate.includes(search) ||
            shift.time.includes(search)
        );
    });

    const hasActiveFilters = statusFilter !== "all" || dateFilter !== null;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-start flex-wrap gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Turnos</h1>
                    <p className="text-gray-600 text-lg">Gestión de reservas y confirmaciones</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/cms/history">
                        <Button size="large" variant="outlined" startIcon={<History className="w-5 h-5" />}>
                            Historial
                        </Button>
                    </Link>
                    <Link href="/admin/cms/shifts/new">
                        <Button size="small" startIcon={<Plus className="w-5 h-5" />}>
                            Nuevo Turno
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Todos los Turnos</h2>
                            <p className="text-gray-600 text-sm mt-1">
                                {filteredShifts.length} de {shifts.length} registro(s)
                            </p>
                        </div>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, email, teléfono..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setStatusFilter("all")}
                                className={`px-4 py-2 rounded-xl font-medium text-sm cursor-pointer ${
                                    statusFilter === "all"
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setStatusFilter("confirmed")}
                                className={`px-4 py-2 rounded-xl font-medium text-sm cursor-pointer ${
                                    statusFilter === "confirmed"
                                        ? "bg-green-600 text-white shadow-sm"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                Confirmados
                            </button>
                            <button
                                onClick={() => setStatusFilter("pending")}
                                className={`px-4 py-2 rounded-xl font-medium text-sm cursor-pointer ${
                                    statusFilter === "pending"
                                        ? "bg-amber-600 text-white shadow-sm"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                Pendientes
                            </button>
                            <div className="w-px h-8 bg-gray-300 hidden sm:block self-center"></div>
                            <button
                                onClick={() => setDateFilter(dayjs())}
                                className={`px-4 py-2 rounded-xl font-medium text-sm cursor-pointer ${
                                    dateFilter && dateFilter.isSame(dayjs(), 'day')
                                        ? "bg-purple-600 text-white shadow-sm"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                Hoy
                            </button>
                        </div>

                        <div className="flex gap-2 items-center w-full sm:w-auto sm:flex-1 sm:justify-end">
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                <DatePicker
                                    label="Filtrar por fecha"
                                    value={dateFilter}
                                    onChange={(newValue) => setDateFilter(newValue)}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            sx: {
                                                width: "100%",
                                                minWidth: { xs: "auto", sm: 200 },
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "12px",
                                                },
                                            },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                            {hasActiveFilters && (
                                <button
                                    onClick={() => {
                                        setStatusFilter("all");
                                    setDateFilter(null);
                                }}
                                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2 font-medium text-sm shrink-0 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                                <span className="hidden sm:inline">Limpiar</span>
                            </button>
                            )}
                        </div>
                    </div>
                </div>

                {filteredShifts.length === 0 ? (
                    <Card>
                        <CardContent>
                            <div className="flex flex-col items-center gap-4 py-12 text-gray-500">
                                <Package className="w-16 h-16 text-gray-300" />
                                <p>{searchTerm ? "No se encontraron turnos con ese criterio" : "No hay turnos registrados"}</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {filteredShifts.map((shift) => {
                            const dateStr = shift.date.split("T")[0];
                            const [year, month, day] = dateStr.split("-");
                            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const shiftDate = new Date(date);
                            shiftDate.setHours(0, 0, 0, 0);
                            const isToday = shiftDate.getTime() === today.getTime();
                            
                            return (
                                <Card key={shift.id}>
                                    <CardContent>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg shrink-0">
                                                    {shift.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-gray-900 font-semibold text-base sm:text-lg truncate">
                                                        {shift.name} {shift.lastName}
                                                    </h3>
                                                    <div className="flex flex-col text-xs sm:text-sm text-gray-600 mt-1 gap-0.5">
                                                        <span className="truncate">{shift.email}</span>
                                                        <span>{shift.phone}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
                                                    <span className="text-gray-700 truncate">{shift.location.name}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-900 font-medium">{date.toLocaleDateString("es-AR")}</span>
                                                        <span className="text-gray-500">{shift.time}</span>
                                                        {isToday && (
                                                            <Chip
                                                                label="Hoy"
                                                                color="primary"
                                                                variant="filled"
                                                                size="small"
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                <Chip
                                                    label={shift.confirmed ? "Confirmado" : "Pendiente"}
                                                    color={shift.confirmed ? "success" : "warning"}
                                                    variant="soft"
                                                    size="small"
                                                />
                                            </div>

                                            <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-200">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => toggleConfirmed(shift.id, shift.confirmed)}
                                                    disabled={confirmingId === shift.id}
                                                    className="flex-1 sm:flex-none"
                                                >
                                                    {shift.confirmed ? "Desconfirmar" : "Confirmar"}
                                                </Button>
                                                <Link href={`/admin/cms/shifts/${shift.id}`} className="flex-1 sm:flex-none">
                                                    <Button size="small" variant="outlined" color="default" fullWidth>
                                                        Ver
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => setDeleteId(shift.id)}
                                                    className="flex-1 sm:flex-none"
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar Turno"
                message="¿Estás seguro de eliminar este turno? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                loading={deleting}
            />
        </div>
    );
}
