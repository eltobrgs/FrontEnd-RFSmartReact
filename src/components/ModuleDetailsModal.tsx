import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlay, FiClock, FiCalendar, FiLink, FiEye, FiLock, FiEdit, FiTrash2 } from 'react-icons/fi';

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  progress?: number;
  createdAt?: string;
  status?: 'published' | 'draft';
  materialUrl?: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  icon: string;
  lessonsCount: number;
  createdAt: string;
  lessons?: Lesson[];
  status?: 'published' | 'draft';
  visibility?: 'public' | 'private';
  lastUpdated?: string;
}

interface ModuleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module | null;
  onLessonClick: (lesson: Lesson) => void;
}

export function ModuleDetailsModal({ isOpen, onClose, module, onLessonClick }: ModuleDetailsModalProps) {
  if (!module) return null;

  // Mock lessons data
  const mockLessons: Lesson[] = [
    {
      id: 1,
      title: 'Introdução ao Módulo',
      description: 'Visão geral do que será abordado neste módulo',
      duration: '10 min',
      progress: 100,
      videoUrl: 'https://www.youtube.com/embed/abc123',
      createdAt: '10/01/2024',
      status: 'published',
      materialUrl: 'https://example.com/material1.pdf'
    },
    {
      id: 2,
      title: 'Conceitos Fundamentais',
      description: 'Aprenda os conceitos básicos necessários',
      duration: '15 min',
      progress: 60,
      videoUrl: 'https://www.youtube.com/embed/def456',
      createdAt: '12/01/2024',
      status: 'published'
    },
    {
      id: 3,
      title: 'Práticas Recomendadas',
      description: 'Melhores práticas e dicas importantes',
      duration: '20 min',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/ghi789',
      createdAt: '15/01/2024',
      status: 'draft'
    }
  ];

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
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-xl">
                  {module.icon}
                </div>
                <div>
                  <h2 className="text-xl font-medium text-white">{module.title}</h2>
                  <p className="text-sm text-gray-400">{module.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            {/* Technical Module Information for Producers */}
            <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Informações Técnicas do Módulo</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Data de Criação</p>
                    <p className="text-sm text-white">{module.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Última Atualização</p>
                    <p className="text-sm text-white">{module.lastUpdated || module.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FiEye className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Status</p>
                    <p className="text-sm text-white flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${module.status === 'draft' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                      {module.status === 'draft' ? 'Rascunho' : 'Publicado'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FiLock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Visibilidade</p>
                    <p className="text-sm text-white">{module.visibility === 'private' ? 'Privado' : 'Público'}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs flex items-center gap-1"
                >
                  <FiEdit className="w-3 h-3" /> Editar Módulo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-1 bg-red-500 text-white rounded text-xs flex items-center gap-1"
                >
                  <FiTrash2 className="w-3 h-3" /> Excluir Módulo
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-lg font-medium text-white mb-4">Aulas do Módulo</h3>
              <div className="space-y-6">
                {mockLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
                  >
                    {/* Lesson Header */}
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">{lesson.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <FiClock className="w-3 h-3" /> {lesson.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" /> Criado em {lesson.createdAt}
                          </span>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${lesson.status === 'draft' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-green-900/30 text-green-400'}`}>
                            {lesson.status === 'draft' ? 'Rascunho' : 'Publicado'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
                        >
                          <FiEdit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Lesson Content */}
                    <div className="p-4">
                      <div className="mb-4">
                        <p className="text-sm text-gray-300 mb-2">{lesson.description}</p>
                      </div>
                      
                      {/* Technical Information */}
                      <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                        <h4 className="text-xs font-medium text-gray-300 mb-2">Informações Técnicas</h4>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center gap-2">
                            <FiLink className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-400">URL do Vídeo</p>
                              <p className="text-xs text-white break-all">{lesson.videoUrl || 'Não definido'}</p>
                            </div>
                          </div>
                          {lesson.materialUrl && (
                            <div className="flex items-center gap-2">
                              <FiLink className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-400">URL do Material</p>
                                <p className="text-xs text-white break-all">{lesson.materialUrl}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      {lesson.progress !== undefined && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progresso</span>
                            <span>{lesson.progress}%</span>
                          </div>
                          <div className="relative h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-300"
                              style={{ width: `${lesson.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <div className="mt-4 flex justify-end">
                        <motion.button
                          onClick={() => onLessonClick(lesson)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-2"
                        >
                          <FiPlay className="w-4 h-4" />
                          <span>Visualizar Aula</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}