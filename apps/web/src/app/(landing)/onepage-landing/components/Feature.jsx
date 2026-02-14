const Feature = ({ data }) => {
  if (!data?.features) return null;

  return (
    <section id="features" className="relative py-24 bg-default-900">
      <div className="container">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-white">
            {data.featuresTitle}
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {data.features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-default-800 border border-default-700 hover:border-primary transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-default-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Feature;
