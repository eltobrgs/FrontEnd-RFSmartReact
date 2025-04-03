import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleTitle: string;
  onSubmit?: (lessonData: { title: string; description: string; videoUrl: string; materialUrl?: string }) => void;
  initialValues?: { title: string; description: string; videoUrl: string; materialUrl?: string };
  isEditing?: boolean;
}

export function AddLessonModal({ 
  isOpen, 
  onClose, 
  moduleTitle, 
  onSubmit, 
  initialValues, 
  isEditing = false 
}: AddLessonModalProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [videoUrl, setVideoUrl] = useState(initialValues?.videoUrl || '');
  const [materialUrl, setMaterialUrl] = useState(initialValues?.materialUrl || '');
  const [error, setError] = useState('');

  // Atualizar os campos quando initialValues mudar
  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setDescription(initialValues.description || '');
      setVideoUrl(initialValues.videoUrl || '');
      setMaterialUrl(initialValues.materialUrl || '');
    }
  }, [initialValues]);

  // Limpar o formulário quando o modal é aberto (apenas se não estiver editando)
  useEffect(() => {
    if (isOpen && !isEditing && !initialValues) {
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setMaterialUrl('');
      setError('');
    }
  }, [isOpen, isEditing, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    console.log(`${isEditing ? 'Editando' : 'Enviando'} dados da aula:`, { title, description, videoUrl, materialUrl });
    
    if (onSubmit) {
      onSubmit({
        title,
        description,
        videoUrl,
        materialUrl
      });
    }
    
    // Não limpar o formulário aqui, pois o onClose já vai limpar
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
            className="fixed inset-8 bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-medium text-white">
                  {isEditing ? 'Editar Aula' : 'Adicionar Aula'}
                </h2>
                <p className="text-sm text-gray-400">Módulo: {moduleTitle}</p>
              </div>
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
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Título da Aula *
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
                    placeholder="Descreva o conteúdo desta aula"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300 mb-1">
                    URL do Vídeo
                  </label>
                  <input
                    type="url"
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    placeholder="Ex: https://www.youtube.com/watch?v=..."
                  />
                </div>
                
                <div>
                  <label htmlFor="materialUrl" className="block text-sm font-medium text-gray-300 mb-1">
                    URL do Material de Apoio
                  </label>
                  <input
                    type="url"
                    id="materialUrl"
                    value={materialUrl}
                    onChange={(e) => setMaterialUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    placeholder="Ex: https://drive.google.com/file/..."
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    {isEditing ? 'Salvar Alterações' : 'Adicionar Aula'}
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