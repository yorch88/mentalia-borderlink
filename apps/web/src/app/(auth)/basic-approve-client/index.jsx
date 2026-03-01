import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import borderLogo2 from "@/assets/images/border-logo2.png";
import PageMeta from "@/components/PageMeta";
import { approvePreview, approveTenant } from "./api";

const Index = () => {
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState("");
  const [tenantData, setTenantData] = useState(null);

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  /* =========================
     Leer token desde URL
     /basic-approve-client?token=XXXX
  ========================= */
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      fetchPreview(tokenFromUrl);
    } else {
      setError("No se encontró token de activación.");
    }
  }, [searchParams]);

  /* =========================
     Obtener datos del tenant
     antes de aprobar
  ========================= */
  const fetchPreview = async (tokenValue) => {
    setLoadingPreview(true);
    setError(null);

    try {
      const data = await approvePreview(tokenValue);
      setTenantData(data);
    } catch (err) {
      setError("Token inválido o expirado.");
    } finally {
      setLoadingPreview(false);
    }
  };

  /* =========================
     Confirmar activación manual
  ========================= */
  const handleApprove = async () => {
    setLoadingApprove(true);
    setError(null);
    setMessage(null);

    try {
      const data = await approveTenant(token);

      if (data?.status === "active") {
        setMessage("Organización activada correctamente ✅");
        setTenantData((prev) => ({
          ...prev,
          status: "active",
        }));
      }
    } catch (err) {
      setError("No se pudo activar la organización.");
    } finally {
      setLoadingApprove(false);
    }
  };

  return (
    <>
      <PageMeta title="Confirmar Activación" />

      <div className="relative min-h-screen w-full flex justify-center items-center py-16">
        <div className="card md:w-lg w-screen z-10">
          <div className="text-center px-10 py-12">

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src={borderLogo2}
                alt="logo"
                className="w-[220px] sm:w-[260px] object-contain"
              />
            </div>

            <h4 className="mb-4 text-xl font-semibold text-primary">
              Confirmar Activación
            </h4>

            {/* Loading Preview */}
            {loadingPreview && (
              <p className="text-sm text-gray-500">
                Validando token...
              </p>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Tenant Preview */}
            {tenantData && (
              <div className="text-left bg-gray-50 p-5 rounded-lg mb-6 text-sm border">
                <p className="mb-2">
                  <strong>Email:</strong> {tenantData.email}
                </p>
                <p className="mb-2">
                  <strong>Organización:</strong> {tenantData.org_name}
                </p>
                <p className="mb-2">
                  <strong>Giro:</strong> {tenantData.giro}
                </p>
                <p className="mb-2">
                  <strong>Módulos:</strong>{" "}
                  {tenantData.modules?.length
                    ? tenantData.modules.join(", ")
                    : "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {tenantData.status === "pending" && (
                    <span className="text-yellow-600">
                      Pendiente de activación
                    </span>
                  )}
                  {tenantData.status === "active" && (
                    <span className="text-green-600">
                      Activa
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Confirm Button */}
            {tenantData &&
              tenantData.status !== "active" &&
              !loadingPreview && (
                <button
                  onClick={handleApprove}
                  disabled={loadingApprove}
                  className="btn bg-primary text-white w-full"
                >
                  {loadingApprove
                    ? "Activando..."
                    : "Confirmar y Activar"}
                </button>
              )}

            {/* Already Active */}
            {tenantData?.status === "active" && (
              <div className="mt-4 text-green-600 text-sm">
                Esta organización ya está activa ✅
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="mt-4 text-green-600 text-sm">
                {message}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Index;