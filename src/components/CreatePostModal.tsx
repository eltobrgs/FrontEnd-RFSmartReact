import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiPaperclip } from 'react-icons/fi';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ title, description, selectedSpace, selectedTags });
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
              <h2 className="text-xl font-medium text-white">Criar publicação</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Space selection */}
              <div>
                <label htmlFor="space" className="block text-sm font-medium text-gray-300 mb-2">
                  Vincule a um espaço
                </label>
                <select
                  id="space"
                  value={selectedSpace}
                  onChange={(e) => setSelectedSpace(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="" disabled>Escolha um item</option>
                  <option value="general">Geral</option>
                  <option value="announcements">Anúncios</option>
                </select>
              </div>

              {/* Media upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-300">Upload de mídia</h3>
                  <button
                    type="button"
                    className="text-green-500 hover:text-green-400 text-sm font-medium"
                  >
                    Incorporar link externo
                  </button>
                </div>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 hover:border-green-500 transition-colors cursor-pointer text-center">
                  <FiUpload className="w-8 h-8 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400 mb-2">Vídeo, imagem ou áudio</p>
                  <p className="text-gray-500 text-sm">Máximo 15GB</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Extensões válidas: jpeg, jpg, png, gif, mov, avi, m4v, mpg, mp4, webm e quicktime
                  </p>
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Título
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={170}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    {title.length}/170
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={10000}
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  />
                  <span className="absolute right-3 bottom-3 text-sm text-gray-500">
                    {description.length}/10000
                  </span>
                </div>
              </div>

              {/* File attachments */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-300">Anexar arquivos</h3>
                  <span className="text-gray-500 text-sm">Máximo de 50Mb</span>
                </div>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors cursor-pointer text-center">
                  <FiPaperclip className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm">
                    Extensões válidas: pdf, tiff, doc, xls, ogg, mp3, jpeg, jpg, png, gif, mp4, mov, avi, m4v, mpg, webm e quicktime
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-gray-400 hover:text-white"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="tags"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Adicionar tag"
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>

              {/* Content release */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-4">Liberação do conteúdo</h3>
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Liberação imediata</p>
                    <p className="text-sm text-gray-400">Após a confirmação da compra</p>
                  </div>
                  <button
                    type="button"
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
                Publicar
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}