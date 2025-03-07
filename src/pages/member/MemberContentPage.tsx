// React core
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Animations
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import {FiInfo, FiArrowLeft, FiClock, FiBook, FiUser, FiStar, FiMessageSquare, FiHeart, FiShare2, FiX } from 'react-icons/fi';
import { FaTelegram, FaWhatsapp, FaYoutube } from 'react-icons/fa';

// Importando a variável API_BASE_URL
import { API_BASE_URL } from '../../variables/api';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration?: string;
  progress?: number;
  videoUrl?: string;
  materialUrl?: string;
  completed?: boolean;
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
}

interface PrivateGroup {
  id: string;
  name: string;
  description: string;
  type: 'TELEGRAM' | 'WHATSAPP' | 'YOUTUBE';
  memberCount: number;
  isLocked: boolean;
  inviteLink?: string;
  previewImage?: string;
}

interface Post {
  id: string;
  title: string;
  description: string;
  space: string;
  tags: string[];
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO' | 'AUDIO';
  attachments?: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  _count?: {
    comments: number;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  accessType: 'COURSE' | 'COMMUNITY' | 'BOTH';
  modules?: Module[];
  privateGroups?: PrivateGroup[];
  posts?: Post[];
  createdBy?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export function MemberContentPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'modules' | 'community' | 'groups'>('modules');

  // Buscar dados do produto
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Falha ao carregar detalhes do produto');
        }
        
        const data = await response.json();
        
        // Verificar se o usuário tem acesso
        if (!data.hasAccess) {
          navigate('/member/products');
          return;
        }
        
        setProduct(data);
        
