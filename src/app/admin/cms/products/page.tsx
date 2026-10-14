"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, ShoppingBag, DollarSign, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Dialog, { DialogContent } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import Alert from "@/components/ui/alert";
import Chip from "@/components/ui/chip";

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

    const filteredProducts = products.filter((product) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchLower) ||
            (product.description && product.description.toLowerCase().includes(searchLower)) ||
            product.price.toString().includes(searchLower)
        );
    });

    if (loading) {
        return (
            <div className="flex items-center gap-3 py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                <p className="text-gray-600">Cargando productos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Gestión de productos para la venta en el local
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    startIcon={<Plus className="w-5 h-5" />}
                >
                    Agregar Producto
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
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12"
                />
            </div>

            {filteredProducts.length === 0 ? (
                <Card>
                    <CardContent>
                        <div className="flex flex-col items-center gap-4 py-12 text-gray-500">
                            <ShoppingBag className="w-16 h-16 text-gray-300" />
                            <p>
                                {searchTerm
                                    ? "No se encontraron productos con ese criterio"
                                    : "No hay productos registrados"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredProducts.map((product) => (
                        <Card key={product.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {product.name}
                                            </h3>
                                            <Chip
                                                label={product.active ? "Activo" : "Inactivo"}
                                                color={product.active ? "success" : "default"}
                                                variant="soft"
                                                size="small"
                                            />
                                        </div>
                                        {product.description && (
                                            <p className="text-gray-600 mb-4">{product.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="font-semibold text-base">
                                                    ${product.price.toLocaleString("es-AR")}
                                                </span>
                                            </div>
                                            {product.stock !== null && product.stock !== undefined && (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Layers className="w-4 h-4 text-blue-600" />
                                                    <span>Stock: {product.stock} u.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenDialog(product)}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            <span className="sm:hidden">Editar</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteId(product.id)}
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
                title={editingProduct ? "Editar Producto" : "Agregar Producto"}
            >
                <DialogContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Nombre del producto"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            fullWidth
                            placeholder="Ej. Pomada Modeladora Mate, Aceite para Barba..."
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
                                placeholder="Descripción o detalles del producto (opcional)"
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
                                label="Stock (unidades)"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                fullWidth
                                placeholder="Opcional"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="product-active"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            />
                            <label htmlFor="product-active" className="text-sm font-medium text-gray-700">
                                Producto activo para la venta
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
                                {editingProduct ? "Actualizar" : "Crear"}
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
