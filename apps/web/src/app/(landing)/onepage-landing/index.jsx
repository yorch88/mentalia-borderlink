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

  return (
    <>
      <PageMeta title="Borderlink" />
      <Navbar />

      {landing && (
        <motion.div
          key="landing-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Hero data={landing} />
          <Feature data={landing} />
          <About data={landing} />
          <Contact data={landing} />
          <Footer data={landing} />
        </motion.div>
      )}
    </>
  );
};

export default Index;