        // Definir a aba ativa com base no tipo de acesso
        if (data.accessType === 'COMMUNITY') {
          setActiveTab('community');
        } else if (data.modules && data.modules.length > 0) {
          setActiveTab('modules');
        } else if (data.privateGroups && data.privateGroups.length > 0) {
          setActiveTab('groups');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes do produto');
        console.error('Erro ao buscar detalhes do produto:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId, navigate]);

  const handleModuleClick = (moduleId: string) => {
    navigate(`/member/products/${productId}/modules/${moduleId}`);
  };

  const handleLikePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao curtir post');
      }
      
      // Atualizar o post na lista
      if (product && product.posts) {
        const updatedPosts = product.posts.map(post => 
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        );
        
        setProduct({
          ...product,
          posts: updatedPosts
        });
      }
      
      // Atualizar o post selecionado se estiver aberto
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...selectedPost,
          likes: selectedPost.likes + 1
        });
      }
    } catch (err) {
      console.error('Erro ao curtir post:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Erro ao carregar conteúdo</h2>
        <p className="text-gray-300 mb-6">{error || 'Produto não encontrado'}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/member/products')}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Voltar para Meus Produtos
        </motion.button>
      </div>
    );
  }

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
            src={product.image || `https://source.unsplash.com/random/1500x800/?${product.category.toLowerCase()}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 lg:w-1/2">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg text-gray-300 mb-6">{product.description}</p>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInfo(!showInfo)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FiInfo className="w-5 h-5" />
                <span>Informações</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gray-800 p-6 md:p-8"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Informações do Produto</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowInfo(false)}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {product.modules && product.modules.length > 0 && (
                  <>
                    <div className="flex items-center space-x-3">
                      <FiClock className="w-6 h-6 text-green-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Módulos</p>
                        <p className="font-medium">{product.modules.length}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <FiBook className="w-6 h-6 text-green-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Aulas</p>
                        <p className="font-medium">
                          {product.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)}
                        </p>
                      </div>
                    </div>
                  </>
                )}
                
                {product.createdBy && (
                  <div className="flex items-center space-x-3">
                    <FiUser className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Instrutor</p>
                      <p className="font-medium">{product.createdBy.name}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <FiStar className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Tipo de Acesso</p>
                    <p className="font-medium">
                      {product.accessType === 'BOTH' ? 'Curso + Comunidade' : 
                       product.accessType === 'COURSE' ? 'Curso' : 'Comunidade'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Tabs */}
      <div className="bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {product.accessType !== 'COMMUNITY' && product.modules && product.modules.length > 0 && (
              <button
                onClick={() => setActiveTab('modules')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeTab === 'modules' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                Módulos
              </button>
            )}
            
            {product.accessType !== 'COURSE' && product.posts && product.posts.length > 0 && (
              <button
                onClick={() => setActiveTab('community')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeTab === 'community' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                Comunidade
              </button>
            )}
            
            {product.accessType !== 'COURSE' && product.privateGroups && product.privateGroups.length > 0 && (
              <button
                onClick={() => setActiveTab('groups')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeTab === 'groups' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                Grupos Privados
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.modules && product.modules.map((module) => (
              <motion.div
                key={module.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModuleClick(module.id)}
                className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer group"
              >
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={module.image || `https://source.unsplash.com/random/800x450/?${product.category.toLowerCase()}`}
                    alt={module.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {module.progress !== undefined && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-medium mb-2 group-hover:text-green-400 transition-colors">{module.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{module.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{module.lessons?.length || 0} aulas</span>
                    {module.progress !== undefined && (
                      <span className="text-sm text-gray-500">
                        {module.completedLessons || 0}/{module.totalLessons || module.lessons?.length || 0} concluídas
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            {product.posts && product.posts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.01 }}
                className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}`}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium">{post.author.name}</h4>
                      <p className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-2">{post.title}</h3>
                  <p className="text-gray-300 mb-4">{post.description}</p>
                  
                  {post.mediaUrl && post.mediaType === 'IMAGE' && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={post.mediaUrl}
                        alt={post.title}
                        className="w-full h-auto max-h-96 object-cover"
                      />
                    </div>
                  )}
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex space-x-4 text-gray-400">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikePost(post.id);
                      }}
                      className="flex items-center space-x-1 hover:text-green-400 transition-colors"
                    >
                      <FiHeart className="w-5 h-5" />
                      <span>{post.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                      <FiMessageSquare className="w-5 h-5" />
                      <span>{post._count?.comments || 0}</span>
                    </button>
                    
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center space-x-1 hover:text-green-400 transition-colors"
                    >
                      <FiShare2 className="w-5 h-5" />
                      <span>Compartilhar</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.privateGroups && product.privateGroups.map((group) => (
              <motion.div
                key={group.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 rounded-xl overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9 relative">
                  {group.previewImage ? (
                    <img
                      src={group.previewImage}
                      alt={group.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                      {group.type === 'TELEGRAM' && <FaTelegram className="w-16 h-16 text-blue-400" />}
                      {group.type === 'WHATSAPP' && <FaWhatsapp className="w-16 h-16 text-green-400" />}
                      {group.type === 'YOUTUBE' && <FaYoutube className="w-16 h-16 text-red-500" />}
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-900 text-white">
                    {group.memberCount} membros
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-medium mb-2">{group.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{group.description}</p>
                  
                  {group.isLocked ? (
                    <div className="flex items-center justify-center p-2 bg-gray-700 rounded-lg text-gray-400">
                      <FiInfo className="w-5 h-5 mr-2" />
                      <span>Acesso bloqueado pelo administrador</span>
                    </div>
                  ) : (
                    <a
                      href={group.inviteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                    >
                      Acessar {group.type === 'TELEGRAM' ? 'Telegram' : group.type === 'WHATSAPP' ? 'WhatsApp' : 'YouTube'}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black cursor-pointer z-40"
              onClick={() => setSelectedPost(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-8 bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
            >
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-medium">{selectedPost.title}</h2>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <img
                    src={selectedPost.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPost.author.name)}`}
                    alt={selectedPost.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">{selectedPost.author.name}</h4>
                    <p className="text-sm text-gray-400">{new Date(selectedPost.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">{selectedPost.description}</p>
                
                {selectedPost.mediaUrl && selectedPost.mediaType === 'IMAGE' && (
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <img
                      src={selectedPost.mediaUrl}
                      alt={selectedPost.title}
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                )}
                
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-4 text-gray-400 mb-8">
                  <button
                    onClick={() => handleLikePost(selectedPost.id)}
                    className="flex items-center space-x-1 hover:text-green-400 transition-colors"
                  >
                    <FiHeart className="w-5 h-5" />
                    <span>{selectedPost.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                    <FiMessageSquare className="w-5 h-5" />
                    <span>{selectedPost._count?.comments || 0}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                    <FiShare2 className="w-5 h-5" />
                    <span>Compartilhar</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-medium mb-4">Comentários</h3>
                  
                  <div className="mb-6">
                    <textarea
                      placeholder="Escreva um comentário..."
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      rows={3}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Comentar
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-gray-400 text-center">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}