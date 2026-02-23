import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import borderLogo2 from "@/assets/images/border-logo2.png";

const Navbar = () => {
  const location = useLocation();

  // 🔥 Animación personalizada con duración controlada
  const smoothScrollTo = (targetY, duration = 800) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;

      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const handleScroll = (id) => {
    if (location.pathname !== "/onepage-landing") {
      window.location.assign("/onepage-landing");
      return;
    }

    const offset = 80;

    if (id === "top") {
      smoothScrollTo(0, 800);
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;

    const offsetPosition =
      elementPosition + window.scrollY - offset;

    smoothScrollTo(offsetPosition, 800);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b border-default-200"
    >
      <div className="container flex items-center justify-between h-20">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Link to="/onepage-landing" className="flex items-center">
            <img
              src={borderLogo2}
              alt="Borderlink"
              className="h-16 object-contain"
            />
          </Link>
        </motion.div>

        {/* Links */}
        <motion.div
          className="hidden md:flex items-center gap-8 text-default-700"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
              },
            },
          }}
        >
          {[
            { label: "Inicio", id: "top" },
            { label: "Nosotros", id: "about" },
            { label: "Soluciones", id: "features" },
            { label: "Contacto", id: "contact" },
          ].map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleScroll(item.id)}
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="hover:text-primary transition"
            >
              {item.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Sign In */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Link to="/basic-login">
            <button className="btn bg-primary text-white px-6">
              Sign In
            </button>
          </Link>
        </motion.div>

      </div>
    </motion.nav>
  );
};

export default Navbar;