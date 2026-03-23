import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import borderLogo2 from "@/assets/images/border-logo2.png";
import PageMeta from "@/components/PageMeta";
import { resetPassword } from "./api";

const ResetPasswordClient = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = location.state?.resetToken || "";

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!resetToken) {
      navigate("/basic-reset-password");
    }
  }, [resetToken, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        reset_token: resetToken,
        new_password: form.password,
      });

      setSuccess(true);
    } catch (err) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Nueva contraseña" />

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
                Nueva contraseña
              </h4>
              <p className="text-base text-default-500">
                Crea una nueva contraseña para tu cuenta
              </p>
            </div>

            {!success ? (
              <form onSubmit={handleSubmit} className="text-left w-full mt-10">
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

                <div className="mb-6">
                  <label className="block text-sm mb-2">
                    Confirmar contraseña
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="form-input pr-10"
                      required
                    />

                    <button
                      type="button"
                      onMouseDown={() => setShowConfirmPassword(true)}
                      onMouseUp={() => setShowConfirmPassword(false)}
                      onMouseLeave={() => setShowConfirmPassword(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
                    >
                      👁
                    </button>
                  </div>
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
                  {loading ? "Guardando..." : "Actualizar contraseña"}
                </button>
              </form>
            ) : (
              <div className="mt-10">
                <div className="mb-6 text-green-600 text-sm">
                  Tu contraseña fue actualizada correctamente.
                </div>

                <Link
                  to="/basic-login"
                  className="btn bg-primary text-white w-full inline-flex justify-center"
                >
                  Ir a login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordClient;