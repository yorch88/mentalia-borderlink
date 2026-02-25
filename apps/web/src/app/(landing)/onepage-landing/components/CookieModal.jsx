import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 40,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.25,
    },
  },
};

const CookieModal = ({ open, onClose, cookies }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10000]"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Overlay */}
          <motion.button
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl"
            >
              <div className="flex justify-between items-center p-5 border-b">
                <h3 className="text-lg font-semibold">
                  {cookies?.title}
                </h3>
                <button
                  onClick={onClose}
                  className="px-3 py-1 text-sm bg-gray-200 rounded"
                >
                  Cerrar
                </button>
              </div>

              <div className="p-5 max-h-[70vh] overflow-auto whitespace-pre-line text-sm text-gray-700">
                {cookies?.content}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieModal;