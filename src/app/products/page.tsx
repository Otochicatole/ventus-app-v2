"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, DollarSign, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

type Product = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number | null;
    active: boolean;
};

export default function ProductsPublicPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products", {
                cache: "no-store",
            });
            const data = await res.json();
            const activeProducts = data.filter((product: Product) => product.active);
            setProducts(activeProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-center justify-center gap-3 py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0b3a60] border-t-transparent"></div>
                        <p className="text-gray-600">Cargando productos...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-xs font-bold tracking-[0.25em] text-[#0b3a60] uppercase mb-2 block">
                        CUIDADO PERSONAL
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
                        Nuestros Productos
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto font-light">
                        Llevate a casa la mejor línea de productos profesionales para el cuidado del cabello y barba.
                    </p>
                </motion.div>

                {products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border-dashed border-2 border-stone-300">
                            <CardContent>
                                <div className="flex flex-col items-center gap-4 py-16 text-stone-500">
                                    <ShoppingBag className="w-16 h-16 text-stone-300" />
                                    <p className="text-center text-sm font-medium uppercase tracking-wider">
                                        Próximamente catálogo de productos disponibles en sucursales
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                whileHover={{ y: -4 }}
                            >
                                <Card className="hover:shadow-lg hover:border-stone-400 transition-all h-full bg-white border border-stone-200 rounded-none flex flex-col justify-between">
                                    <CardContent className="p-8 flex flex-col h-full justify-between">
                                        <div>
                                            <div className="w-12 h-12 bg-[#0b3a60] text-white flex items-center justify-center mb-6">
                                                <ShoppingBag className="w-6 h-6" />
                                            </div>

                                            <h3 className="text-xl font-bold text-stone-900 mb-2">
                                                {product.name}
                                            </h3>

                                            {product.description && (
                                                <p className="text-stone-600 text-sm font-light leading-relaxed mb-6">
                                                    {product.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="w-full border-t border-stone-200 pt-6 flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-2xl font-bold text-[#0b3a60]">
                                                <span>${product.price.toLocaleString("es-AR")}</span>
                                            </div>

                                            {product.stock !== null && product.stock !== undefined && (
                                                <span className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                                                    <Layers className="w-3.5 h-3.5" />
                                                    {product.stock > 0 ? `${product.stock} en stock` : "Consultar"}
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
