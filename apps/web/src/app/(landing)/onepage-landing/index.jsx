import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageMeta from "@/components/PageMeta";
import About from "./components/About";
import Contact from "./components/Contact";
import Feature from "./components/Feature";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import { getLanding } from "./api";

const Index = () => {
  const [landing, setLanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let loaderTimer;

    const fetchLanding = async () => {
      // solo mostramos loader si tarda más de 400ms
      loaderTimer = setTimeout(() => {
        setShowLoader(true);
      }, 400);

      try {
        const data = await getLanding();
        setLanding(data);
      } catch (err) {
        console.error("Error cargando landing:", err);
      } finally {
        clearTimeout(loaderTimer);
        setLoading(false);
        setShowLoader(false);
      }
    };

    fetchLanding();

    return () => clearTimeout(loaderTimer);
  }, []);

  return (
    <>
      <PageMeta title="Borderlink" />

      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {landing && (
          <>
            <Hero data={landing} />
            <Feature data={landing} />
            <About data={landing} />
            <Contact data={landing} />
            <Footer data={landing} />
          </>
        )}
      </motion.div>

      {/* Loader SOLO si realmente tarda */}
      {showLoader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-white z-50"
        >
          <div className="animate-pulse text-default-500">
            Cargando...
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Index;