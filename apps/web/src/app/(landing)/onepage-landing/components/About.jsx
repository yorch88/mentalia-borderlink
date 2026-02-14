import borderlogo from '@/assets/images/landing/borderlogo.png';

const About = ({ data }) => {
  if (!data) return null;

  return (
    <section id="about" className="relative lg:py-24 md:py-16 py-12">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Texto */}
          <div>
            <h2 className="mb-6 text-4xl font-semibold text-default-800">
              {data.aboutTitle}
            </h2>

            <p className="text-lg text-default-500 leading-relaxed">
              {data.aboutDescription}
            </p>
          </div>

          {/* Imagen (solo una, no 6) */}
          <div>
            <img
              src={borderlogo}
              alt="About visual"
              className="rounded-xl shadow-lg"
            />
          </div>

        </div>
      </div>
    </section>
  );
}; 

export default About;
