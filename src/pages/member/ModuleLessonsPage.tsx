// React core
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Animations
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { FiArrowLeft, FiPlay, FiCheck, FiDownload, FiClock, FiChevronDown, FiChevronUp} from 'react-icons/fi';

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
  const [error, setError] = useState('');
  const [progressUpdateLoading, setProgressUpdateLoading] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  // Buscar detalhes do módulo
  useEffect(() => {
    const fetchModuleDetails = async () => {
      if (!moduleId) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:3000/api/modules/${moduleId}`, {
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
          fetchLessonDetails(data.lessons[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes do módulo');
        console.error('Erro ao buscar detalhes do módulo:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModuleDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  // Buscar detalhes da aula quando selecionada
  const fetchLessonDetails = async (lessonId: string) => {
    if (!lessonId) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3000/api/lessons/${lessonId}`, {
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
    } catch (err) {
      console.error('Erro ao buscar detalhes da aula:', err);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    fetchLessonDetails(lesson.id);
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
      
      const response = await fetch(`http://localhost:3000/api/lessons/${lessonId}/progress`, {
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
          completedLessons
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
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
    } finally {
      setProgressUpdateLoading(false);
    }
  };

  const markAsCompleted = async (lessonId: string) => {
    await handleUpdateProgress(lessonId, 100, true);
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
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Verificar se é uma URL do Vimeo
    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('vimeo.com/')[1].split('?')[0];
      if (vimeoId) {
        return `https://player.vimeo.com/video/${vimeoId}`;
      }
    }
    
    // Se já for uma URL de incorporação, retornar como está
    if (url.includes('embed') || url.includes('player')) {
      return url;
    }
    
    // Caso contrário, retornar a URL original
    return url;
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
          onClick={() => navigate(`/member/products/${productId}/content`)}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Voltar para o Produto
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
              <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/member/products/${productId}/content`)}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
              </motion.button>
          <div>
            <h1 className="text-xl font-medium">{module.title}</h1>
            {module.product && (
              <p className="text-sm text-gray-400">{module.product.name}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {module.progress !== undefined && (
            <div className="text-sm text-gray-400">
              Progresso: {module.progress}% • {module.completedLessons || 0}/{module.totalLessons || module.lessons.length} aulas concluídas
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Lesson List */}
        <div className="w-80 bg-gray-800 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Aulas</h2>
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
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${lesson.progress}%` }}
                              ></div>
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
          </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {selectedLesson ? (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-medium mb-2">{selectedLesson.title}</h2>
                <p className="text-gray-400">{selectedLesson.description}</p>
              </div>

              {selectedLesson.videoUrl && (
                <div className="aspect-video mb-6 bg-black rounded-lg overflow-hidden">
                  <iframe
                    ref={videoRef}
                    src={formatVideoUrl(selectedLesson.videoUrl)}
                    title={selectedLesson.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
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
                  onClick={() => markAsCompleted(selectedLesson.id)}
                  disabled={progressUpdateLoading || selectedLesson.completed}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedLesson.completed
                      ? 'bg-green-600 text-white cursor-default'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  <FiCheck className="w-5 h-5" />
                  <span>{selectedLesson.completed ? 'Aula Concluída' : 'Marcar como Concluída'}</span>
                </motion.button>
              </div>
              
              {selectedLesson.progress !== undefined && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Seu progresso</span>
                    <span className="text-sm text-gray-400">{selectedLesson.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${selectedLesson.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Selecione uma aula para começar</p>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}