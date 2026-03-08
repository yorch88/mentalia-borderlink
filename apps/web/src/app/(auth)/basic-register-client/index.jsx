import { useState, useEffect } from "react";
import borderLogo2 from "@/assets/images/border-logo2.png";
import PageMeta from "@/components/PageMeta";
import { registerTenant, getTerms } from "./api";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import TermsModal from "./TermsModal";
import PlanDetailsModal from "./PlanDetailsModal";

const API_URL = import.meta.env.VITE_API_URL;
const PLANES = ["basico", "standar", "premium"];

/* =========================
   PoW Solver
========================= */
async function solvePow(nonce, difficulty) {
  let counter = 0;
  const prefix = "0".repeat(difficulty);

  while (true) {
    const data = new TextEncoder().encode(nonce + counter);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (hashHex.startsWith(prefix)) return counter;

    counter++;

    if (counter % 500 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
}

/* =========================
   Component
========================= */
const Index = () => {
  const GIROS = [
    { label: "Psicología", value: "psychology" },
    { label: "Medicina", value: "medical" },
    { label: "Legal", value: "legal" },
    { label: "Contaduría", value: "accounting" },
    { label: "Educación", value: "education" },
    { label: "Consultoría", value: "consulting" },
  ];

  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
    giro: "",
    org_name: "",
    modules: ["MentalIA MS"],
    plan: "",
    terms_accepted: false,
  });

  const [termsOpen, setTermsOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [terms, setTerms] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  /* =========================
     Load Active Terms
  ========================= */
  useEffect(() => {
    async function loadTerms() {
      try {
        const data = await getTerms();
        setTerms(data);
      } catch (err) {
        console.error("Error cargando términos:", err);
      }
    }
    loadTerms();
  }, []);

  /* =========================
     Handle Input Changes
  ========================= */
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     Submit Handler
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // 🔐 Validaciones frontend
    if (!terms?.version) {
      setError("No se pudieron cargar los términos. Intenta nuevamente.");
      return;
    }

    if (!form.phone || form.phone.trim().length < 8) {
      setError("Ingresa un número de teléfono válido.");
      return;
    }

    if (!form.terms_accepted) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    if (!form.plan) {
      setError("Selecciona un plan.");
      return;
    }

    setLoading(true);

    try {
      /* 1️⃣ Obtener challenge */
      const challengeRes = await fetch(`${API_URL}/v1/security/challenge`);
      if (!challengeRes.ok) {
        throw new Error("No se pudo obtener challenge");
      }

      const challenge = await challengeRes.json();

      /* 2️⃣ Resolver PoW */
      const counter = await solvePow(challenge.nonce, challenge.difficulty);

      /* 3️⃣ Enviar registro limpio */
      const data = await registerTenant({
        email: form.email,
        password: form.password,
        phone: form.phone.trim(),
        giro: form.giro,
        org_name: form.org_name,
        modules: form.modules,
        plan: form.plan,
        terms_accepted: form.terms_accepted,
        terms_version: terms.version,
        pow: {
          nonce: challenge.nonce,
          counter,
        },
      });

      setMessage(
        `Tenant creado. Código: ${data.client_code} | DB: ${data.db_name} | Estado: ${data.status}`
      );

      // Reset form
      setForm({
        email: "",
        password: "",
        phone: "",
        giro: "",
        org_name: "",
        modules: ["MentalIA MS"],
        plan: "",
        terms_accepted: false,
      });

    } catch (err) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Registro Organización" />

      <TermsModal
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        terms={terms}
      />

      <PlanDetailsModal
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
      />

      <div className="relative min-h-screen w-full flex justify-center items-center py-16">
        <div className="card md:w-lg w-screen z-10">
          <div className="text-center px-10 py-12">

            {/* Logo */}
            <div className="flex justify-center mb-1">
              <img
                src={borderLogo2}
                alt="logo"
                className="w-[220px] sm:w-[260px] max-w-full h-auto object-contain drop-shadow-lg"
              />
            </div>

            {/* Header */}
            <div className="mt-8">
              <h4 className="mb-2 text-xl font-semibold text-primary">
                Registrar Organización
              </h4>
              <p className="text-base text-default-500">
                Crea tu tenant para comenzar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="text-left w-full mt-10">

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-sm mb-2">Contraseña</label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="form-input pr-10"
                    required
                  />

                  <button
                    type="button"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
                  >
                    👁
                  </button>
                </div>
              </div>

              {/* Teléfono */}
              <div className="mb-4">
                <label className="block text-sm mb-2">Teléfono</label>
                <PhoneInput
                  defaultCountry="mx"
                  value={form.phone}
                  onChange={(phone) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: phone?.trim(),
                    }))
                  }
                  className="!w-full"
                  inputClassName="!w-full !h-[42px] !text-sm"
                />
              </div>

              {/* Organización */}
              <div className="mb-4">
                <label className="block text-sm mb-2">
                  Nombre Organización
                </label>
                <input
                  type="text"
                  name="org_name"
                  value={form.org_name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              {/* Giro */}
              <div className="mb-6">
                <label className="block text-sm mb-2">Giro</label>
                <select
                  name="giro"
                  value={form.giro}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Selecciona un giro</option>
                  {GIROS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plan */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm">Plan</label>
                  <button
                    type="button"
                    onClick={() => setPlanModalOpen(true)}
                    className="text-sm underline text-primary"
                  >
                    Ver diferencias
                  </button>
                </div>

                <select
                  name="plan"
                  value={form.plan}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Selecciona un plan</option>
                  {PLANES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Terms */}
              <div className="mb-6 flex items-start gap-3">
                <input
                  type="checkbox"
                  name="terms_accepted"
                  checked={form.terms_accepted}
                  onChange={handleChange}
                  className="mt-1"
                />
                <p className="text-sm text-default-600">
                  Acepto{" "}
                  <button
                    type="button"
                    onClick={() => setTermsOpen(true)}
                    className="underline underline-offset-2"
                  >
                    Aviso de Privacidad
                  </button>
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !form.terms_accepted ||
                  !terms?.version
                }
                className="btn bg-primary text-white w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Verificando seguridad..." : "Registrar"}
              </button>
            </form>

            {message && (
              <div className="mt-6 text-green-600 text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-6 text-red-600 text-sm">
                {error}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Index;