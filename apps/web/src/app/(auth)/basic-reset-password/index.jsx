import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import borderLogo2 from "@/assets/images/border-logo2.png";
import PageMeta from "@/components/PageMeta";
import { requestPasswordReset } from "./api";

const Index = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const data = await requestPasswordReset({ email });

      navigate("/pinpage", {
        state: {
          email,
          challengeToken: data.challenge_token,
        },
      });
    } catch (err) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Recuperar contraseña" />

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

            <div className="mt-8 text-center">
              <h4 className="mb-2 text-xl font-semibold text-primary">
                Recuperar contraseña
              </h4>
              <p className="text-base text-default-500">
                Ingresa tu correo y te enviaremos un código de verificación
              </p>
            </div>

            <form onSubmit={handleSubmit} className="text-left w-full mt-10">
              <div className="mb-6">
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="correo@empresa.com"
                  required
                />
              </div>

              {error && (
                <div className="mb-4 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn bg-primary text-white w-full"
              >
                {loading ? "Enviando..." : "Enviar código"}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-default-500">
                  ¿Recordaste tu contraseña?{" "}
                  <Link
                    to="/basic-login"
                    className="text-primary underline"
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;