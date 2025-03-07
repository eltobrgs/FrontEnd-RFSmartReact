import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface CourseCreateSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (moduleData: { title: string; description: string; icon: string }) => void;
}

export function CourseCreateSectionModal({ isOpen, onClose, onSubmit }: CourseCreateSectionModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📚');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (onSubmit) {
      onSubmit({
        title,
        description,
        icon
      });
    }
    
    // Limpar o formulário
    setTitle('');
    setDescription('');
    setIcon('📚');
    setError('');
    
    onClose();
  };

  const iconOptions = ['📚', '🎓', '📝', '📊', '💡', '🔍', '🧩', '🎯', '🚀', '💻', '📱', '🎨', '🎬', '🎤', '📈', '🔬', '🧪', '🔧', '🛠️', '📋'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black cursor-pointer z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-8 bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-medium text-white">Criar Novo Módulo</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="bg-red-900/30 text-red-400 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-300 mb-1">
                    Ícone
                  </label>
                  <div className="grid grid-cols-10 gap-2">
                    {iconOptions.map((iconOption) => (
                      <button
                        key={iconOption}
                        type="button"
                        onClick={() => setIcon(iconOption)}
                        className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg ${
                          icon === iconOption ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        } transition-colors`}
                      >
                        {iconOption}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Título do Módulo *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    placeholder="Ex: Introdução ao Marketing Digital"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Descrição *
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    placeholder="Descreva o conteúdo deste módulo"
                    required
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Criar Módulo
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}