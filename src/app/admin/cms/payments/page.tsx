"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    Receipt,
    DollarSign,
    Calendar,
    ListFilter,
    ArrowUpDown,
    ShoppingBag,
    Scissors,
    X,
    Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Dialog, { DialogContent } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import Alert from "@/components/ui/alert";
import Chip from "@/components/ui/chip";

type ClientPaidService = {
    id: string;
    fullName: string;
    payment: number;
    description: string | null;
    servicesPerformed: string[];
    productsBought?: string[];
    paidAt: string;
    createdAt: string;
    updatedAt: string;
};

type Service = {
    id: string;
    name: string;
    price: number;
    active: boolean;
};

type Product = {
    id: string;
    name: string;
    price: number;
    stock?: number | null;
    active: boolean;
};

function getTodayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function PaymentsPage() {
    const [records, setRecords] = useState<ClientPaidService[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState<string>(getTodayStr());
    const [showAll, setShowAll] = useState(false);
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ClientPaidService | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: "",
        payment: "",
        description: "",
        servicesPerformed: [] as string[],
        productsBought: [] as string[],
        paidAt: getTodayStr(),
    });
    const [productSearch, setProductSearch] = useState("");
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services", { cache: "no-store" });
            const data = await res.json();
            setServices(data.filter((s: Service) => s.active));
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products", { cache: "no-store" });
            const data = await res.json();
            setProducts(data.filter((p: Product) => p.active));
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchRecords = useCallback(async () => {
        setLoading(true);
        try {
            const url = showAll
                ? "/api/client-paid-services"
                : `/api/client-paid-services?date=${dateFilter}`;
            const res = await fetch(url, { cache: "no-store" });
            const data = await res.json();
            setRecords(data);
        } catch (error) {
            console.error("Error fetching records:", error);
        } finally {
            setLoading(false);
        }
    }, [dateFilter, showAll]);

    useEffect(() => {
        fetchServices();
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const handleOpenDialog = (record?: ClientPaidService) => {
        setProductSearch("");
        setIsProductDropdownOpen(false);
        if (record) {
            setEditingRecord(record);
            setFormData({
                fullName: record.fullName,
                payment: record.payment.toString(),
                description: record.description || "",
                servicesPerformed: record.servicesPerformed || [],
                productsBought: record.productsBought || [],
                paidAt: record.paidAt.split("T")[0],
            });
        } else {
            setEditingRecord(null);
            setFormData({
                fullName: "",
                payment: "",
                description: "",
                servicesPerformed: [],
                productsBought: [],
                paidAt: getTodayStr(),
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingRecord(null);
        setProductSearch("");
        setIsProductDropdownOpen(false);
        setFormData({
            fullName: "",
            payment: "",
            description: "",
            servicesPerformed: [],
            productsBought: [],
            paidAt: getTodayStr(),
        });
    };

    const handleToggleService = (serviceName: string) => {
        setFormData((prev) => {
            const isRemoving = prev.servicesPerformed.includes(serviceName);
            const newServices = isRemoving
                ? prev.servicesPerformed.filter((s) => s !== serviceName)
                : [...prev.servicesPerformed, serviceName];

            const svc = services.find((s) => s.name === serviceName);
            const price = svc?.price ?? 0;
            const currentPayment = parseFloat(prev.payment) || 0;
            const newPayment = isRemoving
                ? Math.max(0, currentPayment - price)
                : currentPayment + price;

            return {
                ...prev,
                servicesPerformed: newServices,
                payment: newPayment.toString(),
            };
        });
    };

    const handleToggleProduct = (productName: string) => {
        setFormData((prev) => {
            const isRemoving = prev.productsBought.includes(productName);
            const newProducts = isRemoving
                ? prev.productsBought.filter((p) => p !== productName)
                : [...prev.productsBought, productName];

            const prod = products.find((p) => p.name === productName);
            const price = prod?.price ?? 0;
            const currentPayment = parseFloat(prev.payment) || 0;
            const newPayment = isRemoving
                ? Math.max(0, currentPayment - price)
                : currentPayment + price;

            return {
                ...prev,
                productsBought: newProducts,
                payment: newPayment.toString(),
            };
        });
    };

    const handleSelectProductAutocomplete = (product: Product) => {
        if (!formData.productsBought.includes(product.name)) {
            handleToggleProduct(product.name);
        }
        setProductSearch("");
        setIsProductDropdownOpen(false);
    };

    const filteredProductOptions = useMemo(() => {
        if (!productSearch.trim()) return products;
        const q = productSearch.toLowerCase();
        return products.filter((p) => p.name.toLowerCase().includes(q));
    }, [products, productSearch]);

    // Calculate totals for services and products
    const estimatedServicesTotal = useMemo(() => {
        return formData.servicesPerformed.reduce((sum, sName) => {
            const s = services.find((svc) => svc.name === sName);
            return sum + (s?.price ?? 0);
        }, 0);
    }, [formData.servicesPerformed, services]);

    const estimatedProductsTotal = useMemo(() => {
        return formData.productsBought.reduce((sum, pName) => {
            const p = products.find((prod) => prod.name === pName);
            return sum + (p?.price ?? 0);
        }, 0);
    }, [formData.productsBought, products]);

    const totalEstimated = estimatedServicesTotal + estimatedProductsTotal;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const url = editingRecord
                ? `/api/client-paid-services/${editingRecord.id}`
                : "/api/client-paid-services";
            const method = editingRecord ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error al guardar cobro");
            }

            setMessage({
                type: "success",
                text: editingRecord
                    ? "Cobro actualizado exitosamente"
                    : "Cobro registrado exitosamente",
            });

            handleCloseDialog();
            fetchRecords();
        } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Error al guardar cobro",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`/api/client-paid-services/${deleteId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Error al eliminar cobro");

            setMessage({ type: "success", text: "Cobro eliminado exitosamente" });
            fetchRecords();
        } catch {
            setMessage({ type: "error", text: "Error al eliminar cobro" });
        } finally {
            setDeleteId(null);
        }
    };

    const filteredRecords = records
        .filter((record) => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return (
                record.fullName.toLowerCase().includes(search) ||
                (record.description && record.description.toLowerCase().includes(search)) ||
                record.servicesPerformed.some((s) => s.toLowerCase().includes(search)) ||
                (record.productsBought && record.productsBought.some((p) => p.toLowerCase().includes(search))) ||
                record.payment.toString().includes(search)
            );
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });

    const totalPayments = filteredRecords.reduce((sum, r) => sum + r.payment, 0);

    const handleShowAll = () => {
        setShowAll(true);
        setDateFilter("");
    };

    const handleFilterDate = (date: string) => {
        setShowAll(false);
        setDateFilter(date);
    };

    const handleFilterToday = () => {
        setShowAll(false);
        setDateFilter(getTodayStr());
    };

    if (loading) {
        return (
            <div className="flex items-center gap-3 py-16 justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0b3a60] border-t-transparent"></div>
                <p className="text-stone-600 font-medium text-sm">Cargando cobros...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Cobros</h1>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                            {records.length} registros
                        </span>
                    </div>
                    <p className="text-stone-500 text-sm mt-1">
                        Historial y registro de ingresos por servicios y productos cobrados a clientes
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    startIcon={<Plus className="w-4 h-4" />}
                >
                    Registrar Cobro
                </Button>
            </div>

            {message && (
                <Alert severity={message.type}>{message.text}</Alert>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Buscar por cliente, servicio, producto, notas o monto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        type="date"
                        value={showAll ? "" : dateFilter}
                        onChange={(e) => handleFilterDate(e.target.value)}
                        className="px-3.5 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0b3a60]/20 focus:border-[#0b3a60] transition-all"
                    />
                    {!showAll && dateFilter !== getTodayStr() && (
                        <Button variant="outlined" size="small" onClick={handleFilterToday}>
                            Hoy
                        </Button>
                    )}
                    <Button
                        variant={showAll ? "contained" : "outlined"}
                        size="small"
                        onClick={showAll ? handleFilterToday : handleShowAll}
                        startIcon={<ListFilter className="w-4 h-4" />}
                    >
                        {showAll ? "Filtrar por Día" : "Ver Todo el Historial"}
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
                        startIcon={<ArrowUpDown className="w-4 h-4" />}
                    >
                        {sortOrder === "desc" ? "Recientes" : "Antiguos"}
                    </Button>
                </div>
            </div>

            {/* Quick KPI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                            Cobros Filtrados
                        </span>
                        <Receipt className="w-4 h-4 text-stone-400" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2 tabular-nums">
                        {filteredRecords.length}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                        {showAll ? "Mostrando la totalidad del histórico" : `Fecha seleccionada: ${dateFilter}`}
                    </p>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                            Total Facturado
                        </span>
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-2 tabular-nums">
                        ${totalPayments.toLocaleString("es-AR")}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                        Suma neta de los cobros en pantalla
                    </p>
                </div>
            </div>

            {/* Records List */}
            {filteredRecords.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
                        <Receipt className="w-6 h-6 text-stone-400" />
                    </div>
                    <h3 className="text-base font-semibold text-stone-900">Sin cobros para mostrar</h3>
                    <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
                        {searchTerm
                            ? "No hay cobros que coincidan con la búsqueda actual."
                            : "No se encontraron registros de cobro para el período o fecha seleccionada."}
                    </p>
                    <div className="mt-4 flex justify-center gap-2">
                        {searchTerm && (
                            <Button variant="outlined" size="small" onClick={() => setSearchTerm("")}>
                                Limpiar búsqueda
                            </Button>
                        )}
                        {!showAll && (
                            <Button variant="outlined" size="small" onClick={handleShowAll}>
                                Ver todo el historial
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredRecords.map((record) => {
                        const paidDate = record.paidAt.split("T")[0];
                        const [year, month, day] = paidDate.split("-");
                        const date = new Date(
                            parseInt(year),
                            parseInt(month) - 1,
                            parseInt(day)
                        );

                        return (
                            <div
                                key={record.id}
                                className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                            >
                                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-[#0b3a60] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                                        {record.fullName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base font-bold text-stone-900 truncate">
                                                {record.fullName}
                                            </h3>
                                            <span className="inline-flex items-center gap-1 text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                                                <Calendar className="w-3 h-3 text-stone-400" />
                                                {date.toLocaleDateString("es-AR")}
                                            </span>
                                        </div>

                                        {record.description && (
                                            <p className="text-xs text-stone-600 line-clamp-2">
                                                {record.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-2 pt-1">
                                            {/* Servicios realizados */}
                                            {record.servicesPerformed.length > 0 && (
                                                <div className="flex flex-wrap items-center gap-1">
                                                    <Scissors className="w-3 h-3 text-[#0b3a60] shrink-0" />
                                                    {record.servicesPerformed.map((service, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center text-[11px] font-medium bg-[#0b3a60]/10 text-[#0b3a60] px-2 py-0.5 rounded-md"
                                                        >
                                                            {service}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Productos comprados */}
                                            {record.productsBought && record.productsBought.length > 0 && (
                                                <div className="flex flex-wrap items-center gap-1">
                                                    <ShoppingBag className="w-3 h-3 text-emerald-600 shrink-0" />
                                                    {record.productsBought.map((prod, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md"
                                                        >
                                                            {prod}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                                    <div className="text-left sm:text-right">
                                        <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                                            Monto
                                        </span>
                                        <span className="text-xl font-bold text-stone-900 tabular-nums">
                                            ${record.payment.toLocaleString("es-AR")}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenDialog(record)}
                                            className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                                            title="Editar cobro"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteId(record.id)}
                                            className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                            title="Eliminar cobro"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de Registro / Edición */}
            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                title={editingRecord ? "Editar Cobro" : "Registrar Cobro"}
            >
                <DialogContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Nombre completo del cliente"
                            value={formData.fullName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    fullName: e.target.value,
                                })
                            }
                            required
                            fullWidth
                            placeholder="Ej. Juan Pérez"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Monto total a cobrar ($)"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.payment}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        payment: e.target.value,
                                    })
                                }
                                required
                                fullWidth
                            />

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                                    Fecha de cobro
                                </label>
                                <input
                                    type="date"
                                    value={formData.paidAt}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            paidAt: e.target.value,
                                        })
                                    }
                                    required
                                    className="px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0b3a60]/20 focus:border-[#0b3a60] transition-all"
                                />
                            </div>
                        </div>

                        {/* SECCIÓN 1: SERVICIOS */}
                        <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                                    <Scissors className="w-3.5 h-3.5 text-[#0b3a60]" />
                                    Servicios Realizados
                                </label>
                                {formData.servicesPerformed.length > 0 && (
                                    <span className="text-xs font-semibold text-[#0b3a60]">
                                        Subtotal: ${estimatedServicesTotal.toLocaleString("es-AR")}
                                    </span>
                                )}
                            </div>

                            {services.length > 0 ? (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {services.map((service) => {
                                        const selected = formData.servicesPerformed.includes(service.name);
                                        return (
                                            <button
                                                key={service.id}
                                                type="button"
                                                onClick={() => handleToggleService(service.name)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                                                    selected
                                                        ? "bg-[#0b3a60] text-white border-[#0b3a60] shadow-xs"
                                                        : "bg-white text-stone-700 border-stone-300 hover:bg-stone-100 hover:border-stone-400"
                                                }`}
                                            >
                                                {selected && <Check className="w-3.5 h-3.5" />}
                                                <span>{service.name}</span>
                                                <span className={selected ? "text-blue-100 font-semibold" : "text-stone-400 font-semibold"}>
                                                    ${service.price.toLocaleString("es-AR")}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-xs text-stone-500">
                                    No hay servicios disponibles
                                </p>
                            )}
                        </div>

                        {/* SECCIÓN 2: PRODUCTOS VENDIDOS (AUTOCOMPLETE + SELECCIÓN) */}
                        <div className="p-3.5 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-2.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                                    Productos Vendidos
                                </label>
                                {formData.productsBought.length > 0 && (
                                    <span className="text-xs font-semibold text-emerald-800">
                                        Subtotal: ${estimatedProductsTotal.toLocaleString("es-AR")}
                                    </span>
                                )}
                            </div>

                            {/* Autocomplete Input */}
                            <div className="relative">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                    <input
                                        type="text"
                                        placeholder="Escribí para autocompletar y sumar producto..."
                                        value={productSearch}
                                        onChange={(e) => {
                                            setProductSearch(e.target.value);
                                            setIsProductDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsProductDropdownOpen(true)}
                                        className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-emerald-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                                    />
                                    {productSearch && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProductSearch("");
                                                setIsProductDropdownOpen(false);
                                            }}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Autocomplete Dropdown */}
                                {isProductDropdownOpen && filteredProductOptions.length > 0 && (
                                    <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-stone-200 rounded-lg shadow-lg divide-y divide-stone-100">
                                        {filteredProductOptions.map((prod) => {
                                            const isSelected = formData.productsBought.includes(prod.name);
                                            return (
                                                <button
                                                    key={prod.id}
                                                    type="button"
                                                    onClick={() => handleSelectProductAutocomplete(prod)}
                                                    className="w-full px-3.5 py-2 text-left text-xs sm:text-sm hover:bg-emerald-50 flex items-center justify-between cursor-pointer transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                        <span className="font-medium text-stone-900">{prod.name}</span>
                                                        {prod.stock !== null && prod.stock !== undefined && (
                                                            <span className="text-[11px] text-stone-400">({prod.stock} disp.)</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-emerald-700">
                                                            +${prod.price.toLocaleString("es-AR")}
                                                        </span>
                                                        {isSelected ? (
                                                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                                                                Agregado
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded font-medium">
                                                                Sumar
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Quick selection chips for products */}
                            {products.length > 0 ? (
                                <div className="space-y-1.5 pt-1">
                                    <span className="text-[11px] text-emerald-900/80 font-medium block">
                                        O hacé clic en un producto para sumarlo o quitarlo:
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {products.map((product) => {
                                            const selected = formData.productsBought.includes(product.name);
                                            return (
                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    onClick={() => handleToggleProduct(product.name)}
                                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                                                        selected
                                                            ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                                                            : "bg-white text-stone-700 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400"
                                                    }`}
                                                >
                                                    {selected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-emerald-600" />}
                                                    <span>{product.name}</span>
                                                    <span className={selected ? "text-emerald-100 font-semibold" : "text-emerald-700 font-semibold"}>
                                                        ${product.price.toLocaleString("es-AR")}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-emerald-700">
                                    No hay productos activos cargados en el sistema.
                                </p>
                            )}

                            {/* Selected Products Chips */}
                            {formData.productsBought.length > 0 && (
                                <div className="pt-2 border-t border-emerald-200">
                                    <span className="text-xs font-semibold text-emerald-900 block mb-1.5">
                                        Productos seleccionados:
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {formData.productsBought.map((pName) => {
                                            const prod = products.find((p) => p.name === pName);
                                            return (
                                                <Chip
                                                    key={pName}
                                                    label={`${pName} ($${(prod?.price ?? 0).toLocaleString("es-AR")})`}
                                                    color="success"
                                                    variant="filled"
                                                    size="small"
                                                    onDelete={() => handleToggleProduct(pName)}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* LIVE TOTAL BREAKDOWN */}
                        {(formData.servicesPerformed.length > 0 || formData.productsBought.length > 0) && (
                            <div className="flex items-center justify-between p-3.5 bg-stone-100 border border-stone-200 rounded-xl text-sm">
                                <div className="space-y-0.5">
                                    <span className="text-xs text-stone-700 font-medium block">
                                        Total calculado (servicios + productos):
                                    </span>
                                    <div className="flex items-center gap-3 text-xs text-stone-500 tabular-nums">
                                        <span>Servicios: ${estimatedServicesTotal.toLocaleString("es-AR")}</span>
                                        <span>•</span>
                                        <span>Productos: ${estimatedProductsTotal.toLocaleString("es-AR")}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-stone-900 tabular-nums">
                                        ${totalEstimated.toLocaleString("es-AR")}
                                    </span>
                                    {formData.payment !== totalEstimated.toString() && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, payment: totalEstimated.toString() }))}
                                            className="block text-[11px] text-[#0b3a60] font-semibold hover:underline cursor-pointer"
                                        >
                                            Aplicar a monto
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                                Descripción o notas
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                rows={2}
                                className="px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b3a60]/20 focus:border-[#0b3a60] transition-all resize-none"
                                placeholder="Notas adicionales del cobro (opcional)"
                            />
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-stone-200">
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
                                {editingRecord ? "Actualizar" : "Registrar"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar Cobro"
                message="¿Estás seguro de que querés eliminar este cobro? Esta acción no se puede deshacer."
            />
        </div>
    );
}
