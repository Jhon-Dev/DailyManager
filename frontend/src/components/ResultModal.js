import { motion, AnimatePresence } from 'framer-motion';

export default function ResultModal({ show, onClose, lista = [], onResortear }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center border border-[#906eff]/20">
                <h2 className="text-2xl font-bold text-[#906eff] mb-4">Ordem sorteada</h2>

                <div className="grid gap-2 text-left max-h-[50vh] overflow-auto">
                    <AnimatePresence>
                        {lista.map((p, i) => (
                            <motion.div
                                key={p.id || i}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3, delay: i * 0.1 }}
                                className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border"
                            >
                                <span className="font-bold text-[#906eff]">{i + 1}.</span>
                                <span className="text-gray-800">{p.nome}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                </div>

                <div className="mt-6 flex flex-col gap-2">
                    <button
                        onClick={onResortear}
                        className="bg-[#906eff] text-white px-6 py-2 rounded-lg hover:bg-[#7f5df5] transition"
                    >
                        Sortear novamente
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
