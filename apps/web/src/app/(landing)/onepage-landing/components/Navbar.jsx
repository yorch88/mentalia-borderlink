import { Link, useLocation } from "react-router-dom";
import borderLogo2 from "@/assets/images/border-logo2.png";

const Navbar = () => {
  const location = useLocation();

  // 🔥 Animación personalizada con duración controlada
  const smoothScrollTo = (targetY, duration = 800) => {
    const startY= window.scrollY;
    const distance= targetY - startY;
    let startTime= null;

    const animation = (currentTime)=> {
      if (startTime === null) startTime = currentTime;

      const timeElapsed= currentTime - startTime;
      const progress= Math.min(timeElapsed / duration, 1);

      // easing elegante (easeInOutCubic)
      const ease=
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

  const handleScroll = (id)=> {
    if (location.pathname !== "/onepage-landing") {
      window.location.assign("/onepage-landing");
      return;
    }

    const offset= 80;

    if (id === "top") {
      smoothScrollTo(0, 800);
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    const elementPosition=
      element.getBoundingClientRect().top;

    const offsetPosition=
      elementPosition + window.scrollY - offset;

    smoothScrollTo(offsetPosition, 800);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b border-default-200">
      <div className="container flex items-center justify-between h-20">

        {/* Logo */}
        <Link to="/onepage-landing" className="flex items-center">
          <img
            src={borderLogo2}
            alt="Borderlink"
            className="h-16 object-contain"
          />
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-default-700">
          <button onClick={() => handleScroll("top")} className="hover:text-primary transition">
            Inicio
          </button>

          <button
            onClick={() => handleScroll("about")}
            className="hover:text-primary transition"
          >
            Nosotros
          </button>

          <button
            onClick={() => handleScroll("features")}
            className="hover:text-primary transition"
          >
            Soluciones
          </button>

          <button
            onClick={() => handleScroll("contact")}
            className="hover:text-primary transition"
          >
            Contacto
          </button>
        </div>

        {/* Sign In */}
        <Link to="/basic-login">
          <button className="btn bg-primary text-white px-6">
            Sign In
          </button>
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;
