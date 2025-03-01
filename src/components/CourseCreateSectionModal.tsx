import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiBook, FiShoppingBag } from 'react-icons/fi';

interface CourseCreateSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CourseCreateSectionModal({ isOpen, onClose }: CourseCreateSectionModalProps) {
  const [sectionType, setSectionType] = useState('course');
  const [sectionName, setSectionName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📚');
  const [accessType, setAccessType] = useState('immediate');

  const icons = ['📚', '🎓', '📖', '✏️', '📝', '💡', '🎯', '🔍', '📊', '💻'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ sectionType, sectionName, selectedIcon, accessType });
    onClose();
  };

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
            className="fixed inset-8 bg-gray-900 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-medium text-white">Criar seção</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section Type */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Tipo de seção</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSectionType('course')}
                    className={`p-4 rounded-lg border-2 ${sectionType === 'course' ? 'border-green-500 bg-gray-800' : 'border-gray-700 hover:border-gray-600'} flex items-center gap-4`}
                  >
                    <div className="p-3 rounded-lg bg-gray-700">
                      <FiBook className="w-6 h-6 text-gray-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-white">Módulos do curso</h3>
                      <p className="text-sm text-gray-400">Organize suas aulas em módulos</p>
                    </div>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSectionType('showcase')}
                    className={`p-4 rounded-lg border-2 ${sectionType === 'showcase' ? 'border-green-500 bg-gray-800' : 'border-gray-700 hover:border-gray-600'} flex items-center gap-4`}
                  >
                    <div className="p-3 rounded-lg bg-gray-700">
                      <FiShoppingBag className="w-6 h-6 text-gray-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-white">Vitrine de produtos</h3>
                      <p className="text-sm text-gray-400">Exiba outros produtos</p>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Section Name */}
              <div>
                <label htmlFor="sectionName" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome da seção
                </label>
                <input
                  type="text"
                  id="sectionName"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder="Ex: Módulo 1: Introdução"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ícone da seção
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {icons.map((icon: string) => (
                    <motion.button
                      key={icon}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedIcon(icon)}
                      className={`p-3 text-xl rounded-lg ${selectedIcon === icon ? 'bg-green-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                    >
                      {icon}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Access Control */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-4">Liberação do conteúdo</h3>
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-white">
                      {accessType === 'immediate' ? 'Liberação imediata' : 'Liberação programada'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {accessType === 'immediate' ? 'Após a confirmação da compra' : 'Definir data específica'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAccessType(accessType === 'immediate' ? 'scheduled' : 'immediate')}
                    className="text-green-500 hover:text-green-400 font-medium"
                  >
                    Alterar
                  </button>
                </div>
              </div>
            </form>

            <div className="p-6 border-t border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Criar seção
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}