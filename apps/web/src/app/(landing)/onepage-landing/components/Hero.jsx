import { Link } from "react-router-dom";

const Hero = ({ data }) => {
  if (!data) return null;

  return (
    <section className="relative lg:pt-44 lg:pb-36 md:pt-34 md:pb-20 pt-32 pb-20">

      {/* Conservamos solo 1 elemento decorativo */}
      <div className="absolute rotate-45 size-125 border border-dashed border-t-default-300 border-l-default-300 border-r-default-300/40 border-b-default-700 rounded-full end-40 -bottom-62.5 z-20 lg:block hidden"></div>

      <div className="container">
        <div className="grid lg:grid-cols-2">

          <div>
            <h1 className="mb-8 leading-relaxed md:text-5xl text-4xl font-semibold text-default-800">
              {data.heroTitle}

              {data.heroHighlight && (
                <span className="relative inline-block px-2 mx-2 before:block before:absolute before:-inset-1 before:-skew-y-6 before:bg-primary/10 before:rounded-md before:backdrop-blur-xl">
                  <span className="relative text-primary">
                    {data.heroHighlight}
                  </span>
                </span>
              )}
            </h1>

            <p className="mb-8 text-lg text-default-500">
              {data.heroSubtitle}
            </p>

            <Link to="/basic-login">
              <button
                type="button"
                className="btn bg-primary text-white px-6"
              >
                Sign In
              </button>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
