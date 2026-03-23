import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import borderLogo2 from "@/assets/images/border-logo2.png";
import PageMeta from "@/components/PageMeta";
import { requestPasswordReset, verifyResetPin } from "./api";

const PinPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const initialChallengeToken = location.state?.challengeToken || "";

  const [pin, setPin] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [challengeToken, setChallengeToken] = useState(initialChallengeToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (!email || !initialChallengeToken) {
      navigate("/basic-reset-password");
    }
  }, [email, initialChallengeToken, navigate]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const code = pin.join("");
    if (code.length !== 4) {
      setError("Ingresa el código completo");
      return;
    }

    setLoading(true);

    try {
      const data = await verifyResetPin({
        email,
        pin: code,
        challenge_token: challengeToken,
      });

      navigate("/reset-password-client", {
        state: {
          resetToken: data.reset_token,
        },
      });
    } catch (err) {
      setError(err?.message || "No se pudo validar el código");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setLoading(true);

    try {
      const data = await requestPasswordReset({ email });
      setChallengeToken(data.challenge_token);
      setPin(["", "", "", ""]);
      setTimeLeft(120);
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err?.message || "No se pudo reenviar el código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Verificar Código" />

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
                Verificación
              </h4>
              <p className="text-base text-default-500">
                Ingresa el código de 4 dígitos enviado a tu correo
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10">
              <div className="flex justify-center gap-4 mb-8">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-16 h-16 text-center text-2xl font-semibold rounded-lg border border-default-300 focus:border-primary focus:ring-primary"
                  />
                ))}
              </div>

              <div className="text-sm text-default-500 mb-6">
                {timeLeft > 0 ? (
                  <>
                    El código expira en{" "}
                    <span className="font-semibold">{formatTime()}</span>
                  </>
                ) : (
                  <>El código ha expirado</>
                )}
              </div>

              {error && (
                <div className="mb-4 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || timeLeft <= 0}
                className="btn bg-primary text-white w-full"
              >
                {loading ? "Validando..." : "Verificar Código"}
              </button>

              {timeLeft === 0 && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-primary underline text-sm"
                  >
                    {loading ? "Reenviando..." : "Reenviar código"}
                  </button>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link
                  to="/basic-login"
                  className="text-sm text-default-500 underline"
                >
                  Volver al login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PinPage;