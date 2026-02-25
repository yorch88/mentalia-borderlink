import { useEffect, useState } from "react";
import CookieModal from "./CookieModal";

const CookieBanner = ({ cookies, onConsent }) => {
  const [visible, setVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    onConsent?.();
  };
  
  const reject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    onConsent?.();
  };

  if (!visible) return null;

  return (
    <>
      <CookieModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        cookies={cookies}
      />

      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-slate-900 text-white shadow-2xl border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">

          <div className="text-sm md:text-base leading-relaxed">
            <p>
              Utilizamos cookies para mejorar tu experiencia y analizar el
              tráfico. Consulta nuestra{" "}
              <button
                onClick={() => setOpenModal(true)}
                className="underline font-semibold hover:text-blue-300"
              >
                Política de Cookies
              </button>.
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={reject}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition"
            >
              Rechazar
            </button>

            <button
              onClick={accept}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition shadow-lg"
            >
              Aceptar todas
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default CookieBanner;