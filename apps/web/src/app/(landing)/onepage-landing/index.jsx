import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageMeta from "@/components/PageMeta";
import About from "./components/About";
import Contact from "./components/Contact";
import Feature from "./components/Feature";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import CookieBanner from "./components/CookieBanner";
import { getLanding } from "./api";

const Index = () => {
  const [landing, setLanding] = useState(null);
  const [cookieConsent, setCookieConsent] = useState(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    setCookieConsent(consent);
  }, []);

  useEffect(() => {
    const fetchLanding = async () => {
      try {
        const data = await getLanding();
        setLanding(data);
      } catch (err) {
        console.error("Error cargando landing:", err);
      }
    };
    fetchLanding();
  }, []);

  // 🔒 Bloquear scroll cuando no hay consentimiento
  useEffect(() => {
    if (!cookieConsent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [cookieConsent]);

  const handleConsent = () => {
    setCookieConsent(localStorage.getItem("cookie_consent"));
  };

  return (
    <>
      <PageMeta title="Borderlink" />
      <Navbar />

      {landing && (
        <>
          <motion.div
            key="landing-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={
              !cookieConsent
                ? "blur-md pointer-events-none select-none transition duration-300"
                : ""
            }
          >
            <Hero data={landing} />
            <Feature data={landing} />
            <About data={landing} />
            <Contact data={landing} />
            <Footer data={landing} />
          </motion.div>

          {!cookieConsent && (
            <CookieBanner
              cookies={landing.cookies}
              onConsent={handleConsent}
            />
          )}
        </>
      )}
    </>
  );
};

export default Index;