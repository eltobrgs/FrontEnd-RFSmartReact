import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (postData: { title: string; description: string; space: string; tags: string[] }) => void;
}

export function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [space, setSpace] = useState('Geral');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
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
        space,
        tags
      });
    }
    
    // Limpar o formulário
    setTitle('');
    setDescription('');
    setSpace('Geral');
    setTags([]);
    setTagInput('');
    setError('');
    
    onClose();
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
              <h2 className="text-xl font-medium text-white">Criar Novo Post</h2>
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
                    Título *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    placeholder="Digite o título do post"
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
                    rows={6}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    placeholder="Digite a descrição do post"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="space" className="block text-sm font-medium text-gray-300 mb-1">
                    Espaço
                  </label>
                  <select
                    id="space"
                    value={space}
                    onChange={(e) => setSpace(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  >
                    <option value="Geral">Geral</option>
                    <option value="Anúncios">Anúncios</option>
                    <option value="Dicas">Dicas</option>
                    <option value="Perguntas">Perguntas</option>
                    <option value="Recursos">Recursos</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                    Tags
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                      placeholder="Digite uma tag e pressione Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Adicionar
                    </motion.button>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <div
                          key={tag}
                          className="px-3 py-1 bg-gray-700 text-white rounded-full flex items-center gap-2"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-gray-400 hover:text-white"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="pt-4 flex justify-end">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Publicar Post
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