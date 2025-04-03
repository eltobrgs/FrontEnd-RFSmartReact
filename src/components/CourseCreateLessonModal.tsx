import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiYoutube, FiVideo, FiUpload } from 'react-icons/fi';
import { API_BASE_URL } from '../variables/api';

interface CourseCreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  moduleId: string;
  initialData?: {
    id: string;
    title: string;
    description: string;
    videoUrl?: string;
  };
  isEditing?: boolean;
}

export const CourseCreateLessonModal = ({
  isOpen,
  onClose,
  onSuccess,
  moduleId,
  initialData,
  isEditing = false
}: CourseCreateLessonModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [previewVideo, setPreviewVideo] = useState<string | undefined>(undefined);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      
      // Se o URL começar com 'https://www.youtube.com' ou similar, é um vídeo do YouTube
      if (initialData.videoUrl && (
        initialData.videoUrl.includes('youtube.com') || 
        initialData.videoUrl.includes('youtu.be')
      )) {
        setYoutubeUrl(initialData.videoUrl);
        setPreviewVideo(undefined);
      } else if (initialData.videoUrl) {
        // Se não, é um vídeo armazenado
        setYoutubeUrl('');
        setPreviewVideo(initialData.videoUrl);
      }
    } else if (isOpen) {
      // Reset form when opening for new creation
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setYoutubeUrl('');
      setPreviewVideo(undefined);
      setRemoveVideo(false);
      setError('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      setError('Preencha o título e a descrição');
      return;
    }
    
    // Validar se há conteúdo de vídeo
    const hasVideoFile = videoFile !== null;
    const hasYoutubeUrl = youtubeUrl.trim() !== '';
    
    if (!hasVideoFile && !hasYoutubeUrl && !isEditing) {
      setError('Adicione um vídeo ou forneça um link do YouTube');
      return;
    }
    
    console.log('Estado do vídeo na submissão:', {
      videoFile: videoFile ? `${videoFile.name} (${videoFile.size} bytes)` : 'nenhum',
      youtubeUrl,
      removeVideo,
      hasVideoFile,
      hasYoutubeUrl
    });
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('moduleId', moduleId);
      
      if (hasYoutubeUrl) {
        console.log('Enviando URL do YouTube:', youtubeUrl);
        formData.append('youtubeUrl', youtubeUrl);
      }

      // Adicionar arquivo de vídeo, se selecionado
      if (hasVideoFile && videoFile) {
        console.log('Anexando vídeo ao FormData:', videoFile.name, videoFile.size);
        formData.append('video', videoFile);
      }

      // Adicionar flag de remoção para edição
      if (isEditing && removeVideo) {
        formData.append('removeVideo', 'true');
      }

      // Definir URL da requisição
      const url = isEditing 
        ? `${API_BASE_URL}/lessons/${initialData?.id}` 
        : `${API_BASE_URL}/lessons`;

      console.log('Enviando para:', url, { method: isEditing ? 'PUT' : 'POST' });
      
      // Verificar conteúdo do FormData
      console.log('Enviando FormData:');
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${typeof pair[1] === 'object' ? 'Arquivo: ' + (pair[1] as File).name : pair[1]}`);
      }
      
      // Executar a requisição
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      // Verificar resposta
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      // Sucesso: limpar formulário
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setYoutubeUrl('');
      setRemoveVideo(false);
      
      // Fechar modal e notificar sucesso
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar aula');
      console.error('Erro na requisição:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (file: File | null) => {
    console.log('handleVideoChange recebeu:', file ? `${file.name} (${file.size} bytes)` : 'nenhum');
    
    if (file) {
      setVideoFile(file);
      setYoutubeUrl(''); // Limpar YouTube se arquivo foi escolhido
      setRemoveVideo(false);
      console.log('Estado do videoFile após alteração:', file.name);
    } else if (file === null) {
      setVideoFile(null);
      console.log('Arquivo de vídeo removido');
    }
  };

  const handleYoutubeChange = (url: string) => {
    setYoutubeUrl(url);
    setVideoFile(null);
    setRemoveVideo(false);
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setYoutubeUrl('');
    setRemoveVideo(true);
    setPreviewVideo(undefined);
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
                {isEditing ? 'Editar Aula' : 'Criar Nova Aula'}
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
                    placeholder="Ex: Aula 1: Introdução"
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
                    placeholder="Descreva o conteúdo desta aula"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vídeo da Aula <span className="text-green-400">*</span>
                  </label>
                  
                  {/* Área de upload de vídeo */}
                  {previewVideo ? (
                    <div className="relative rounded-xl overflow-hidden mb-3">
                      <video 
                        src={previewVideo} 
                        controls 
                        className="w-full rounded-lg"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleRemoveVideo}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
                        type="button"
                      >
                        <FiX className="w-4 h-4" />
                      </motion.button>
                    </div>
                  ) : videoFile ? (
                    <div className="bg-gray-700 border border-gray-600 rounded-xl p-4 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-green-900 flex items-center justify-center mr-3">
                            <FiVideo className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white truncate max-w-xs">{videoFile.name}</p>
                            <p className="text-xs text-gray-400">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleRemoveVideo}
                          className="p-2 text-gray-400 hover:text-red-400"
                          type="button"
                        >
                          <FiX className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  ) : youtubeUrl ? (
                    <div className="bg-gray-700 border border-gray-600 rounded-xl p-4 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-red-900 flex items-center justify-center mr-3">
                            <FiYoutube className="w-5 h-5 text-red-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Vídeo do YouTube</p>
                            <p className="text-xs text-gray-400 truncate max-w-xs">{youtubeUrl}</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleRemoveVideo}
                          className="p-2 text-gray-400 hover:text-red-400"
                          type="button"
                        >
                          <FiX className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 mb-3 hover:border-green-500 transition-colors">
                    <input 
                      type="file" 
                      accept="video/*"
                        id="video-upload"
                        className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                            handleVideoChange(file);
                        }
                      }}
                    />
                      <div className="flex flex-col items-center justify-center">
                        <FiVideo className="w-12 h-12 text-gray-500 mb-4" />
                        <p className="text-gray-300 font-medium mb-2 text-center">Adicionar vídeo da aula</p>
                        <p className="text-sm text-gray-500 mb-4 text-center">Arraste e solte ou escolha uma opção abaixo</p>
                        
                        <div className="flex flex-wrap gap-3 justify-center">
                          <label
                            htmlFor="video-upload"
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors cursor-pointer flex items-center"
                          >
                            <FiUpload className="w-4 h-4 mr-2" />
                            Selecionar arquivo
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const url = prompt('Cole o link do YouTube:');
                              if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
                                handleYoutubeChange(url);
                              } else if (url) {
                                alert('Por favor, insira um link válido do YouTube');
                              }
                            }}
                            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center"
                          >
                            <FiYoutube className="w-4 h-4 mr-2" />
                            Link do YouTube
                          </button>
                        </div>
                      </div>
                  </div>
                  )}
                  
                  <p className="text-xs text-gray-400">
                    Formatos aceitos: MP4, MOV, WEBM. Tamanho máximo: 50MB. Alternativamente, forneça um link do YouTube.
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
                    className="px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors relative overflow-hidden flex items-center justify-center"
                    disabled={loading}
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
                      <span>{isEditing ? 'Salvar Alterações' : 'Criar Aula'}</span>
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