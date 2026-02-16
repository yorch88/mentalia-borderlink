import { useState } from "react";
import { sendContact } from "../api";
const API_URL = import.meta.env.VITE_API_URL;

const Contact = ({ data }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    accepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = e.target.checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------------------
  // GET Challenge
  // ---------------------------
  const getChallenge = async () => {
    const res = await fetch(`${API_URL}/v1/security/challenge`);
    if (!res.ok) throw new Error("No se pudo obtener challenge");
    return res.json();
  };
  // ---------------------------
  // SHA-256 POW Solver
  // ---------------------------
  const solvePow = async (nonce, difficulty) => {
    let counter = 0;
    const prefix = "0".repeat(difficulty);

    while (true) {
      const data = nonce + counter;

      const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(data)
      );

      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (hashHex.startsWith(prefix)) {
        return counter;
      }

      counter++;
    }
  };

  // ---------------------------
  // Submit
  // ---------------------------
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.accepted) {
      setError("Debes aceptar el aviso de privacidad para continuar.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Obtener challenge
      const challenge = await getChallenge();

      // 2️⃣ Resolver POW
      const counter = await solvePow(
        challenge.nonce,
        challenge.difficulty
      );

      // 3️⃣ Enviar formulario con pow
      await sendContact({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        pow: {
          nonce: challenge.nonce,
          counter,
        },
      });

      setSuccess(
        "Gracias. Recibimos tu mensaje y te contactaremos pronto."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        accepted: false,
      });
    } catch (err) {
      setError(
        err?.message || "Ocurrió un error al enviar tu mensaje."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-20 bg-blue-700/80 dark:bg-blue-900"
    >
      <div className="container relative z-20">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="mb-4 capitalize text-blue-50 leading-normal text-4xl font-semibold">
              {data?.contactTitle || "Contáctanos"}
            </h2>

            <p className="text-lg text-blue-200">
              {data?.contactSubtitle ||
                "Cuéntanos lo que necesitas y te responderemos con los siguientes pasos."}
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="bg-card/10 backdrop-blur rounded-xl p-6 border border-white/15"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Tu nombre"
                required
                className="form-input w-full"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="tucorreo@dominio.com"
                required
                className="form-input w-full"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="Tu numero telefonico"
                className="form-input w-full md:col-span-2"
              />

              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Cuéntanos sobre tu proyecto..."
                required
                className="form-input w-full md:col-span-2 min-h-[120px]"
              />

              <div className="md:col-span-2 flex items-start gap-3">
                <input
                  type="checkbox"
                  name="accepted"
                  checked={form.accepted}
                  onChange={onChange}
                  className="mt-1"
                />
                <p className="text-sm text-blue-100">
                  {data?.privacyText ||
                    "Acepto que mis datos serán utilizados únicamente para contacto y no serán compartidos con terceros."}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !form.accepted}
                className="btn bg-card hover:text-blue-800 text-primary w-full md:col-span-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Validando..." : "Enviar mensaje"}
              </button>

              {success && (
                <div className="md:col-span-2 text-sm text-green-200">
                  {success}
                </div>
              )}

              {error && (
                <div className="md:col-span-2 text-sm text-red-200">
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
