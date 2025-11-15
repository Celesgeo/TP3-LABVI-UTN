import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    // Prevención de cierre al hacer clic dentro del modal
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300"
            onClick={onClose} // Cierra si se hace clic fuera del contenido
        >
            <div 
                className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg transition-transform duration-300 transform scale-100"
                onClick={handleModalClick} // Evita que el clic dentro cierre el modal
            >
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-indigo-600">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}