const About = ({ data }) => {
  if (!data?.about) return null;

  const { title, description, url_image } = data.about;

  return (
    <section id="about" className="relative lg:py-24 md:py-16 py-12">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Texto */}
          <div>
            {title && (
              <h2 className="mb-6 text-4xl font-semibold text-default-800">
                {title}
              </h2>
            )}

            {description && (
              <p className="text-lg text-default-500 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Imagen dinámica */}
          {url_image && (
            <div>
              <img
                src={url_image}
                alt={title || "About image"}
                className="rounded-xl shadow-lg"
              />
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default About;
