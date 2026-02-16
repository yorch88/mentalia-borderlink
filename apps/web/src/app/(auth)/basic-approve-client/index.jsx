import { useState } from 'react';
import borderLogo2 from '@/assets/images/border-logo2.png';
import PageMeta from '@/components/PageMeta';
import { approveTenant } from './api';

const Index = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const data = await approveTenant(apiKey);
      setMessage(
        data?.message ||
        (data?.status === "active"
          ? `Organización activada. DB: ${data.tenant_db}`
          : "Proceso completado")
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Activar Cliente" />

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
                Activar Organización
              </h4>
              <p className="text-base text-default-500">
                Introduce tu API Key para registrar el tenant.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="text-left w-full mt-10">
              <div className="mb-6">
                <label className="block font-medium text-sm mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="form-input"
                  placeholder="Ingresa tu API key"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn bg-primary text-white w-full"
              >
                {loading ? 'Registrando...' : 'Registrar Tenant'}
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
