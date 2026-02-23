import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';

import Audience from './components/Audience';
import CustomerService from './components/CustomerService';
import OrderStatistics from './components/OrderStatistics';
import ProductOrderDetails from './components/ProductOrderDetails';
import ProductOrders from './components/ProductOrders';
import SalesRevenueOverview from './components/SalesRevenueOverview';
import SalesThisMonth from './components/SalesThisMonth';
import TopSellingProducts from './components/TopSellingProducts';
import TrafficResources from './components/TrafficResources';
import WelcomeUser from './components/WelcomeUser';

const API_URL = import.meta.env.VITE_API_URL;

const Index = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      // ❌ No hay token → login
      if (!token) {
        navigate("/basic-login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ❌ Token inválido o expirado
        if (!response.ok) {
          localStorage.removeItem("access_token");
          navigate("/basic-login");
          return;
        }

        // ✅ Token válido
        setLoading(false);

      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("access_token");
        navigate("/basic-login");
      }
    };

    checkAuth();
  }, [navigate]);

  // ⏳ Mientras valida token
  if (loading) {
    return <div className="p-10">Validando sesión...</div>;
  }

  return (
    <>
      <PageMeta title="Ecommerce" />
      <main>
        <PageBreadcrumb title="Ecommerce" subtitle="Dashboards" />

        <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 mb-5">
          <div className="lg:col-span-2 col-span-1">
            <WelcomeUser />
            <ProductOrderDetails />
          </div>
          <OrderStatistics />
        </div>

        <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 mb-5">
          <SalesRevenueOverview />
          <TrafficResources />
        </div>

        <ProductOrders />

        <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
          <CustomerService />
          <SalesThisMonth />
          <TopSellingProducts />
          <Audience />
        </div>

      </main>
    </>
  );
};

export default Index;