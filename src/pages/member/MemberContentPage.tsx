// React core
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components

// Animations
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { FiPlay, FiInfo, FiArrowLeft, FiClock, FiBook, FiUser, FiStar } from 'react-icons/fi';

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

// Mock course details
const courseDetails = {
  duration: '12 horas',
  modules: 8,
  instructor: 'John Doe',
  rating: 4.8,
  students: 1234,
  lastUpdate: '15/01/2024',
  certificate: true,
  level: 'Intermediário'
};

// Mock data
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

export function MemberContentPage() {
  useParams();
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  const { productId } = useParams();

  const handleModuleClick = (moduleId: number) => {
    navigate(`/member/products/${productId}/modules/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-900 to-transparent py-4 px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </motion.button>
            <img src="/src/assets/logo.svg" alt="Logo" className="h-8" />
            
          </div>
          <div className="flex items-center space-x-4">
            <button className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors">
              <img src="https://ui-avatars.com/api/?name=User" alt="Profile" className="w-full h-full rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative pt-16">
        <div className="w-full h-[70vh] relative">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1500&auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
            alt="Featured Content"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 lg:w-1/2">
            <h1 className="text-4xl font-bold mb-4">Marketing Digital Masterclass</h1>
            <p className="text-lg text-gray-300 mb-6">Domine as estratégias mais eficientes de marketing digital e transforme seu negócio com este curso completo.</p>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-200 transition-colors"
                onClick={() => handleModuleClick(mockModules[0].id)}
              >
                <FiPlay className="w-5 h-5" />
                <span>Começar</span>
              </motion.button>
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInfo(!showInfo)}
                  className="px-6 py-3 bg-gray-600/80 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-600 transition-colors"
                >
                  <FiInfo className="w-5 h-5" />
                  <span>Mais Informações</span>
                </motion.button>

                <AnimatePresence>
                  {showInfo && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setShowInfo(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 top-full mt-2 w-80 bg-gray-800 rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        <div className="p-6 space-y-4">
                          <div className="flex items-center gap-3">
                            <FiClock className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-sm text-gray-400">Duração total</p>
                              <p className="font-medium">{courseDetails.duration}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <FiBook className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-sm text-gray-400">Módulos</p>
                              <p className="font-medium">{courseDetails.modules} módulos</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <FiUser className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-sm text-gray-400">Instrutor</p>
                              <p className="font-medium">{courseDetails.instructor}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <FiStar className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-sm text-gray-400">Avaliação</p>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{courseDetails.rating}</p>
                                <p className="text-sm text-gray-400">({courseDetails.students} alunos)</p>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-700">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Última atualização</span>
                              <span>{courseDetails.lastUpdate}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                              <span className="text-gray-400">Nível</span>
                              <span>{courseDetails.level}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                              <span className="text-gray-400">Certificado</span>
                              <span>{courseDetails.certificate ? 'Sim' : 'Não'}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="px-8 pb-16 mt-16 relative z-10">
        <h2 className="text-2xl font-medium mb-8">Módulos do Curso</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockModules.map((module) => (
            <motion.div
              key={module.id}
              whileHover={{ scale: 1.05 }}
              className="relative group cursor-pointer"
              onClick={() => handleModuleClick(module.id)}
            >
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={module.image}
                  alt={module.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {module.progress !== undefined && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-lg group-hover:text-green-500 transition-colors">{module.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{module.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-400">{module.lessons.length} aulas</span>
                  {module.progress !== undefined && (
                    <span className="text-sm text-gray-400">{module.progress}% completo</span>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-green-500 rounded-full text-white shadow-lg"
                >
                  <FiPlay className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}