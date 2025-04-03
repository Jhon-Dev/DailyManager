export default function ConfirmModal({
                                         show,
                                         onClose,
                                         onConfirm,
                                         title,
                                         description,
                                         confirmLabel = 'Confirmar',
                                         cancelLabel = 'Cancelar',
                                         color = '#906eff',
                                     }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center border" style={{ borderColor: color + '33' }}>
                <h2 className="text-xl font-bold mb-3" style={{ color }}>{title}</h2>
                <p className="text-gray-600 mb-6">{description}</p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="text-white px-5 py-2 rounded-lg transition"
                        style={{ backgroundColor: color }}
                    >
                        {confirmLabel}
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-200 transition"
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}