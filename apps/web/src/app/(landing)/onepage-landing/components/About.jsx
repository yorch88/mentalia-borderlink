import { motion } from "framer-motion";
import { fadeLeft, fadeRight } from "@/utils/animations";
import borderLogo2 from "@/assets/images/border-logo2.png";

const About = ({ data }) => {
  if (!data?.about) return null;

  const { title, description, url_image } = data.about;

  return (
    <section id="about" className="relative lg:py-24 md:py-16 py-12">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
          >
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
          </motion.div>

          {/* {url_image && (
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="visible"
            >
              <img
                src={url_image}
                alt={title || "About image"}
                className="rounded-xl shadow-lg"
              />
            </motion.div>
          )} */}
          <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="visible"
            >
              <img
                src={borderLogo2}
                alt={title || "About image"}
                // className="rounded-xl shadow-lg"
              />
            </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;