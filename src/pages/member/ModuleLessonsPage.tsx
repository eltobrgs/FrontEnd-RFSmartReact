// React core
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Animations
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { FiArrowLeft, FiPlay, FiCheck, FiDownload, FiClock, FiChevronDown, FiChevronUp, FiMenu, FiX } from 'react-icons/fi';

// Importando a variável API_BASE_URL
import { API_BASE_URL } from '../../variables/api';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration?: string;
  progress?: number;
  completed?: boolean;
  videoUrl?: string;
  materialUrl?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  image: string;
  lessons: Lesson[];
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
  product?: {
    id: string;
    name: string;
  };
}

export function ModuleLessonsPage() {
  const { productId, moduleId } = useParams<{ productId: string; moduleId: string }>();
  const navigate = useNavigate();
  const [module, setModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [error, setError] = useState('');
  const [progressUpdateLoading, setProgressUpdateLoading] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | ''}>({message: '', type: ''});
  // Estado para controlar a visibilidade da sidebar em telas menores
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Estado para controlar o carregamento do vídeo
  const [videoLoading, setVideoLoading] = useState(true);

  // Função para alternar a visibilidade da sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Verificar o tamanho da tela ao carregar e redimensionar
  useEffect(() => {
    const checkScreenSize = () => {
      // Em telas menores, a sidebar começará fechada
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Verificar no carregamento
    checkScreenSize();
    
    // Verificar ao redimensionar
    window.addEventListener('resize', checkScreenSize);
    
    // Limpar o event listener
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Mostrar notificação
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({message, type});
    
    // Limpar notificação após 3 segundos
    setTimeout(() => {
      setNotification({message: '', type: ''});
    }, 3000);
  };

  // Buscar dados do módulo
  useEffect(() => {
    const fetchModuleData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Falha ao carregar detalhes do módulo');
        }
        
        const data = await response.json();
        setModule(data);
        
        // Selecionar a primeira aula se houver
        if (data.lessons && data.lessons.length > 0) {
          setSelectedLesson(data.lessons[0]);
          
          // Inicializar o estado de expansão das aulas
          const initialExpandedState: Record<string, boolean> = {};
          data.lessons.forEach((lesson: Lesson) => {
            initialExpandedState[lesson.id] = false;
          });
          setExpandedLessons(initialExpandedState);
          
          // Buscar detalhes da primeira aula
          await fetchLessonData(data.lessons[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes do módulo');
        console.error('Erro ao buscar detalhes do módulo:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModuleData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Buscar dados da lição
  const fetchLessonData = async (lessonId: string) => {
    setLessonLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao carregar detalhes da aula');
      }
      
      const data = await response.json();
      console.log('Detalhes da aula:', data);
      
      // Atualizar a aula selecionada com os detalhes completos
      setSelectedLesson(data);
      
      // Atualizar a aula na lista de aulas do módulo
      if (module) {
        const updatedLessons = module.lessons.map(lesson => 
          lesson.id === data.id ? data : lesson
        );
        
        setModule({
          ...module,
          lessons: updatedLessons
        });
      }
      
      // Em dispositivos móveis, fechar a sidebar após selecionar uma aula
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes da aula:', err);
    } finally {
      setLessonLoading(false);
    }
  };

  const handleLessonSelect = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    await fetchLessonData(lesson.id);
  };

  const toggleLessonExpand = (lessonId: string) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const handleUpdateProgress = async (lessonId: string, progress: number, completed: boolean) => {
    if (progressUpdateLoading) return;
    
    setProgressUpdateLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Mostrar feedback visual de carregamento
      if (selectedLesson && selectedLesson.id === lessonId) {
        setSelectedLesson({
          ...selectedLesson,
          progress: progress,
          completed: completed
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          progress,
          completed
        })
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar progresso');
      }
      
      const data = await response.json();
      console.log('Progresso atualizado:', data);
      
      // Atualizar a aula na lista de aulas do módulo
      if (module) {
        const updatedLessons = module.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, progress, completed } : lesson
        );
        
        // Calcular o novo progresso do módulo
        let totalProgress = 0;
        let completedLessons = 0;
        
        updatedLessons.forEach(lesson => {
          totalProgress += lesson.progress || 0;
          if (lesson.completed) {
            completedLessons++;
          }
        });
        
        const moduleProgress = updatedLessons.length > 0 
          ? Math.round(totalProgress / updatedLessons.length) 
          : 0;
        
        setModule({
          ...module,
          lessons: updatedLessons,
          progress: moduleProgress,
          completedLessons,
          totalLessons: module.lessons.length
        });
        
        // Atualizar a aula selecionada se for a mesma
        if (selectedLesson && selectedLesson.id === lessonId) {
          setSelectedLesson({
            ...selectedLesson,
            progress,
            completed
          });
        }
      }
      
      // Exibir mensagem de sucesso
      showNotification(completed ? 'Progresso atualizado com sucesso!' : 'Aula desmarcada com sucesso!', 'success');
      
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
      showNotification('Erro ao atualizar progresso. Tente novamente.', 'error');
      
      // Reverter o estado visual em caso de erro
      if (module && selectedLesson && selectedLesson.id === lessonId) {
        const originalLesson = module.lessons.find(l => l.id === lessonId);
        if (originalLesson) {
          setSelectedLesson(originalLesson);
        }
      }
    } finally {
      setProgressUpdateLoading(false);
    }
  };

  // Substituindo a função markAsCompleted por toggleLessonCompletion
  const toggleLessonCompletion = async (lessonId: string) => {
    // Verificar o estado atual da aula
    const isCurrentlyCompleted = selectedLesson?.completed || false;
    
    try {
      const token = localStorage.getItem('token');
      
      setProgressUpdateLoading(true);
      
      // Se já estiver concluída, desmarca usando a API de progresso
      if (isCurrentlyCompleted) {
        await handleUpdateProgress(lessonId, 0, false);
        return;
      }
      
      // Caso contrário, marca como concluída
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Se falhar, use a rota de progresso como fallback
        await handleUpdateProgress(lessonId, 100, true);
        return;
      }
      
      const data = await response.json();
      console.log('Aula marcada como concluída:', data);
      
      // Atualizar a UI após marcar como concluída
      if (module) {
        const updatedLessons = module.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, progress: 100, completed: true } : lesson
        );
        
        // Calcular o novo progresso do módulo
        let completedLessons = 0;
        updatedLessons.forEach(lesson => {
          if (lesson.completed) {
            completedLessons++;
          }
        });
        
        const moduleProgress = updatedLessons.length > 0 
          ? Math.round((completedLessons / updatedLessons.length) * 100) 
          : 0;
        
        setModule({
          ...module,
          lessons: updatedLessons,
          progress: moduleProgress,
          completedLessons,
          totalLessons: module.lessons.length
        });
        
        // Atualizar a aula selecionada se for a mesma
        if (selectedLesson && selectedLesson.id === lessonId) {
          setSelectedLesson({
            ...selectedLesson,
            progress: 100,
            completed: true
          });
        }
      }
      
      // Exibir mensagem de sucesso
      showNotification('Aula marcada como concluída!', 'success');
      
    } catch (err) {
      console.error('Erro ao atualizar estado da aula:', err);
      showNotification('Erro ao atualizar estado da aula. Tente novamente.', 'error');
    } finally {
      setProgressUpdateLoading(false);
    }
  };

  // Função para formatar a URL do vídeo para incorporação
  const formatVideoUrl = (url: string | undefined): string => {
    if (!url) return '';
    
    // Verificar se é uma URL do YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Extrair o ID do vídeo
      let videoId = '';
      
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      
      if (videoId) {
        // Adicionando parâmetros para melhor UI e controle
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;
      }
    }
    
    // Verificar se é uma URL do Vimeo
    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('vimeo.com/')[1].split('?')[0];
      if (vimeoId) {
        // Adicionando parâmetros para melhor UI
        return `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`;
      }
    }
    
    // Se já for uma URL de incorporação, retornar como está
    if (url.includes('embed') || url.includes('player')) {
      return url;
    }
    
    // Caso contrário, retornar a URL original
    return url;
  };

  // Função para lidar com o carregamento do vídeo
  const handleVideoLoad = () => {
    setVideoLoading(false);
  };

  // Função para reiniciar o estado de carregamento do vídeo quando mudar de aula
  useEffect(() => {
    if (selectedLesson?.videoUrl) {
      setVideoLoading(true);
    }
  }, [selectedLesson?.videoUrl]);

  // Para o botão de voltar:
  const handleBackClick = () => {
    const targetPath = `/member/products/${productId}/content`;
    if (window.location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !module) {
  return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Erro ao carregar módulo</h2>
        <p className="text-gray-300 mb-6">{error || 'Módulo não encontrado'}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackClick}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Voltar para o Produto
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Notificação */}
      <AnimatePresence>
        {notification.message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <p className="text-white font-medium">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <header className="bg-gray-800 py-4 px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-4">
              <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBackClick}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
              </motion.button>
          <div className="hidden sm:block">
            <h1 className="text-xl font-medium">{module.title}</h1>
            {module.product && (
              <p className="text-sm text-gray-400">{module.product.name}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Botão para toggle da sidebar em dispositivos móveis */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </motion.button>
          
          <div className="hidden sm:block text-sm text-gray-400">
              Progresso: {module.progress}% • {module.completedLessons || 0}/{module.totalLessons || module.lessons.length} aulas concluídas
            </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - Lesson List - Retrátil em dispositivos móveis */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute md:relative w-full md:w-80 bg-gray-800 overflow-y-auto z-10 h-full"
              style={{ maxWidth: "100%", width: "280px" }}
            >
          <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Aulas</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleSidebar}
                    className="md:hidden p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </motion.button>
                </div>
                
              <div className="space-y-2">
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-lg overflow-hidden">
                  <div
                    className={`p-3 cursor-pointer ${
                      selectedLesson?.id === lesson.id
                        ? 'bg-gray-700'
                        : 'bg-gray-800 hover:bg-gray-700/50'
                    } transition-colors`}
                    onClick={() => handleLessonSelect(lesson)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          lesson.completed
                            ? 'bg-green-500 text-white'
                            : lesson.progress && lesson.progress > 0
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {lesson.completed ? (
                            <FiCheck className="w-4 h-4" />
                          ) : (
                            <FiPlay className="w-3 h-3" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium truncate">{lesson.title}</h3>
                          {lesson.duration && (
                            <p className="text-xs text-gray-400 flex items-center">
                              <FiClock className="w-3 h-3 mr-1" />
                              {lesson.duration}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLessonExpand(lesson.id);
                        }}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        {expandedLessons[lesson.id] ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {expandedLessons[lesson.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 text-xs text-gray-400 overflow-hidden"
                        >
                          <p className="mb-2">{lesson.description}</p>
                          {lesson.progress !== undefined && (
                            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${lesson.progress}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className={`h-full ${
                                      lesson.completed 
                                        ? 'bg-gradient-to-r from-green-500 to-green-400' 
                                        : 'bg-gradient-to-r from-blue-500 to-blue-400'
                                    }`}
                                  ></motion.div>
              </div>
                          )}
          </motion.div>
        )}
      </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Área principal - Visível mesmo quando a sidebar está fechada */}
        <div className="flex-1 overflow-y-auto ml-0 md:ml-0">
          {/* Botão flutuante para abrir a sidebar em dispositivos móveis */}
          {!sidebarOpen && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="md:hidden fixed bottom-6 left-6 z-30 p-3 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
            >
              <FiMenu className="w-6 h-6" />
            </motion.button>
          )}
          
          {/* Overlay para fechar a sidebar quando clicado fora */}
          {sidebarOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
              onClick={toggleSidebar}
            ></div>
          )}
          
          {selectedLesson ? (
            <div className="p-4 md:p-6">
              {/* Título da aula - Exibido apenas em telas menores quando a sidebar está fechada */}
              <div className="sm:hidden mb-4">
                <h1 className="text-xl font-medium">{module.title}</h1>
                {module.product && (
                  <p className="text-sm text-gray-400">{module.product.name}</p>
                )}
              </div>
              
              {lessonLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-medium mb-2">{selectedLesson.title}</h2>
                    <p className="text-gray-400">{selectedLesson.description}</p>
                  </div>

                  {selectedLesson.videoUrl && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mb-6 relative"
                    >
                      <div className="aspect-video overflow-hidden relative rounded-xl bg-gray-800 shadow-2xl ring-1 ring-gray-700">
                        {/* Overlay de carregamento */}
                        <AnimatePresence>
                          {videoLoading && (
                            <motion.div 
                              initial={{ opacity: 1 }} 
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center z-10"
                            >
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="w-12 h-12 rounded-full border-4 border-gray-500 border-t-green-400 mb-4"
                              />
                              <p className="text-gray-300 font-medium">Carregando vídeo...</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Player de vídeo responsivo */}
                        <div className="relative w-full h-full">
                      <iframe
                        ref={videoRef}
                        src={formatVideoUrl(selectedLesson.videoUrl)}
                        title={selectedLesson.title}
                            className="w-full h-full absolute inset-0"
                            onLoad={handleVideoLoad}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            style={{ borderRadius: "0.75rem" }}
                      ></iframe>
                    </div>
                      </div>
                      
                      {/* Informações do vídeo */}
                      <div className="flex justify-between items-center mt-3 px-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400 flex items-center">
                            <FiPlay className="w-3 h-3 mr-1" />
                            {selectedLesson.duration || "Vídeo"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Arraste para reposicionar • Clique duplo para tela cheia
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                    {selectedLesson.materialUrl && (
                      <a
                        href={selectedLesson.materialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <FiDownload className="w-5 h-5" />
                        <span>Material Complementar</span>
                      </a>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleLessonCompletion(selectedLesson.id)}
                      disabled={progressUpdateLoading}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        selectedLesson.completed
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : progressUpdateLoading
                          ? 'bg-gray-600 text-white cursor-wait'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {progressUpdateLoading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      ) : selectedLesson.completed ? (
                        <FiX className="w-5 h-5" />
                      ) : (
                        <FiCheck className="w-5 h-5" />
                      )}
                      <span>
                        {selectedLesson.completed 
                          ? 'Desmarcar Aula' 
                          : progressUpdateLoading 
                          ? 'Processando...' 
                          : 'Marcar como Concluída'}
                      </span>
                    </motion.button>
                  </div>
                  
                  {selectedLesson.progress !== undefined && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Seu progresso</span>
                        <span className="text-sm text-gray-400">{selectedLesson.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedLesson.progress}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-green-500 to-green-400"
                          style={{ 
                            boxShadow: selectedLesson.progress > 0 ? '0 0 8px rgba(34, 197, 94, 0.5)' : 'none'
                          }}
                        ></motion.div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <p className="text-gray-400 mb-4">Selecione uma aula para começar</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSidebar}
                  className="md:hidden px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Ver lista de aulas
                </motion.button>
              </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}