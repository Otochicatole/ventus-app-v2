"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, Search, ShoppingBag, Layers, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Dialog, { DialogContent } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import Alert from "@/components/ui/alert";

type Product = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        active: true,
    });
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products", {
                cache: "no-store",
            });
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || "",
                price: product.price.toString(),
                stock: product.stock !== null && product.stock !== undefined ? product.stock.toString() : "",
                active: product.active,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
                active: true,
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingProduct(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            active: true,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const url = editingProduct
                ? `/api/products/${editingProduct.id}`
                : "/api/products";
            const method = editingProduct ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error al guardar producto");
            }

            setMessage({
                type: "success",
                text: editingProduct
                    ? "Producto actualizado exitosamente"
                    : "Producto creado exitosamente",
            });

            handleCloseDialog();
            fetchProducts();
        } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Error al guardar producto",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`/api/products/${deleteId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Error al eliminar producto");
            }

            setMessage({
                type: "success",
                text: "Producto eliminado exitosamente",
            });

            fetchProducts();
        } catch (error) {
            setMessage({
                type: "error",
                text: "Error al eliminar producto",
            });
        } finally {
            setDeleteId(null);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                product.name.toLowerCase().includes(searchLower) ||
                (product.description && product.description.toLowerCase().includes(searchLower)) ||
                product.price.toString().includes(searchLower)
            );
        });
    }, [products, searchTerm]);

    const activeCount = useMemo(() => products.filter((p) => p.active).length, [products]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0b3a60] border-t-transparent"></div>
                <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Cargando productos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Productos</h1>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                        Línea de cosmética capilar, pomadas y cuidado de barba
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    startIcon={<Plus className="w-4 h-4" />}
                >
                    Agregar Producto
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
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">Total Productos</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-stone-900">{products.length}</span>
                </div>
                <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-4">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">Activos para la venta</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-emerald-700">{activeCount}</span>
                </div>
                <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-4 col-span-2 sm:col-span-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">Pausados / Inactivos</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-stone-500">{products.length - activeCount}</span>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Buscar productos por nombre, marca o precio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b3a60] focus:border-transparent transition-all"
                />
            </div>

            {/* List */}
            {filteredProducts.length === 0 ? (
                <Card>
                    <CardContent>
                        <div className="flex flex-col items-center gap-3 py-16 text-stone-400">
                            <ShoppingBag className="w-12 h-12 text-stone-300" />
                            <p className="text-xs uppercase tracking-wider font-semibold">
                                {searchTerm
                                    ? "No se encontraron productos con ese criterio"
                                    : "No hay productos registrados en el inventario"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-[#0b3a60] hover:shadow-xs space-y-4"
                        >
                            <div className="space-y-2.5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                                            <ShoppingBag className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-base font-bold text-stone-900 leading-tight">
                                            {product.name}
                                        </h3>
                                    </div>
                                    <span
                                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                            product.active
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-stone-100 text-stone-500 border border-stone-200"
                                        }`}
                                    >
                                        {product.active ? (
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

                                {product.description ? (
                                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                                        {product.description}
                                    </p>
                                ) : (
                                    <p className="text-xs text-stone-400 italic">
                                        Sin descripción cargada
                                    </p>
                                )}
                            </div>

                            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <span className="text-lg font-extrabold text-stone-900 tracking-tight block">
                                        ${product.price.toLocaleString("es-AR")}
                                    </span>
                                    {product.stock !== null && product.stock !== undefined && (
                                        <div className="flex items-center gap-1 text-[11px] text-stone-500">
                                            <Layers className="w-3 h-3 text-stone-400" />
                                            <span>Stock: {product.stock} un.</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenDialog(product)}
                                        className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                                        title="Editar producto"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteId(product.id)}
                                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        title="Eliminar producto"
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
                title={editingProduct ? "Editar Producto" : "Nuevo Producto"}
            >
                <DialogContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Nombre del producto"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            fullWidth
                            placeholder="Ej. Pomada Modeladora Mate 100g"
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
                                placeholder="Propiedades, aroma, fijación o contenido..."
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
                                label="Stock disponible (unidades)"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                fullWidth
                                placeholder="Opcional"
                            />
                        </div>

                        <div className="flex items-center gap-2.5 pt-2">
                            <input
                                type="checkbox"
                                id="product-active"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="w-4 h-4 rounded border-stone-300 text-[#0b3a60] focus:ring-[#0b3a60] cursor-pointer"
                            />
                            <label htmlFor="product-active" className="text-xs font-semibold text-stone-700 cursor-pointer select-none">
                                Producto activo y disponible para la venta
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
                                {editingProduct ? "Actualizar Producto" : "Crear Producto"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar Producto"
                message="¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer."
            />
        </div>
    );
}
