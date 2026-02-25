import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 30,
    transition: {
      duration: 0.25,
    },
  },
};

const TermsModal = ({ open, onClose, terms }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999]"
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
            aria-label="Cerrar modal"
          />

          {/* Modal */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-3xl rounded-2xl bg-white text-slate-900 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 p-5 border-b">
                <h3 className="text-lg font-semibold">
                  {terms?.title || "Términos y Condiciones"}
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-md px-3 py-1 text-sm hover:bg-slate-100"
                >
                  Cerrar
                </button>
              </div>

              <div className="p-5 max-h-[70vh] overflow-auto">
                {terms?.updated_at && (
                  <p className="text-xs text-slate-500 mb-4">
                    Última actualización: {terms.updated_at}
                  </p>
                )}

                {(terms?.clauses || []).length ? (
                  <div className="space-y-4">
                    {terms.clauses.map((c, idx) => (
                      <section key={idx} className="space-y-1">
                        <h4 className="font-semibold">{c.title}</h4>
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {c.text}
                        </p>
                      </section>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">
                    No hay términos configurados aún.
                  </p>
                )}
              </div>

              <div className="p-5 border-t flex justify-end">
                <button
                  onClick={onClose}
                  className="rounded-md px-4 py-2 text-sm bg-slate-900 text-white hover:opacity-90"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermsModal;