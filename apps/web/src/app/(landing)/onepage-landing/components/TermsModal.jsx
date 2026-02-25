const TermsModal = ({ open, onClose, terms }) => {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-[999]">
        {/* overlay */}
        <button
          type="button"
          onClick={onClose}
          className="absolute inset-0 bg-black/60"
          aria-label="Cerrar modal"
        />
  
        {/* modal */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white text-slate-900 shadow-xl">
            <div className="flex items-start justify-between gap-4 p-5 border-b">
              <h3 className="text-lg font-semibold">
                {terms?.title || "Términos y Condiciones"}
              </h3>
              <button
                type="button"
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
                type="button"
                onClick={onClose}
                className="rounded-md px-4 py-2 text-sm bg-slate-900 text-white hover:opacity-90"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default TermsModal;