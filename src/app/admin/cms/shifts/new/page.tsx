"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, User, Mail, Phone } from "lucide-react";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";

type Location = {
  id: string;
  name: string;
  address: string;
};

type TimeSlot = {
  id: string;
  time: string;
};

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function NewShiftPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    locationId: "",
    date: getTodayStr(),
    time: "",
    confirmed: true,
    notes: "",
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (formData.locationId && formData.date) {
      fetchAvailableSlots();
    }
  }, [formData.locationId, formData.date]);

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/locations", {
        cache: "no-store",
      });
      const data = await res.json();
      setLocations(data);
      if (data.length > 0 && !formData.locationId) {
        setFormData((prev) => ({ ...prev, locationId: data[0].id }));
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const res = await fetch(
        `/api/shifts/available-slots?locationId=${formData.locationId}&date=${formData.date}`,
        {
          cache: "no-store",
        },
      );
      const data = await res.json();
      setAvailableSlots(data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.time) {
      setError("Por favor seleccioná un horario para el turno.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          locationId: formData.locationId,
          date: formData.date,
          time: formData.time,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear turno");
      }

      const shift = await res.json();

      if (formData.confirmed) {
        await fetch(`/api/admin/shifts/${shift.id}/confirm`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmed: true }),
        });
      }

      if (formData.notes) {
        await fetch(`/api/admin/shifts/${shift.id}/notes`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: formData.notes }),
        });
      }

      router.refresh();
      router.push("/admin/cms/shifts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear turno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Nuevo Turno</h1>
          <p className="text-stone-500 text-sm mt-1">
            Agendar manualmente una reserva para un cliente
          </p>
        </div>
        <Button
          size="small"
          variant="outlined"
          onClick={() => router.back()}
        >
          ← Volver
        </Button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <Alert severity="error">{error}</Alert>}

          {/* Sede y Fecha */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2.5">
              <MapPin className="w-4 h-4 text-[#0b3a60]" />
              Sede y Fecha
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Sede / Ubicación"
                value={formData.locationId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    locationId: e.target.value,
                    time: "",
                  })
                }
                options={[
                  { value: "", label: "Seleccionar ubicación" },
                  ...locations.map((loc) => ({
                    value: loc.id,
                    label: `${loc.name} - ${loc.address}`,
                  })),
                ]}
                required
                fullWidth
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Fecha del Turno
                </label>
                <input
                  type="date"
                  min={getTodayStr()}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value,
                      time: "",
                    })
                  }
                  required
                  className="px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0b3a60]/20 focus:border-[#0b3a60] transition-all"
                />
              </div>
            </div>

            {/* Selector de Horarios Disponibles */}
            {formData.date && formData.locationId && (
              <div className="pt-2">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <Clock className="w-3.5 h-3.5 text-[#0b3a60]" />
                  Horario Disponible <span className="text-red-500">*</span>
                </label>
                {loadingSlots ? (
                  <div className="flex items-center gap-2 py-4 text-xs text-stone-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#0b3a60] border-t-transparent"></div>
                    Buscando horarios libres...
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {availableSlots.map((slot) => {
                      const isSelected = formData.time === slot.time;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, time: slot.time })
                          }
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-[#0b3a60] text-white border-[#0b3a60] shadow-xs"
                              : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50 hover:border-stone-400"
                          }`}
                        >
                          {slot.time} hs
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    No hay horarios disponibles para la sede y fecha seleccionada.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Datos del Cliente */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2.5">
              <User className="w-4 h-4 text-[#0b3a60]" />
              Datos del Cliente
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                fullWidth
                placeholder="Ej. Lucas"
              />
              <Input
                label="Apellido"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                fullWidth
                placeholder="Ej. Gómez"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Teléfono / WhatsApp"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                fullWidth
                placeholder="Ej. 11 3456-7890"
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                fullWidth
                placeholder="Ej. cliente@gmail.com"
              />
            </div>
          </div>

          {/* Opciones y Notas */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <label className="flex items-center gap-2 text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.confirmed}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmed: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded border-stone-300 text-[#0b3a60] focus:ring-[#0b3a60]"
              />
              <span className="text-sm font-medium">
                Crear turno ya confirmado
              </span>
            </label>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Notas internas (opcional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={2}
                placeholder="Detalles sobre cortes anteriores, preferencias del cliente..."
                className="px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b3a60]/20 focus:border-[#0b3a60] transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <Button
              type="button"
              variant="outlined"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading || !formData.time}
            >
              {loading ? "Creando..." : "Crear Turno"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
