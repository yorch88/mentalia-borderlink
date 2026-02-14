import { useState } from 'react';
import borderLogo2 from '@/assets/images/border-logo2.png';
import PageMeta from '@/components/PageMeta';
import { registerTenant } from './api';

const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   PoW Solver
========================= */

async function solvePow(nonce, difficulty) {
  let counter = 0;

  while (true) {
    const data = new TextEncoder().encode(nonce + counter);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (hashHex.startsWith("0".repeat(difficulty))) {
      return counter;
    }

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
    'psychology',
    'medical',
    'legal',
    'accounting',
    'education',
    'consulting',
  ];

  const [form, setForm] = useState({
    email: '',
    password: '',
    giro: '',
    org_name: '',
    modules: ['MetalIA MS'],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      /* 1️⃣ Obtener challenge */
      const challengeRes = await fetch(
        `${API_URL}/v1/security/challenge`
      );

      if (!challengeRes.ok) {
        throw new Error("No se pudo obtener challenge");
      }

      const challenge = await challengeRes.json();

      /* 2️⃣ Resolver PoW */
      const counter = await solvePow(
        challenge.nonce,
        challenge.difficulty
      );

      /* 3️⃣ Enviar registro */
      const data = await registerTenant({
        ...form,
        pow: {
          nonce: challenge.nonce,
          counter,
        },
      });

      setMessage(
        `Tenant creado. Código: ${data.client_code} | DB: ${data.db_name} | Estado: ${data.status}`
      );

    } catch (err) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Registro Organización" />

      <div className="relative min-h-screen w-full flex justify-center items-center py-16">
        <div className="card md:w-lg w-screen z-10">
          <div className="text-center px-10 py-12">

            <div className="flex justify-center mb-1">
              <img
                src={borderLogo2}
                alt="logo"
                className="w-[220px] sm:w-[260px] max-w-full h-auto object-contain drop-shadow-lg"
              />
            </div>

            <div className="mt-8">
              <h4 className="mb-2 text-xl font-semibold text-primary">
                Registrar Organización
              </h4>
              <p className="text-base text-default-500">
                Crea tu tenant para comenzar.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="text-left w-full mt-10"
            >
              <div className="mb-4">
                <label className="block text-sm mb-2">
                  Email Admin
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

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

              <div className="mb-6">
                <label className="block text-sm mb-2">
                  Giro
                </label>
                <select
                  name="giro"
                  value={form.giro}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      giro: e.target.value,
                    }))
                  }
                  className="form-input"
                  required
                >
                  <option value="">Selecciona un giro</option>
                  {GIROS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn bg-primary text-white w-full"
              >
                {loading
                  ? 'Verificando seguridad...'
                  : 'Registrar'}
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
