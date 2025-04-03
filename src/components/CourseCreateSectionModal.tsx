import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiImage } from 'react-icons/fi';
import { API_BASE_URL } from '../variables/api';

interface CourseCreateSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  productId: string;
  initialData?: {
    id: string;
    title: string;
    description: string;
    image?: string;
  };
  isEditing?: boolean;
}

export const CourseCreateSectionModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  productId,
  initialData,
  isEditing = false 
}: CourseCreateSectionModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPreviewImage(initialData.image);
    } else if (isOpen) {
      // Reset form when opening for new creation
      setTitle('');
      setDescription('');
      setImageFile(null);
      setRemoveImage(false);
      setPreviewImage(undefined);
      setError('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação
    if (!title.trim() || !description.trim()) {
      setError('Título e descrição são obrigatórios.');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        return;
      }

      // Usar FormData para suportar upload de arquivos
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('productId', productId);

      // Adicionar arquivo de imagem, se selecionado
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // Flag para remover imagem atual (apenas para edição)
      if (isEditing && removeImage) {
        formData.append('removeImage', 'true');
      }

      const url = isEditing 
        ? `${API_BASE_URL}/modules/${initialData?.id}` 
        : `${API_BASE_URL}/modules`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar módulo');
      }

      // Limpar formulário
      setTitle('');
      setDescription('');
      setImageFile(null);
      setRemoveImage(false);
      
      // Fechar modal e notificar sucesso
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar módulo');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setRemoveImage(true);
    setPreviewImage(undefined);
  };

  return (
    <AnimatePresence>
      {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
              className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 overflow-hidden"
          >
              <div className="flex items-center justify-between p-5 border-b border-gray-700">
                <h2 className="text-xl font-medium text-white">
                  {isEditing ? 'Editar Módulo' : 'Criar Novo Módulo'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="p-5">
                <div className="space-y-5">
                {error && (
                    <div className="p-4 bg-red-900 bg-opacity-50 text-red-200 rounded-xl text-sm border border-red-700">
                    {error}
                  </div>
                )}
                
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                      Título <span className="text-green-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Módulo 1: Introdução"
                    required
                  />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                      Descrição <span className="text-green-400">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Descreva o conteúdo deste módulo"
                    required
                  />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                    Imagem do Módulo
                  </label>
                    
                    {previewImage ? (
                      <div className="relative rounded-xl overflow-hidden mb-3">
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-40 object-cover" 
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
                        >
                          <FiX className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-gray-600 rounded-xl p-6 mb-3 hover:border-green-500 transition-colors cursor-pointer flex flex-col items-center justify-center"
                        onClick={() => document.getElementById('module-image-upload')?.click()}
                      >
                        <FiImage className="w-12 h-12 text-gray-500 mb-3" />
                        <p className="text-gray-400 text-sm mb-1">Clique para selecionar uma imagem</p>
                        <p className="text-gray-500 text-xs">JPG, PNG ou GIF • Máximo de 5MB</p>
                        <input
                          type="file"
                          id="module-image-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageChange(file);
                          }}
                        />
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400">
                      A imagem ajuda a identificar o módulo e torna o curso mais atrativo para os alunos.
                  </p>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                      className="px-5 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                    </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                      className="px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors relative overflow-hidden flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Processando...</span>
                        </>
                      ) : (
                        <span>{isEditing ? 'Salvar Alterações' : 'Criar Módulo'}</span>
                      )}
                  </motion.button>
                </div>
                </div>
              </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};