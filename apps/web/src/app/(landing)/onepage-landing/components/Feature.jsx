const Feature = ({ data }) => {
  if (!data?.features || !Array.isArray(data.features)) return null;

  return (
    <section id="features" className="relative py-24 bg-default-900">
      <div className="container">

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {data.features.map((feature, index) => {
            const { title, description, url_image } = feature;

            return (
              <div
                key={index}
                className="p-6 rounded-xl bg-default-800 border border-default-700 hover:border-primary transition-all duration-300"
              >
                {url_image && (
                  <img
                    src={url_image}
                    alt={title || "Feature image"}
                    className="mb-4 rounded-lg w-full object-cover"
                  />
                )}

                {title && (
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {title}
                  </h3>
                )}

                {description && (
                  <p className="text-default-400">
                    {description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Feature;
