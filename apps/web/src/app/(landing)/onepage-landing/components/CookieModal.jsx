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
            aria-label="Cerrar modal"
          />

          {/* Modal Container */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-3xl rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 p-6 border-b">
                <div>
                  <h3 className="text-xl font-semibold">
                    {cookies?.title || "Política de Cookies"}
                  </h3>
                  {cookies?.updated_at && (
                    <p className="text-xs text-slate-500 mt-1">
                      Última actualización: {cookies.updated_at}
                    </p>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="rounded-md px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cerrar
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-auto">
                {(cookies?.clauses || []).length ? (
                  <div className="space-y-6">
                    {cookies.clauses.map((clause, idx) => (
                      <section key={idx} className="space-y-2">
                        <h4 className="font-semibold text-base">
                          {clause.title}
                        </h4>
                        <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700">
                          {clause.text}
                        </p>
                      </section>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">
                    No hay política configurada aún.
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 border-t flex justify-end">
                <button
                  onClick={onClose}
                  className="rounded-md px-4 py-2 text-sm bg-slate-900 text-white hover:opacity-90 transition"
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

export default CookieModal;