"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Clock, ArrowRight } from "lucide-react";
import AnimatedSpheres from "@/components/AnimatedSpheres";
import CustomCursor from "@/components/CustomCursor";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
    ssr: false,
    loading: () => (
        <div className="bg-white border-t border-stone-200 py-24 px-6 sm:px-12 md:px-24">
            <div className="max-w-7xl mx-auto space-y-12 animate-pulse">
                <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-stone-100 pb-8">
                    <div className="space-y-4">
                        <div className="h-4 bg-stone-200 w-32"></div>
                        <div className="h-10 bg-stone-300 w-64"></div>
                    </div>
                    <div className="h-14 bg-stone-200 w-80"></div>
                </div>
                <div className="grid lg:grid-cols-12 gap-8 h-[600px]">
                    <div className="lg:col-span-4 bg-stone-100 h-full"></div>
                    <div className="lg:col-span-8 bg-stone-200 h-full"></div>
                </div>
            </div>
        </div>
    )
});

type Service = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    active: boolean;
};

type Review = {
    id: string;
    author: string;
    rating: number;
    comment: string;
    createdAt: string;
};

export default function Home() {
    // Servicios
    const [showContent, setShowContent] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    // Reseñas
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formAuthor, setFormAuthor] = useState("");
    const [formRating, setFormRating] = useState(5);
    const [formComment, setFormComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleLoadComplete = useCallback(() => {
        setShowContent(true);
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch("/api/services", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    const activeServices = data.filter((s: Service) => s.active);
                    setServices(activeServices);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const res = await fetch("/api/reviews", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchServices();
        fetchReviews();
    }, []);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formComment.trim()) return;

        setSubmitLoading(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    author: formAuthor,
                    rating: formRating,
                    comment: formComment,
                }),
            });

            if (res.ok) {
                const newReview = await res.json();
                // Bucle de feedback instantáneo: insertar al inicio en tiempo real
                setReviews((prev) => [newReview, ...prev]);
                setFormAuthor("");
                setFormRating(5);
                setFormComment("");
                setSubmitSuccess(true);
                setTimeout(() => setSubmitSuccess(false), 4500);
            } else {
                const data = await res.json();
                setSubmitError(data.error || "Ocurrió un error al publicar tu opinión");
            }
        } catch (error) {
            setSubmitError("No se pudo conectar con el servidor. Intentalo de nuevo.");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Definición de curvas de transición cinematográficas de Apple
    const appleEase = [0.16, 1, 0.3, 1] as const; // Curva de desaceleración ultra-suave

    // Variantes de animación premium para el efecto de máquina de escribir y difuminado cinemático
    const containerVariants = {
        hidden: { 
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15, // Retraso secuencial entre letras
                delayChildren: 0.2,    // Espera inicial antes de arrancar
            }
        },
        exit: {
            opacity: 0,
            scale: 1.35,
            y: -60,
            filter: "blur(20px)",
            transition: {
                duration: 1.2,
                ease: [0.6, -0.05, 0.01, 0.99] as const
            }
        }
    };

    const letterVariants = {
        hidden: { 
            opacity: 0, 
            y: 25,
            filter: "blur(6px)"
        },
        visible: { 
            opacity: 1, 
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.8,
                ease: appleEase
            }
        }
    };

    return (
        <div className="bg-stone-50 text-stone-900 font-sans min-h-screen selection:bg-[#0b3a60] selection:text-white">
            <CustomCursor />

            {/* Contenido Principal con Animación y Transiciones Cohesionadas */}
            <div className="relative" style={{ zIndex: 10 }}>
                
                {/* HERO SECTION - Animación 3D acotada a los primeros 100vh */}
                <section className="relative min-h-screen flex items-center justify-start py-20 px-6 sm:px-12 md:px-24 overflow-hidden">
                    <AnimatedSpheres onLoadComplete={handleLoadComplete} />

                    {/* Pantalla de carga animada con efecto typing y salida Blur-Scale Cinematográfica */}
                    <motion.h1
                        variants={containerVariants}
                        initial="hidden"
                        animate={showContent ? "exit" : "visible"}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[60px] sm:text-[80px] md:text-[120px] lg:text-[160px] xl:text-[200px] font-black uppercase tracking-tighter whitespace-nowrap text-stone-900 select-none pointer-events-none flex"
                        style={{ zIndex: 0 }}
                    >
                        {Array.from("VENTUS").map((letter, index) => (
                            <motion.span
                                key={index}
                                variants={letterVariants}
                                className="inline-block"
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </motion.h1>

                    <div className="max-w-4xl space-y-8 relative z-10">
                        <div className="space-y-4">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 1.0, delay: 0.1, ease: appleEase }}
                                className="text-xs font-bold tracking-[0.3em] text-[#0b3a60] uppercase"
                            >
                                BARBERÍA PREMIUM
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 1.1, delay: 0.22, ease: appleEase }}
                                className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tight leading-[1.05] text-stone-900"
                            >
                                Tu Estilo. <br />
                                <span className="font-semibold text-[#0b3a60]">Nuestra Pasión.</span>
                            </motion.h2>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 1.1, delay: 0.35, ease: appleEase }}
                            className="text-lg md:text-xl font-light text-stone-600 max-w-2xl leading-relaxed"
                        >
                            Experimentá el arte del estilismo clásico con técnicas contemporáneas. Diseñado para quienes aprecian los detalles limpios, la simetría impecable y una atención verdaderamente personalizada.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 1.1, delay: 0.48, ease: appleEase }}
                            className="pt-6"
                        >
                            <a
                                href="#services-section"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-white text-sm font-semibold uppercase tracking-widest hover:bg-[#0b3a60] transition-colors duration-300 rounded-none shadow-sm group"
                            >
                                Explorar Servicios
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* SERVICES SECTION */}
                <section id="services-section" className="bg-white border-t border-stone-200 py-24 px-6 sm:px-12 md:px-24 scroll-mt-16">
                    <div className="max-w-7xl mx-auto space-y-16">
                        
                        {/* Cabecera de Sección */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200 pb-10 gap-6">
                            <div className="space-y-3">
                                <span className="text-xs font-bold tracking-[0.25em] text-[#0b3a60] uppercase">
                                    NUESTRO MENÚ
                                </span>
                                <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-stone-950">
                                    Servicios & <span className="font-semibold text-[#0b3a60]">Tarifas</span>
                                </h2>
                            </div>
                            <p className="text-stone-500 max-w-md font-light text-sm leading-relaxed">
                                Un abanico de tratamientos diseñados minuciosamente para cuidar tu aspecto, utilizando insumos de calidad superior en un ambiente privado y sofisticado.
                            </p>
                        </div>

                        {/* Listado de Servicios */}
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 py-16">
                                <div className="animate-spin rounded-none h-6 w-6 border border-stone-900 border-t-transparent"></div>
                                <p className="text-stone-500 text-sm font-medium uppercase tracking-widest">
                                    Cargando catálogo...
                                </p>
                            </div>
                        ) : services.length === 0 ? (
                            <div className="py-20 text-center border border-dashed border-stone-300 rounded-none bg-stone-50/50">
                                <p className="text-stone-400 text-sm uppercase tracking-widest">
                                    No hay servicios disponibles en este momento.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-stone-200">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="border-r border-b border-stone-200 p-8 sm:p-10 flex flex-col justify-between hover:bg-stone-50/50 transition-colors duration-300 group"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-[#0b3a60] transition-colors">
                                                    {service.name}
                                                </h3>
                                                <div className="w-8 h-8 border border-stone-200 flex items-center justify-center shrink-0 group-hover:border-[#0b3a60] transition-colors">
                                                    <Scissors className="w-4 h-4 text-stone-400 group-hover:text-[#0b3a60] transition-colors" />
                                                </div>
                                            </div>

                                            {service.description && (
                                                <p className="text-stone-500 text-sm font-light leading-relaxed min-h-[60px]">
                                                    {service.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-10 border-t border-stone-100 mt-6 flex justify-between items-end">
                                            <div className="flex items-center gap-1.5 text-stone-500">
                                                <Clock className="w-4 h-4 text-stone-400" />
                                                <span className="text-xs font-semibold tracking-wider uppercase">
                                                    {service.duration} MIN
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-bold text-[#0b3a60] tracking-tight">
                                                    ${service.price.toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* SECCIÓN DE MAPA INTERACTIVO DE LOCALES */}
                <InteractiveMap />

                {/* ANONYMOUS REVIEWS SECTION */}
                <section id="reviews-section" className="bg-stone-50 border-t border-stone-200 py-24 px-6 sm:px-12 md:px-24 scroll-mt-16">
                    <div className="max-w-7xl mx-auto space-y-16">
                        
                        {/* Cabecera */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200 pb-10 gap-6">
                            <div className="space-y-3">
                                <span className="text-xs font-bold tracking-[0.25em] text-[#0b3a60] uppercase">
                                    EXPERIENCIAS
                                </span>
                                <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-stone-950">
                                    Opiniones de <span className="font-semibold text-[#0b3a60]">Clientes</span>
                                </h2>
                            </div>
                            <p className="text-stone-500 max-w-md font-light text-sm leading-relaxed">
                                Compartí tu opinión de forma totalmente anónima. Tu valoración nos ayuda a seguir perfeccionando nuestro servicio.
                            </p>
                        </div>

                        {/* Contenedor Principal */}
                        <div className="grid gap-12 lg:grid-cols-12 items-start">
                            
                            {/* Columna Formulario (Izquierda) */}
                            <form 
                                onSubmit={handleSubmitReview}
                                className="lg:col-span-5 bg-white border border-stone-200 p-8 sm:p-10 space-y-6 shadow-sm"
                            >
                                <h3 className="text-lg font-bold tracking-tight text-stone-900">
                                    Dejanos tu reseña
                                </h3>

                                {/* Alias / Nombre Opcional */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                        Nombre / Alias
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formAuthor} 
                                        onChange={(e) => setFormAuthor(e.target.value)}
                                        placeholder="Anónimo (opcional)" 
                                        maxLength={30}
                                        className="w-full border border-stone-200 p-3 text-sm font-light rounded-none bg-stone-50/50 focus:outline-none focus:border-[#0b3a60] transition-colors"
                                    />
                                </div>

                                {/* Calificación por Estrellas */}
                                <div className="space-y-2.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                                        Calificación
                                    </label>
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isFilled = hoverRating ? star <= hoverRating : star <= formRating;
                                            return (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFormRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="transition-transform duration-150 active:scale-90"
                                                >
                                                    <svg
                                                        className={`w-8 h-8 transition-colors ${
                                                            isFilled ? "text-[#0b3a60] fill-[#0b3a60]" : "text-stone-200 fill-transparent"
                                                        }`}
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M11.48 3.499c.196-.391.768-.391.964 0l3.01 6.116 6.748.981c.43.063.602.592.292.897l-4.882 4.757 1.153 6.722c.073.43-.377.757-.763.553L12 20.354l-6.02 3.167c-.386.203-.836-.124-.763-.553l1.152-6.722-4.882-4.757c-.309-.305-.137-.834.292-.897l6.748-.981 3.01-6.116z"
                                                        />
                                                    </svg>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Comentario */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                            Tu Opinión
                                        </label>
                                        <span className="text-[10px] font-semibold text-stone-400">
                                            {formComment.length}/500
                                        </span>
                                    </div>
                                    <textarea
                                        value={formComment}
                                        onChange={(e) => setFormComment(e.target.value)}
                                        placeholder="Contanos qué te pareció el servicio, los profesionales o el ambiente..."
                                        maxLength={500}
                                        required
                                        rows={4}
                                        className="w-full border border-stone-200 p-4 text-sm font-light rounded-none bg-stone-50/50 focus:outline-none focus:border-[#0b3a60] transition-colors resize-none leading-relaxed"
                                    />
                                </div>

                                {/* Notificaciones */}
                                {submitError && (
                                    <div className="text-xs font-semibold text-red-600 bg-red-50 border-l-2 border-red-500 p-3 rounded-none">
                                        {submitError}
                                    </div>
                                )}
                                {submitSuccess && (
                                    <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border-l-2 border-emerald-500 p-3 rounded-none">
                                        ¡Tu reseña fue publicada correctamente!
                                    </div>
                                )}

                                {/* Botón de Enviar */}
                                <button
                                    type="submit"
                                    disabled={submitLoading || !formComment.trim()}
                                    className="w-full py-4 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-[#0b3a60] disabled:bg-stone-200 disabled:text-stone-400 transition-colors duration-300 rounded-none shadow-sm flex items-center justify-center gap-2"
                                >
                                    {submitLoading ? (
                                        <>
                                            <div className="animate-spin rounded-none h-4.5 w-4.5 border border-white border-t-transparent" />
                                            Publicando...
                                        </>
                                    ) : (
                                        "Publicar Reseña"
                                    )}
                                </button>
                            </form>

                            {/* Columna Historial (Derecha) */}
                            <div className="lg:col-span-7 space-y-6">
                                <h3 className="text-lg font-bold tracking-tight text-stone-900">
                                    Historial de Reseñas
                                </h3>

                                {reviewsLoading ? (
                                    <div className="flex items-center justify-center gap-3 py-16 bg-white border border-stone-200 shadow-sm">
                                        <div className="animate-spin rounded-none h-6 w-6 border border-[#0b3a60] border-t-transparent"></div>
                                        <p className="text-stone-500 text-sm font-medium uppercase tracking-widest">
                                            Cargando opiniones...
                                        </p>
                                    </div>
                                ) : reviews.length === 0 ? (
                                    <div className="py-20 text-center border border-dashed border-stone-200 bg-white rounded-none flex flex-col items-center justify-center gap-3 shadow-sm">
                                        <p className="text-stone-400 text-sm uppercase tracking-widest">
                                            Aún no hay opiniones
                                        </p>
                                        <p className="text-stone-500 text-xs font-light max-w-xs">
                                            ¡Sé el primero en compartir tu experiencia con nosotros!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="max-h-[550px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
                                        <AnimatePresence initial={false}>
                                            {reviews.map((review) => (
                                                <motion.div 
                                                    key={review.id}
                                                    initial={{ opacity: 0, y: -20, height: 0 }}
                                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                                    exit={{ opacity: 0, y: -20, height: 0 }}
                                                    transition={{ duration: 0.4, ease: appleEase }}
                                                    className="bg-white border border-stone-200 p-6 space-y-4 shadow-sm hover:border-[#0b3a60] transition-colors duration-300 rounded-none overflow-hidden"
                                                >
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="space-y-1">
                                                            <h4 className="text-sm font-bold text-stone-900">
                                                                {review.author}
                                                            </h4>
                                                            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                                                                {new Date(review.createdAt).toLocaleDateString('es-AR', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                        {/* Estrellas estáticas */}
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <svg
                                                                    key={star}
                                                                    className={`w-4 h-4 ${
                                                                        star <= review.rating ? "text-[#0b3a60] fill-[#0b3a60]" : "text-stone-200 fill-transparent"
                                                                    }`}
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M11.48 3.499c.196-.391.768-.391.964 0l3.01 6.116 6.748.981c.43.063.602.592.292.897l-4.882 4.757 1.153 6.722c.073.43-.377.757-.763.553L12 20.354l-6.02 3.167c-.386.203-.836-.124-.763-.553l1.152-6.722-4.882-4.757c-.309-.305-.137-.834.292-.897l6.748-.981 3.01-6.116z"
                                                                    />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-stone-600 text-sm font-light leading-relaxed whitespace-pre-wrap break-words">
                                                        {review.comment}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-stone-950 text-stone-400 border-t border-stone-900 py-16 px-6 sm:px-12 md:px-24">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#0b3a60] flex items-center justify-center">
                                <Scissors className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-stone-100 font-extrabold uppercase tracking-widest text-base">
                                VENTUS BARBERÍA
                            </span>
                        </div>
                        <div className="text-center md:text-right space-y-2">
                            <p className="text-xs font-semibold tracking-widest uppercase text-stone-500">
                                © {new Date().getFullYear()} Ventus. Todos los derechos reservados.
                            </p>
                            <p className="text-xs text-stone-600 font-light">
                                Diseñado con un enfoque minimalista, tonos azul premium y alta precisión.
                            </p>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
}
