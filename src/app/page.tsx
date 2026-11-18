"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import AnimatedSpheres from "@/components/AnimatedSpheres";
import CustomCursor from "@/components/CustomCursor";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-stone-100 py-24 px-6 sm:px-12 md:px-24">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="h-10 bg-stone-200 w-64" />
          <div className="h-14 bg-stone-200 w-80" />
        </div>
        <div className="grid lg:grid-cols-12 gap-8 h-[600px]">
          <div className="lg:col-span-4 bg-white h-full" />
          <div className="lg:col-span-8 bg-stone-200 h-full" />
        </div>
      </div>
    </div>
  ),
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
  const [showContent, setShowContent] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

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
          setServices(data.filter((s: Service) => s.active));
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
    } catch {
      setSubmitError("No se pudo conectar con el servidor. Intentalo de nuevo.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const appleEase = [0.16, 1, 0.3, 1] as const;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
    exit: {
      opacity: 0,
      scale: 1.35,
      y: -60,
      filter: "blur(20px)",
      transition: { duration: 1.2, ease: [0.6, -0.05, 0.01, 0.99] as const },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: appleEase },
    },
  };

  return (
    <div className="bg-stone-50 text-stone-900 font-sans min-h-dvh selection:bg-[#0b3a60] selection:text-white">
      <CustomCursor />

      <div className="relative" style={{ zIndex: 10 }}>
        {/* HERO SECTION */}
        <section className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-start py-20 px-6 sm:px-12 md:px-24 overflow-clip">
          <AnimatedSpheres onLoadComplete={handleLoadComplete} />

          <motion.div
            aria-hidden="true"
            variants={containerVariants}
            initial="hidden"
            animate={showContent ? "exit" : "visible"}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[60px] sm:text-[80px] md:text-[120px] lg:text-[160px] xl:text-[200px] font-black uppercase tracking-tighter whitespace-nowrap text-stone-900 select-none pointer-events-none flex"
            style={{ zIndex: 0 }}
          >
            {Array.from("VENTUS").map((letter, index) => (
              <motion.span key={index} variants={letterVariants} className="inline-block">
                {letter}
              </motion.span>
            ))}
          </motion.div>

          <div className="max-w-4xl space-y-7 relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1.0, delay: 0.18, ease: appleEase }}
              className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tight leading-[1.02] text-stone-900"
            >
              Elegancia y precisión <br />
              en cada corte.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 1.0, delay: 0.32, ease: appleEase }}
              className="text-lg md:text-xl font-normal text-stone-700 max-w-2xl leading-relaxed"
            >
              Barbería contemporánea en Buenos Aires. Técnicas clásicas de tijera y navaja con
              atención reservada por turno.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 1.0, delay: 0.44, ease: appleEase }}
              className="pt-4 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/shifts"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#0b3a60] text-white text-sm font-semibold hover:bg-[#082a46] transition-colors duration-200 group"
              >
                Reservar turno
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#services-section"
                className="inline-flex items-center gap-2 px-6 py-4 bg-white text-stone-900 text-sm font-semibold hover:bg-stone-100 transition-colors duration-200"
              >
                Ver servicios y tarifas
              </a>
            </motion.div>
          </div>
        </section>

        {/* SERVICES LEDGER */}
        <section
          id="services-section"
          className="bg-white py-24 sm:py-32 px-6 sm:px-12 md:px-24 scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto space-y-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-stone-950">
                Servicios y tarifas
              </h2>
              <p className="text-stone-600 max-w-md text-sm sm:text-base leading-relaxed">
                Cada sesión incluye diagnóstico, lavado y terminación con productos profesionales.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center gap-3 py-12">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0b3a60] border-t-transparent" />
                <p className="text-stone-600 text-sm font-medium">Cargando servicios...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="py-16 text-center bg-stone-50">
                <p className="text-stone-600 text-sm">
                  No hay servicios disponibles en este momento.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-stone-50 p-7 sm:p-8 flex flex-col justify-between gap-6 hover:bg-stone-100 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="space-y-2 min-w-0">
                        <h3 className="text-xl font-semibold tracking-tight text-stone-900">
                          {service.name}
                        </h3>
                        {service.description && (
                          <p className="text-stone-600 text-sm leading-relaxed">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <span className="text-2xl font-bold text-[#0b3a60] tabular-nums shrink-0">
                        ${service.price.toLocaleString("es-AR")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-stone-600">
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <Clock className="w-4 h-4 text-[#0b3a60]" />
                        {service.duration} minutos
                      </span>
                      <Link
                        href="/shifts"
                        className="font-semibold text-[#0b3a60] hover:underline"
                      >
                        Reservar
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* INTERACTIVE LOCATIONS MAP */}
        <InteractiveMap />

        {/* REVIEWS SECTION */}
        <section
          id="reviews-section"
          className="bg-white py-24 sm:py-32 px-6 sm:px-12 md:px-24 scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto space-y-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-stone-950">
                Opiniones de clientes
              </h2>
              <p className="text-stone-600 max-w-md text-sm sm:text-base leading-relaxed">
                Compartí tu experiencia de forma anónima. Tu valoración nos ayuda a cuidar cada detalle.
              </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-12 items-start">
              <form
                onSubmit={handleSubmitReview}
                className="lg:col-span-5 bg-stone-50 p-7 sm:p-9 space-y-6"
              >
                <h3 className="text-lg font-bold tracking-tight text-stone-900">
                  Dejanos tu reseña
                </h3>

                <div className="space-y-2">
                  <label
                    htmlFor="review-author"
                    className="text-xs font-semibold text-stone-700 block"
                  >
                    Nombre o alias (opcional)
                  </label>
                  <input
                    id="review-author"
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="Anónimo"
                    maxLength={30}
                    className="w-full border border-stone-300 p-3 text-sm bg-white text-stone-900 focus:outline-none focus:border-[#0b3a60] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-stone-700 block">
                    Calificación
                  </span>
                  <div className="flex items-center gap-1.5" role="group" aria-label="Calificación en estrellas">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = hoverRating ? star <= hoverRating : star <= formRating;
                      return (
                        <button
                          key={star}
                          type="button"
                          aria-label={`${star} ${star === 1 ? "estrella" : "estrellas"}`}
                          onClick={() => setFormRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-0.5 transition-transform duration-150 active:scale-90 cursor-pointer"
                        >
                          <svg
                            className={`w-7 h-7 transition-colors ${
                              isFilled
                                ? "text-[#0b3a60] fill-[#0b3a60]"
                                : "text-stone-300 fill-transparent"
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

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="review-comment"
                      className="text-xs font-semibold text-stone-700"
                    >
                      Tu opinión
                    </label>
                    <span className="text-xs text-stone-600 tabular-nums">
                      {formComment.length}/500
                    </span>
                  </div>
                  <textarea
                    id="review-comment"
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="Contanos qué te pareció el servicio, los profesionales o el ambiente..."
                    maxLength={500}
                    required
                    rows={4}
                    className="w-full border border-stone-300 p-3.5 text-sm bg-white text-stone-900 focus:outline-none focus:border-[#0b3a60] transition-colors resize-none leading-relaxed"
                  />
                </div>

                {submitError && (
                  <div role="alert" className="text-xs font-semibold text-red-700 bg-red-50 p-3">
                    {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div role="status" className="text-xs font-semibold text-emerald-800 bg-emerald-50 p-3">
                    ¡Tu reseña fue publicada correctamente!
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitLoading || !formComment.trim()}
                  className="w-full py-3.5 bg-[#0b3a60] text-white text-sm font-semibold hover:bg-[#082a46] disabled:bg-stone-300 disabled:text-stone-600 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Publicando...
                    </>
                  ) : (
                    "Publicar reseña"
                  )}
                </button>
              </form>

              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-lg font-bold tracking-tight text-stone-900">
                  Historial de reseñas
                </h3>

                {reviewsLoading ? (
                  <div className="flex items-center gap-3 py-12 bg-stone-50 px-6">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0b3a60] border-t-transparent" />
                    <p className="text-stone-600 text-sm font-medium">Cargando opiniones...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="py-16 text-center bg-stone-50 px-6 space-y-2">
                    <p className="text-stone-900 text-sm font-semibold">Aún no hay opiniones</p>
                    <p className="text-stone-600 text-sm">
                      ¡Sé el primero en compartir tu experiencia con nosotros!
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[540px] overflow-y-auto space-y-3 pr-2">
                    <AnimatePresence initial={false}>
                      {reviews.map((review) => (
                        <motion.article
                          key={review.id}
                          initial={{ opacity: 0, y: -16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -16 }}
                          transition={{ duration: 0.3, ease: appleEase }}
                          className="bg-stone-50 p-6 space-y-3"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-sm font-bold text-stone-900">
                                {review.author}
                              </h4>
                              <p className="text-xs text-stone-600 mt-0.5 tabular-nums">
                                {new Date(review.createdAt).toLocaleDateString("es-AR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="flex gap-0.5" aria-label={`${review.rating} de 5 estrellas`}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? "text-[#0b3a60] fill-[#0b3a60]"
                                      : "text-stone-300 fill-transparent"
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
                          <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {review.comment}
                          </p>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-stone-950 text-stone-300 py-16 px-6 sm:px-12 md:px-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 block"
              />
              <span className="text-white font-bold text-lg tracking-tight">
                Ventus Barbería
              </span>
            </div>
            <div className="text-center md:text-right space-y-1">
              <p className="text-sm text-stone-300">
                © {new Date().getFullYear()} Ventus. Todos los derechos reservados.
              </p>
              <p className="text-xs text-stone-400">
                Buenos Aires, Argentina
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
