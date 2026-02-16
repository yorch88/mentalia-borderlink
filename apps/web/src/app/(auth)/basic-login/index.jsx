import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import borderLogo2 from '@/assets/images/border-logo2.png';
import PageMeta from '@/components/PageMeta';
import { loginUser } from './api';

const Index = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(form);

      // Guardar token
      localStorage.setItem('access_token', data.access_token);

      // Redirigir
      navigate('/');
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
      <PageMeta title="Login" />

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
                Iniciar Sesión
              </h4>
              <p className="text-base text-default-500">
                Accede a tu organización
              </p>
            </div>

            <form onSubmit={handleSubmit} className="text-left w-full mt-10">

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

              <div className="mb-6">
                <label className="block text-sm mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-input"
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
                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-default-500">
                  ¿No tienes cuenta?{' '}
                  <Link
                    to="/basic-register-client"
                    className="text-primary underline"
                  >
                    Regístrate
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
