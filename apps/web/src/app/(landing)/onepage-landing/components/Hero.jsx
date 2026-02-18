import { Link } from "react-router-dom";
import borderLogo from "@/assets/images/border-logo2.png";
const Hero = ({ data }) => {
  if (!data?.hero) return null;

  const { title, subtitle, url_image } = data.hero;

  return (
    <section className="relative lg:pt-44 lg:pb-36 md:pt-34 md:pb-20 pt-32 pb-20">

      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Texto */}
          <div>
            {title && (
              <h1 className="mb-8 leading-relaxed md:text-5xl text-4xl font-semibold text-default-800">
                {title}
              </h1>
            )}

            {subtitle && (
              <p className="mb-8 text-lg text-default-500">
                {subtitle}
              </p>
            )}

            <Link to="/basic-login">
              <button
                type="button"
                className="btn bg-primary text-white px-6"
              >
                Sign In
              </button>
            </Link>
          </div>

          {/* Imagen */}
          {(url_image || borderLogo) && (
            <div className="flex justify-center items-center">
              <img
                src={url_image || borderLogo}
                alt={title || "Hero image"}
                className="w-full max-w-md object-contain drop-shadow-lg"
              />
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Hero;