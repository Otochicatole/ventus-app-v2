"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Layers } from "lucide-react";

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
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.filter((product: Product) => product.active));
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-dvh bg-stone-50 py-16 px-6 sm:px-12">
                <div className="max-w-6xl mx-auto flex items-center gap-3 py-12">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#0b3a60] border-t-transparent" />
                    <p className="text-stone-700 text-sm font-medium">Cargando productos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-stone-50 py-16 px-6 sm:px-12">
            <div className="max-w-6xl mx-auto space-y-14">
                <header className="space-y-3">
                    <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-stone-950">
                        Productos de cuidado personal
                    </h1>
                    <p className="text-base sm:text-lg text-stone-600 max-w-2xl">
                        Línea profesional para cabello y barba disponible en nuestras sucursales.
                    </p>
                </header>

                {products.length === 0 ? (
                    <div className="bg-white p-14 text-center space-y-3">
                        <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto" />
                        <p className="text-stone-700 text-sm font-medium">
                            Próximamente catálogo de productos disponibles en sucursales.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <article
                                key={product.id}
                                className="bg-white p-7 sm:p-8 flex flex-col justify-between gap-6"
                            >
                                <div className="space-y-2.5">
                                    <h2 className="text-xl font-semibold tracking-tight text-stone-900">
                                        {product.name}
                                    </h2>
                                    {product.description && (
                                        <p className="text-stone-600 text-sm leading-relaxed">
                                            {product.description}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-stone-50 p-4 flex items-center justify-between gap-4">
                                    <span className="text-2xl font-bold text-[#0b3a60] tabular-nums">
                                        ${product.price.toLocaleString("es-AR")}
                                    </span>
                                    {product.stock !== null && product.stock !== undefined && (
                                        <span className="text-xs font-medium text-stone-600 inline-flex items-center gap-1.5 tabular-nums">
                                            <Layers className="w-3.5 h-3.5 text-[#0b3a60]" />
                                            {product.stock > 0 ? `${product.stock} en stock` : "Consultar"}
                                        </span>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
