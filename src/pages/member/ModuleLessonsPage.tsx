// React core
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Animations
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { FiArrowLeft, FiDownload, FiMenu, FiX } from 'react-icons/fi';

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration?: string;
  progress?: number;
  videoUrl?: string;
  materialUrl?: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  image: string;
  lessons: Lesson[];
  progress?: number;
}

// Mock data - In a real application, this would be fetched from an API
const mockModules: Module[] = [
  {
    id: 1,
    title: 'Introdução ao Marketing Digital',
    description: 'Fundamentos e conceitos básicos do marketing digital',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    progress: 60,
    lessons: [
      {
        id: 1,
        title: 'O que é Marketing Digital',
        description: 'Aprenda os fundamentos do marketing digital e como aplicá-los em seu negócio.',
        duration: '45 min',
        progress: 100,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        materialUrl: '#'
      },
      {
        id: 2,
        title: 'Estratégias de Marketing Digital',
        description: 'Conheça as principais estratégias utilizadas no marketing digital.',
        duration: '60 min',
        progress: 0,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        materialUrl: '#'
      }
    ]
  },
  {
    id: 2,
    title: 'SEO e Otimização',
    description: 'Técnicas avançadas de SEO e otimização para mecanismos de busca',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    progress: 30,
    lessons: [
      {
        id: 3,
        title: 'Fundamentos de SEO',
        description: 'Aprenda os conceitos básicos de SEO.',
        duration: '55 min',
        progress: 50,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        materialUrl: '#'
      },
      {
        id: 4,
        title: 'Otimização On-page',
        description: 'Técnicas de otimização dentro da página.',
        duration: '65 min',
        progress: 0,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        materialUrl: '#'
      }
    ]
  }
];

export function ModuleLessonsPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // In a real application, fetch the module data from an API
    const module = mockModules.find(m => m.id === Number(moduleId));
    if (module) {
      setCurrentModule(module);
      setSelectedLesson(module.lessons[0]);
    }
  }, [moduleId]);

  if (!currentModule || !selectedLesson) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row relative">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <motion.button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-gray-800 rounded-full shadow-lg text-white"
        >
          {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="w-full max-w-[320px] bg-gray-800 h-screen overflow-y-auto fixed md:sticky left-0 top-0 z-40 shadow-xl md:shadow-none"
          >
            <div className="p-6 pt-16 md:pt-6">
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Voltar</span>
              </motion.button>

              <h2 className="text-xl font-medium mb-2">{currentModule.title}</h2>
              <p className="text-sm text-gray-400 mb-6">{currentModule.description}</p>

              <div className="space-y-2">
                {currentModule.lessons.map((lesson) => (
                  <motion.button
                    key={lesson.id}
                    onClick={() => {
                      setSelectedLesson(lesson);
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      selectedLesson.id === lesson.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <h3 className="font-medium mb-1">{lesson.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-80">{lesson.duration}</span>
                      {lesson.progress !== undefined && (
                        <span className="opacity-80">{lesson.progress}% completo</span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 w-full md:ml-0 transition-all duration-300">
        <div className="p-4 md:p-8 pt-16 md:pt-8">
          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden mb-4 md:mb-8 shadow-lg">
            <iframe
              src={selectedLesson.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={selectedLesson.title}
            />
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-medium mb-2">{selectedLesson.title}</h1>
                <p className="text-gray-400 text-sm md:text-base">{selectedLesson.description}</p>
              </div>

              {selectedLesson.materialUrl && (
                <motion.a
                  href={selectedLesson.materialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md w-full sm:w-auto"
                >
                  <FiDownload className="w-5 h-5" />
                  <span>Material</span>
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}