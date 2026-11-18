"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-stone-100 py-20 px-6 sm:px-12 md:px-24">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="h-10 bg-stone-200 w-64" />
        <div className="grid lg:grid-cols-12 gap-6 h-[560px]">
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

type LocationSummary = {
  id: string;
  _count?: {
    timeSlots?: number;
  };
};

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasBookingTimeSlots, setHasBookingTimeSlots] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formAuthor, setFormAuthor] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/locations", { cache: "no-store" });
        if (res.ok) {
          const data: LocationSummary[] = await res.json();
          setHasBookingTimeSlots(
            Array.isArray(data) && data.some((loc) => (loc._count?.timeSlots ?? 0) > 0)
          );
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchServices();
    fetchReviews();
    fetchLocations();
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

  const featuredReview = reviews.find((r) => r.rating >= 4) ?? reviews[0] ?? null;
  const editorialEase = [0.22, 1, 0.36, 1] as const;

  const reveal = (delay = 0) => ({
    initial: prefersReducedMotion ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.55, delay, ease: editorialEase },
  });

  return (
    <div className="bg-stone-100 text-stone-950 font-sans min-h-dvh selection:bg-[#0b3a60] selection:text-white">
      {/* 1. HERO — Above-the-fold Editorial Split */}
      <section className="bg-stone-100 min-h-[calc(100dvh-4rem)] px-6 sm:px-10 lg:px-16 py-8 lg:py-10 flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: editorialEase }}
              className="font-serif font-normal text-[clamp(2.5rem,5.2vw,4.75rem)] leading-[1.03] tracking-[-0.03em] text-stone-950 max-w-[14ch]"
            >
              Corte clásico, navaja y oficio.
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: editorialEase }}
              className="text-base sm:text-lg text-stone-700 max-w-[44ch] leading-relaxed"
            >
              {hasBookingTimeSlots
                ? "Barbería tradicional en Buenos Aires. Atención individual con cita previa, toalla caliente y terminación de precisión."
                : "Barbería tradicional en Buenos Aires. Corte clásico a tijera, toalla caliente y terminación de precisión."}
            </motion.p>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: editorialEase }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              {hasBookingTimeSlots ? (
                <>
                  <Link
                    href="/shifts"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#0b3a60] text-white text-base font-semibold hover:bg-[#082a46] transition-colors"
                  >
                    Reservar turno
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="#services-section"
                    className="inline-flex items-center px-6 py-3.5 bg-white text-stone-900 text-base font-semibold hover:bg-stone-50 transition-colors"
                  >
                    Ver servicios
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="#services-section"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#0b3a60] text-white text-base font-semibold hover:bg-[#082a46] transition-colors"
                  >
                    Ver servicios y tarifas
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#locales-section"
                    className="inline-flex items-center px-6 py-3.5 bg-white text-stone-900 text-base font-semibold hover:bg-stone-50 transition-colors"
                  >
                    Nuestros locales
                  </a>
                </>
              )}
            </motion.div>

            {hasBookingTimeSlots && (
              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22, ease: editorialEase }}
                className="text-sm text-stone-600 pt-1"
              >
                Atención por reserva
              </motion.p>
            )}
          </div>

          <div className="lg:col-span-6 relative">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: editorialEase }}
              className="ml-auto w-[86%] sm:w-[80%] lg:w-[84%] aspect-[4/5] max-h-[68dvh] overflow-clip bg-stone-200"
            >
              <Image
                src="/images/hero-salon.jpg"
                alt="Salón principal de Ventus Barbería con sillón clásico de cuero y nogal"
                width={960}
                height={1200}
                priority
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: editorialEase }}
              className="w-[40%] sm:w-[36%] aspect-square -mt-20 sm:-mt-28 relative z-10 border-4 border-stone-100 overflow-clip bg-stone-900"
            >
              <Image
                src="/images/hero-razor.jpg"
                alt="Navaja de acero, tijera japonesa y brocha sobre pizarra"
                width={720}
                height={720}
                priority
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. EL RITUAL DEL OFICIO — Dark Architectural Band */}
      <section className="bg-stone-950 text-stone-100 py-20 sm:py-28 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-8">
            <motion.div {...reveal(0)} className="space-y-4">
              <h2 className="font-serif font-light text-3xl sm:text-5xl tracking-[-0.02em] leading-[1.08] text-white max-w-[14ch]">
                El ritual de cada sesión
              </h2>
              <p className="text-base text-stone-300 leading-relaxed max-w-[40ch]">
                Trabajamos sin apuro en un espacio sereno de nogal, piedra y acero, cuidando cada
                terminación.
              </p>
            </motion.div>

            <div className="space-y-6 pt-2">
              <motion.div {...reveal(0.06)}>
                <h3 className="text-base font-semibold text-white">Corte a tijera y máquina</h3>
                <p className="text-base text-stone-300 mt-1 max-w-[38ch]">
                  Adaptado a la fisonomía, textura y caída natural del cabello.
                </p>
              </motion.div>
              <motion.div {...reveal(0.12)}>
                <h3 className="text-base font-semibold text-white">Afeitado con toalla caliente</h3>
                <p className="text-base text-stone-300 mt-1 max-w-[38ch]">
                  Compresa tibia, espuma densa y perfilado preciso con navaja clásica.
                </p>
              </motion.div>
              <motion.div {...reveal(0.18)}>
                <h3 className="text-base font-semibold text-white">
                  {hasBookingTimeSlots ? "Puntualidad garantizada" : "Atención dedicada"}
                </h3>
                <p className="text-base text-stone-300 mt-1 max-w-[38ch]">
                  {hasBookingTimeSlots
                    ? "Turnos individuales por sede y horario para evitar esperas."
                    : "Cada cliente recibe el tiempo necesario en el sillón."}
                </p>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-12 gap-4 sm:gap-6 items-end">
            <motion.div
              {...reveal(0.08)}
              className="col-span-7 aspect-[3/4] overflow-clip bg-stone-900"
            >
              <Image
                src="/images/craft-scissors.jpg"
                alt="Manos del barbero trabajando corte clásico a tijera sobre peine"
                width={900}
                height={1200}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              {...reveal(0.16)}
              className="col-span-5 aspect-[3/4] mb-8 sm:mb-14 overflow-clip bg-stone-900"
            >
              <Image
                src="/images/craft-towel.jpg"
                alt="Estación de afeitado clásico con toallas blancas y grifería de bronce"
                width={750}
                height={1000}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES & PRICING LEDGER — Real data from /api/services */}
      <section
        id="services-section"
        className="bg-white py-20 sm:py-28 px-6 sm:px-10 lg:px-16 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <motion.div {...reveal(0)} className="lg:col-span-4 space-y-5">
            <h2 className="font-serif font-light text-3xl sm:text-5xl tracking-[-0.02em] leading-[1.08] text-stone-950">
              Servicios y tarifas
            </h2>
            <p className="text-base text-stone-600 leading-relaxed max-w-[34ch]">
              Cada servicio incluye diagnóstico previo, lavado y terminación profesional.
            </p>
            <div className="flex flex-wrap items-center gap-5 pt-2">
              {hasBookingTimeSlots ? (
                <>
                  <Link
                    href="/shifts"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0b3a60] text-white text-base font-semibold hover:bg-[#082a46] transition-colors"
                  >
                    Reservar turno
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/products"
                    className="text-base font-semibold text-[#0b3a60] underline underline-offset-4 hover:text-[#082a46]"
                  >
                    Ver productos
                  </Link>
                </>
              ) : (
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0b3a60] text-white text-base font-semibold hover:bg-[#082a46] transition-colors"
                >
                  Ver productos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div {...reveal(0.1)} className="lg:col-span-8">
            {loading ? (
              <div className="flex items-center gap-3 py-12">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0b3a60] border-t-transparent" />
                <p className="text-stone-700 text-base font-medium">Cargando tarifas...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="py-12 bg-stone-50 px-6">
                <p className="text-stone-700 text-base">
                  No hay servicios publicados en este momento.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-sm text-stone-700">
                    <th className="py-3.5 px-4 font-medium">Servicio</th>
                    <th className="py-3.5 px-4 font-medium whitespace-nowrap">Duración</th>
                    <th className="py-3.5 px-4 font-medium text-right whitespace-nowrap">Tarifa</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr
                      key={service.id}
                      className="odd:bg-white even:bg-stone-50 hover:bg-stone-100 transition-colors"
                    >
                      <td className="py-5 px-4 align-top">
                        <p className="text-lg font-semibold text-stone-900">
                          {service.name}
                        </p>
                        {service.description && (
                          <p className="text-base text-stone-600 mt-1 max-w-[46ch] leading-relaxed">
                            {service.description}
                          </p>
                        )}
                      </td>
                      <td className="py-5 px-4 align-top text-base text-stone-700 tabular-nums whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#0b3a60]" />
                          {service.duration} min
                        </span>
                      </td>
                      <td className="py-5 px-4 align-top text-right whitespace-nowrap">
                        <span className="font-serif text-xl sm:text-2xl font-normal text-[#0b3a60] tabular-nums">
                          ${service.price.toLocaleString("es-AR")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        </div>
      </section>

      {/* 4. LOCATIONS MAP — Interactive 3D MapLibre */}
      <InteractiveMap />

      {/* 5. REVIEWS SECTION — Featured Quotation + Anonymous Reviews */}
      <section
        id="reviews-section"
        className="bg-white py-20 sm:py-28 px-6 sm:px-10 lg:px-16 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          <motion.div
            {...reveal(0)}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
          >
            <div className="space-y-4 max-w-3xl">
              <h2 className="font-serif font-light text-3xl sm:text-5xl tracking-[-0.02em] leading-[1.08] text-stone-950">
                La palabra de nuestros clientes
              </h2>
              {featuredReview && (
                <div className="pt-2 space-y-2">
                  <blockquote className="font-serif text-xl sm:text-2xl font-light text-stone-800 leading-relaxed">
                    “{featuredReview.comment}”
                  </blockquote>
                  <p className="text-sm text-stone-600">
                    {featuredReview.author} · {featuredReview.rating}/5 estrellas
                  </p>
                </div>
              )}
            </div>
            {hasBookingTimeSlots && (
              <Link
                href="/confirmed-shifts"
                className="text-base font-semibold text-[#0b3a60] underline underline-offset-4 hover:text-[#082a46] shrink-0"
              >
                Consultar agenda confirmada
              </Link>
            )}
          </motion.div>

          <div className="grid gap-10 lg:grid-cols-12 items-start">
            <motion.form
              {...reveal(0.06)}
              onSubmit={handleSubmitReview}
              className="lg:col-span-5 bg-stone-100 p-7 sm:p-9 space-y-6"
            >
              <h3 className="font-serif text-2xl font-normal tracking-tight text-stone-900">
                Dejanos tu opinión
              </h3>

              <div className="space-y-2">
                <label
                  htmlFor="review-author"
                  className="text-sm font-medium text-stone-700 block"
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
                  className="w-full border border-stone-300 p-3 text-base bg-white text-stone-900 focus:outline-none focus:border-[#0b3a60] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-stone-700 block">
                  Calificación
                </span>
                <div
                  className="flex items-center gap-1.5"
                  role="group"
                  aria-label="Calificación en estrellas"
                >
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
                    className="text-sm font-medium text-stone-700"
                  >
                    Tu comentario
                  </label>
                  <span className="text-sm text-stone-600 tabular-nums">
                    {formComment.length}/500
                  </span>
                </div>
                <textarea
                  id="review-comment"
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Contanos cómo fue tu visita..."
                  maxLength={500}
                  required
                  rows={4}
                  className="w-full border border-stone-300 p-3.5 text-base bg-white text-stone-900 focus:outline-none focus:border-[#0b3a60] transition-colors resize-none leading-relaxed"
                />
              </div>

              {submitError && (
                <div role="alert" className="text-sm font-semibold text-red-700 bg-red-50 p-3">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div role="status" className="text-sm font-semibold text-emerald-800 bg-emerald-50 p-3">
                  ¡Tu reseña fue publicada correctamente!
                </div>
              )}

              <button
                type="submit"
                disabled={submitLoading || !formComment.trim()}
                className="w-full py-3.5 bg-[#0b3a60] text-white text-base font-semibold hover:bg-[#082a46] disabled:bg-stone-300 disabled:text-stone-600 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
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
            </motion.form>

            <motion.div {...reveal(0.12)} className="lg:col-span-7 space-y-4">
              <h3 className="font-serif text-2xl font-normal tracking-tight text-stone-900">
                Reseñas recientes
              </h3>

              {reviewsLoading ? (
                <div className="flex items-center gap-3 py-12 bg-stone-100 px-6">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0b3a60] border-t-transparent" />
                  <p className="text-stone-700 text-base font-medium">Cargando opiniones...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="py-14 text-center bg-stone-100 px-6 space-y-2">
                  <p className="text-stone-900 text-base font-semibold">Aún no hay opiniones</p>
                  <p className="text-stone-600 text-base">
                    ¡Sé el primero en compartir tu experiencia con nosotros!
                  </p>
                </div>
              ) : (
                <div className="max-h-[520px] overflow-y-auto space-y-3 pr-1">
                  <AnimatePresence initial={false}>
                    {reviews.map((review) => (
                      <motion.article
                        key={review.id}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25, ease: editorialEase }}
                        className="bg-stone-100 p-6 space-y-3"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="text-base font-semibold text-stone-900">
                              {review.author}
                            </h4>
                            <p className="text-sm text-stone-600 mt-0.5 tabular-nums">
                              {new Date(review.createdAt).toLocaleDateString("es-AR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div
                            className="flex gap-0.5"
                            aria-label={`${review.rating} de 5 estrellas`}
                          >
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
                        <p className="text-stone-700 text-base leading-relaxed whitespace-pre-wrap break-words">
                          {review.comment}
                        </p>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. ARCHITECTURAL FOOTER */}
      <footer className="bg-stone-950 text-stone-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div {...reveal(0)} className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 block"
              />
              <span className="font-serif text-2xl sm:text-3xl text-white tracking-tight">
                Ventus Barbería
              </span>
            </div>

            <p className="text-base text-stone-300 leading-relaxed max-w-[38ch]">
              Corte clásico, afeitado a navaja y cuidado personal en Buenos Aires.
            </p>

            <nav aria-label="Enlaces del pie" className="flex flex-wrap gap-x-6 gap-y-2 text-base">
              <Link href="/services" className="text-white hover:underline underline-offset-4">
                Servicios
              </Link>
              <Link href="/products" className="text-white hover:underline underline-offset-4">
                Productos
              </Link>
              {hasBookingTimeSlots && (
                <>
                  <Link
                    href="/confirmed-shifts"
                    className="text-white hover:underline underline-offset-4"
                  >
                    Agenda
                  </Link>
                  <Link href="/shifts" className="text-white hover:underline underline-offset-4">
                    Reservar turno
                  </Link>
                </>
              )}
            </nav>
          </motion.div>

          <motion.div {...reveal(0.1)} className="lg:col-span-7">
            <div className="aspect-[16/9] overflow-clip bg-stone-900">
              <Image
                src="/images/footer-atelier.jpg"
                alt="Mostrador y espejos de Ventus Barbería al anochecer"
                width={1600}
                height={900}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        <div className="bg-[#0d0d0c] px-6 sm:px-10 lg:px-16 py-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-stone-300">
            <p>© {new Date().getFullYear()} Ventus Barbería. Todos los derechos reservados.</p>
            <p>Buenos Aires, Argentina</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
