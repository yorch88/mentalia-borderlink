import { motion, AnimatePresence } from "framer-motion";
import { LuCheck } from "react-icons/lu";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: { opacity: 0, scale: 0.96, y: 20 },
};

const plans = [
  {
    name: "Básico",
    price: 199,
    features: [
      "1 Usuario",
      "1 Clínica",
      "Reportes básicos",
      "Gestión de pacientes",
      "Historiales médicos",
    ],
  },
  {
    name: "Standard",
    price: 299,
    features: [
      "Usuarios múltiples",
      "Clínicas múltiples",
      "Reportes básicos",
      "Gestión de pacientes",
      "Historiales médicos",
    ],
  },
  {
    name: "Premium",
    price: 399,
    features: [
      "Todo lo de Standard",
      "Facturación",
      "Reportes especiales",
      "Módulos adicionales",
      "Soporte prioritario",
    ],
  },
];

const PlanDetailsModal = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.button
            variants={backdrop}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              variants={modal}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  Comparación de Planes
                </h3>
                <button
                  onClick={onClose}
                  className="px-3 py-1 rounded-md hover:bg-gray-100"
                >
                  Cerrar
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className="border rounded-xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-lg mb-4">
                        {plan.name}
                      </h4>

                      <ul className="space-y-2 text-sm mb-6">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <LuCheck className="text-green-600 mt-1 size-4" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Precio */}
                    <div className="border-t pt-4 text-center">
                      <p className="text-3xl font-semibold text-primary">
                        ${plan.price}
                        <span className="text-sm text-default-500 ml-1">
                          MXN / mes
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlanDetailsModal;