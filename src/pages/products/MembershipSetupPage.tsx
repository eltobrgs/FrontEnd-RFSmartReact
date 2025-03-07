import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiMessageCircle, FiUsers, FiPlus, FiX, FiCheck, FiInfo } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { CreatePostModal } from '../../components/CreatePostModal';
import { CourseCreateSectionModal } from '../../components/CourseCreateSectionModal';
import { PrivateChannelModal } from '../../components/PrivateChannelModal';
import { AddLessonModal } from '../../components/AddLessonModal';
import { ProductAccessModal } from '../../components/ProductAccessModal';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../variables/api';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  status: 'pending' | 'active' | 'inactive';
  lastAccess?: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@example.com',
    avatar: 'https://ui-avatars.com/api/?name=João+Silva',
    status: 'pending'
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Santos',
    status: 'active',
    lastAccess: '2024-01-20'
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Pedro+Oliveira',
    status: 'inactive',
    lastAccess: '2024-01-15'
  },
  {
    id: 4,
    name: 'Ana Costa',
    email: 'ana.costa@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Ana+Costa',
    status: 'pending'
  }
];

// Interfaces para os dados mockados
interface Post {
  id: number;
  title: string;
  description: string;
  date: string;
  comments: number;
  likes: number;
  space: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration?: string;
  videoUrl?: string;
  materialUrl?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessonsCount: number;
  createdAt: string;
  lessons?: Lesson[];
}

interface Group {
  id: number;
  name: string;
  type: 'group' | 'space';
  membersCount: number;
  createdAt: string;
}

interface Channel {
  id: number;
  name: string;
  platform: 'telegram' | 'whatsapp' | 'youtube';
  membersCount: number;
  isConnected: boolean;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image?: string;
  category: string;
  accessType: 'COURSE' | 'COMMUNITY' | 'BOTH';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
  modules?: Module[];
  posts?: Post[];
  privateGroups?: Channel[];
}

interface ApiPost {
  id: string;
  title: string;
  description: string;
  space: string;
  createdAt: string;
  likes: number;
  _count?: {
    comments: number;
  };
}

interface ApiGroup {
  id: string;
  name: string;
  type: string;
  memberCount: number;
  createdAt: string;
  isLocked: boolean;
}

interface ApiUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: string;
  lastAccessed?: string;
}

export function MembershipSetupPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState ('community');
  const [coursesTabText, setCoursesTabText] = useState('+Incluir área de cursos');
  const [channelTabText, setChannelTabText] = useState('+Incluir canal privado');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCreateSectionModalOpen, setIsCreateSectionModalOpen] = useState(false);
  const [isPrivateChannelModalOpen, setIsPrivateChannelModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'telegram' | 'whatsapp' | 'youtube'>('telegram');
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  // Estados para controle do módulo selecionado e modal
  const [mockModules, setMockModules] = useState<Module[]>([]);

  // Buscar dados do produto
  useEffect(() => {
    const fetchProductData = async () => {
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
        setProduct(data);
        
        // Buscar módulos do produto
        const modulesResponse = await fetch(`${API_BASE_URL}/modules/product/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (modulesResponse.ok) {
          const modulesData = await modulesResponse.json();
          console.log('Módulos carregados do backend:', modulesData);
          
          // Formatar os módulos para o formato esperado
          const formattedModules = modulesData.map((module: Module) => ({
            id: module.id.toString(), // Garantir que o ID seja string
            title: module.title,
            description: module.description,
            icon: 'default',
            lessonsCount: module.lessons?.length || 0,
            createdAt: new Date(module.createdAt).toLocaleDateString('pt-BR'),
            lessons: module.lessons || []
          }));
          
          console.log('Módulos formatados:', formattedModules);
          setMockModules(formattedModules);
        }
        
        // Buscar posts do produto
        const postsResponse = await fetch(`${API_BASE_URL}/posts/product/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          
          // Formatar os posts para o formato esperado
          const formattedPosts = postsData.map((post: ApiPost) => ({
            id: post.id,
            title: post.title,
            description: post.description,
            space: post.space,
            date: new Date(post.createdAt).toLocaleDateString('pt-BR'),
            comments: post._count?.comments || 0,
            likes: post.likes || 0
          }));
          
          setMockPosts(formattedPosts);
        }
        
        // Buscar grupos privados do produto
        const groupsResponse = await fetch(`${API_BASE_URL}/privateGroups/product/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (groupsResponse.ok) {
          const groupsData = await groupsResponse.json();
          
          // Formatar os grupos para o formato esperado
          const formattedGroups = groupsData
            .filter((group: ApiGroup) => group.type !== 'TELEGRAM' && group.type !== 'WHATSAPP' && group.type !== 'YOUTUBE')
            .map((group: ApiGroup) => ({
              id: group.id,
              name: group.name,
              type: 'group',
              membersCount: group.memberCount || 0,
              createdAt: new Date(group.createdAt).toLocaleDateString('pt-BR')
            }));
          
          setMockGroups(formattedGroups);
          
          // Formatar os canais para o formato esperado
          const formattedChannels = groupsData
            .filter((group: ApiGroup) => group.type === 'TELEGRAM' || group.type === 'WHATSAPP' || group.type === 'YOUTUBE')
            .map((group: ApiGroup) => ({
              id: group.id,
              name: group.name,
              platform: group.type.toLowerCase() as 'telegram' | 'whatsapp' | 'youtube',
              membersCount: group.memberCount || 0,
              isConnected: !group.isLocked,
              createdAt: new Date(group.createdAt).toLocaleDateString('pt-BR')
            }));
          
          setMockChannels(formattedChannels);
        }
        
        // Buscar usuários com acesso ao produto
        const usersResponse = await fetch(`${API_BASE_URL}/products/${productId}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          
          // Formatar os usuários para o formato esperado
          const formattedUsers = usersData.map((user: ApiUser) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            status: user.status.toLowerCase() as 'pending' | 'active' | 'inactive',
            lastAccess: user.lastAccessed ? new Date(user.lastAccessed).toLocaleDateString('pt-BR') : undefined
          }));
          
          // Atualizar o estado dos usuários
          setUsers(formattedUsers);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes do produto');
        console.error('Erro ao buscar detalhes do produto:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  // Função para conceder acesso a um usuário
  const handleGrantAccess = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !productId) return;
      
      const response = await fetch(`${API_BASE_URL}/products/${productId}/access/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao conceder acesso ao usuário');
      }
      
      // Atualizar a lista de usuários
    setUsers(users.map(user => 
      user.id === userId 
          ? { ...user, status: 'active', lastAccess: new Date().toLocaleDateString('pt-BR') }
        : user
    ));
    } catch (err) {
      console.error('Erro ao conceder acesso:', err);
      // Mostrar mensagem de erro
    }
  };
  
  // Função para criar um novo post
  const handleCreatePost = async (postData: { title: string; description: string; space: string; tags: string[] }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !productId) return;
      
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...postData,
          productId
        })
      });
      
      if (!response.ok) {
        throw new Error('Falha ao criar post');
      }
      
      const newPost = await response.json();
      
      // Adicionar o novo post à lista
      setMockPosts([
        {
          id: newPost.id,
          title: newPost.title,
          description: newPost.description,
          date: new Date(newPost.createdAt).toLocaleDateString('pt-BR'),
          comments: 0,
          likes: 0,
          space: newPost.space || 'Geral'
        },
        ...mockPosts
      ]);
      
      // Fechar o modal
      setIsCreatePostModalOpen(false);
    } catch (err) {
      console.error('Erro ao criar post:', err);
      // Mostrar mensagem de erro
    }
  };
  
  // Função para criar um novo módulo
  const handleCreateModule = async (moduleData: { title: string; description: string; icon: string }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !productId) return;
      
      const response = await fetch(`${API_BASE_URL}/modules`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...moduleData,
          productId
        })
      });
      
      if (!response.ok) {
        throw new Error('Falha ao criar módulo');
      }
      
      const newModule = await response.json();
      
      // Adicionar o novo módulo à lista
      setMockModules([
        ...mockModules,
        {
          id: newModule.id,
          title: newModule.title,
          description: newModule.description,
          icon: moduleData.icon,
          lessonsCount: 0,
          createdAt: new Date(newModule.createdAt).toLocaleDateString('pt-BR')
        }
      ]);
      
      // Fechar o modal
      setIsCreateSectionModalOpen(false);
    } catch (err) {
      console.error('Erro ao criar módulo:', err);
      // Mostrar mensagem de erro
    }
  };
  
  // Função para abrir o modal de adicionar aula
  const handleAddLessonClick = (moduleId: string) => {
    console.log('Abrindo modal para adicionar aula ao módulo:', moduleId);
    
    const foundModule = mockModules.find(m => m.id === moduleId);
    if (foundModule) {
      console.log('Módulo encontrado:', foundModule);
      setSelectedModule(foundModule);
      setIsAddLessonModalOpen(true);
    } else {
      console.error('Módulo não encontrado com ID:', moduleId);
      alert('Erro: Módulo não encontrado');
    }
  };

  // Função para adicionar uma aula a um módulo
  const handleAddLesson = async (lessonData: { title: string; description: string; videoUrl: string; materialUrl?: string }) => {
    try {
      if (!selectedModule) {
        throw new Error('Nenhum módulo selecionado');
      }
      
      console.log('Tentando adicionar aula ao módulo:', selectedModule);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }
      
      const moduleId = selectedModule.id;
      
      console.log('Dados da aula a serem enviados:', {
        moduleId,
        ...lessonData
      });
      
      const response = await fetch(`${API_BASE_URL}/lessons`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          moduleId,
          title: lessonData.title,
          description: lessonData.description,
          videoUrl: lessonData.videoUrl || '',
          materialUrl: lessonData.materialUrl || ''
        })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro da API:', errorData);
        throw new Error(`Falha ao adicionar aula: ${response.status}`);
      }
      
      const newLesson = await response.json();
      console.log('Nova aula criada:', newLesson);
      
      // Atualizar o módulo na lista
      setMockModules(prevModules => 
        prevModules.map(module => 
          module.id === moduleId
            ? {
                ...module,
                lessonsCount: (module.lessonsCount || 0) + 1,
                lessons: [...(module.lessons || []), newLesson]
              }
            : module
        )
      );
      
      // Fechar o modal
      handleCloseAddLesson();
      
      // Atualizar a lista de aulas do módulo
      await fetchModuleLessons(moduleId);
      
      // Mostrar mensagem de sucesso
      alert('Aula adicionada com sucesso!');
    } catch (err) {
      console.error('Erro ao adicionar aula:', err);
      alert(err instanceof Error ? err.message : 'Erro ao adicionar aula');
    }
  };
  
  // Função para criar um grupo privado
  const handleCreatePrivateGroup = async (groupData: { name: string; description: string; type: string }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !productId) return;
      
      const response = await fetch(`${API_BASE_URL}/privateGroups`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...groupData,
          productId,
          memberCount: 0,
          isLocked: false
        })
      });
      
      if (!response.ok) {
        throw new Error('Falha ao criar grupo privado');
      }
      
      const newGroup = await response.json();
      
      if (groupData.type === 'TELEGRAM' || groupData.type === 'WHATSAPP' || groupData.type === 'YOUTUBE') {
        // Adicionar o novo canal à lista
        setMockChannels([
          ...mockChannels,
          {
            id: newGroup.id,
            name: newGroup.name,
            platform: groupData.type.toLowerCase() as 'telegram' | 'whatsapp' | 'youtube',
            membersCount: 0,
      isConnected: true,
            createdAt: new Date(newGroup.createdAt).toLocaleDateString('pt-BR')
          }
        ]);
      } else {
        // Adicionar o novo grupo à lista
        setMockGroups([
          ...mockGroups,
          {
            id: newGroup.id,
            name: newGroup.name,
            type: 'group',
            membersCount: 0,
            createdAt: new Date(newGroup.createdAt).toLocaleDateString('pt-BR')
          }
        ]);
      }
      
      // Fechar o modal
      setIsPrivateChannelModalOpen(false);
    } catch (err) {
      console.error('Erro ao criar grupo privado:', err);
      // Mostrar mensagem de erro
    }
  };
  
  // Dados mockados para posts
  const [mockPosts, setMockPosts] = useState<Post[]>([]);

  // Dados mockados para grupos
  const [mockGroups, setMockGroups] = useState<Group[]>([]);
  
  // Dados mockados para canais privados
  const [mockChannels, setMockChannels] = useState<Channel[]>([]);

  // Função para abrir o modal de informações do módulo
  const handleModuleInfoClick = (moduleId: string) => {
    console.log('Abrindo modal de informações para o módulo:', moduleId);
    
    const foundModule = mockModules.find(m => m.id === moduleId);
    if (foundModule) {
      setSelectedModule(foundModule);
      setIsAddLessonModalOpen(false); // Garante que o modal de adicionar aula esteja fechado
      fetchModuleLessons(moduleId);
    }
  };

  // Função para fechar o modal de informações
  const handleCloseModuleInfo = () => {
    setSelectedModule(null);
  };

  // Função para fechar o modal de adicionar aula
  const handleCloseAddLesson = () => {
    setIsAddLessonModalOpen(false);
    setSelectedModule(null);
  };

  // Função para buscar as aulas de um módulo
  const fetchModuleLessons = async (moduleId: string) => {
    try {
      console.log('Buscando aulas do módulo:', moduleId);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }
      
      const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao carregar aulas do módulo');
      }
      
      const moduleData = await response.json();
      console.log('Dados do módulo atualizados:', moduleData);
      
      // Atualizar o módulo na lista
      setMockModules(prevModules => 
        prevModules.map(module => 
          module.id === moduleId
            ? {
                ...module,
                lessons: moduleData.lessons || [],
                lessonsCount: moduleData.lessons?.length || 0
              }
            : module
        )
      );
      
      // Se este é o módulo selecionado, atualizá-lo também
      if (selectedModule?.id === moduleId) {
        setSelectedModule({
          ...selectedModule,
          lessons: moduleData.lessons || [],
          lessonsCount: moduleData.lessons?.length || 0
        });
      }
      
      return moduleData;
    } catch (err) {
      console.error('Erro ao buscar aulas do módulo:', err);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Header Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-between w-full">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white group"
              >
                <motion.div
                  whileHover={{ x: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiArrowLeft className="w-5 h-5" />
                </motion.div>
                <span>Voltar</span>
              </Link>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAccessModalOpen(true)}
                  className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                  title="Gerenciar Acessos"
                >
                  <FiUsers className="w-5 h-5" />
                </motion.button>
                
                  
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-medium text-white">Área de membros</h1>
              <p className="text-gray-400 mt-1">Personalize sua área de membros e comece a vender</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 text-red-400 p-4 rounded-lg mb-6">
            {error}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products')}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Voltar para produtos
            </motion.button>
          </div>
        ) : (
          <>
        {/* Logo Upload Section */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8 border border-gray-700">
              <div className="flex flex-col items-center justify-center w-full">
                <h2 className="text-xl font-medium text-white mb-4">
                  {product?.name || 'Carregando produto...'}
                </h2>
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 hover:border-green-500 transition-colors cursor-pointer">
                <p className="text-gray-400 mb-2">sua logo aqui</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Fazer upload
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 mb-8 border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2 transition-colors ${activeTab === 'community' ? 'text-green-500 border-b-2 border-green-500 font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            Comunidade
          </button>
          <button 
            onClick={() => {
              setActiveTab('courses');
              setCoursesTabText('Área de cursos');
            }}
            className={`px-4 py-2 transition-colors ${activeTab === 'courses' ? 'text-green-500 border-b-2 border-green-500 font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            {coursesTabText}
          </button>
          <button 
            onClick={() => {
              setActiveTab('channel');
              setChannelTabText('Canal privado');
            }}
            className={`px-4 py-2 transition-colors ${activeTab === 'channel' ? 'text-green-500 border-b-2 border-green-500 font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            {channelTabText}
          </button>
        </div>

        {/* Product Name Section */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="text"
                defaultValue="Nome do produto"
                className="bg-transparent text-xl font-medium text-white border-b border-transparent hover:border-gray-600 focus:border-green-500 focus:outline-none transition-colors px-2 py-1"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Dynamic Content Section */}
        {activeTab === 'community' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Group Management Panel */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-6">Gerenciar grupos</h3>
              <div className="flex flex-col gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Novo grupo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Novo espaço
                </motion.button>
              </div>
              
              {/* Lista de grupos */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Grupos e espaços existentes</h4>
                {mockGroups.map((group) => (
                  <div key={group.id} className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                          <FiUsers className="w-5 h-5 text-gray-300" />
                        </div>
                        <div>
                          <h5 className="font-medium text-white">{group.name}</h5>
                          <p className="text-xs text-gray-400">{group.type === 'group' ? 'Grupo' : 'Espaço'} • {group.membersCount} membros</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">Criado em {group.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Posts Panel */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white">Posts da comunidade</h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  onClick={() => setIsCreatePostModalOpen(true)}
                >
                  Criar post
                </motion.button>
              </div>
              
              {/* Lista de posts */}
              <div className="space-y-4">
                {mockPosts.map((post) => (
                  <div key={post.id} className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <h4 className="font-medium text-white mb-1">{post.title}</h4>
                    <p className="text-sm text-gray-300 mb-3">{post.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" /> {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMessageCircle className="w-3 h-3" /> {post.comments} comentários
                        </span>
                      </div>
                      <span className="bg-gray-600 px-2 py-1 rounded-full">{post.space}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <CreatePostModal
                isOpen={isCreatePostModalOpen}
                onClose={() => setIsCreatePostModalOpen(false)}
                    onSubmit={handleCreatePost}
              />
            </div>
          </div>
        ) : activeTab === 'courses' ? (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-white">Módulos do curso</h3>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreateSectionModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                Criar Módulo
              </motion.button>
            </div>

            {/* Lista de módulos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockModules.map((module) => (
                <div key={module.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{module.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleModuleInfoClick(module.id)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <FiInfo className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAddLessonClick(module.id)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{module.description}</p>
                  <div className="mt-2 text-xs text-gray-600">
                    {module.lessonsCount} aulas • Criado em {new Date(module.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>

            {/* Modais */}
            <CourseCreateSectionModal
              isOpen={isCreateSectionModalOpen}
              onClose={() => setIsCreateSectionModalOpen(false)}
              onSubmit={handleCreateModule}
            />

            {/* Modal de Adicionar Aula */}
            <AddLessonModal
              isOpen={isAddLessonModalOpen}
              onClose={handleCloseAddLesson}
              moduleTitle={selectedModule?.title || ''}
              onSubmit={(lessonData) => {
                console.log('Dados da aula recebidos do modal:', lessonData);
                console.log('Módulo selecionado ao enviar:', selectedModule);
                handleAddLesson(lessonData);
              }}
            />
            
            {/* Modal de Informações do Módulo */}
            {selectedModule && !isAddLessonModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-gray-900">
                      Módulo: {selectedModule.title}
                    </h2>
                    <button
                      onClick={handleCloseModuleInfo}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-700 mb-4">{selectedModule.description}</p>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2 text-gray-900">Aulas</h3>
                    {selectedModule.lessons && selectedModule.lessons.length > 0 ? (
                      <div className="space-y-2">
                        {selectedModule.lessons.map((lesson) => (
                          <div key={lesson.id} className="p-2 bg-gray-50 rounded">
                            <div className="font-medium text-gray-900">{lesson.title}</div>
                            <div className="text-sm text-gray-700">{lesson.description}</div>
                            {lesson.videoUrl && (
                              <div className="text-xs text-gray-600 mt-1">
                                <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                  Link do vídeo
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-700">Nenhuma aula cadastrada neste módulo.</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handleCloseModuleInfo}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Canais conectados */}
            {mockChannels.filter(channel => channel.platform === 'telegram').map((channel) => (
              <div key={channel.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.056-.056-.212s-.041-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.098.152.228.166.331.016.122.033.391.019.591z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{channel.name}</h3>
                    <p className="text-gray-400">Telegram • {channel.membersCount} membros</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                  <span>Criado em {channel.createdAt}</span>
                  <span className={`px-2 py-1 rounded-full ${channel.isConnected ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {channel.isConnected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  onClick={() => {
                    setSelectedPlatform('telegram');
                    setIsPrivateChannelModalOpen(true);
                  }}
                >
                  {channel.isConnected ? 'Gerenciar' : 'Reconectar'}
                </motion.button>
              </div>
            ))}

            {/* WhatsApp Integration */}
            {mockChannels.filter(channel => channel.platform === 'whatsapp').map((channel) => (
              <div key={channel.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-.087-.116-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{channel.name}</h3>
                    <p className="text-gray-400">WhatsApp • {channel.membersCount} membros</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                  <span>Criado em {channel.createdAt}</span>
                  <span className={`px-2 py-1 rounded-full ${channel.isConnected ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {channel.isConnected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  onClick={() => {
                    setSelectedPlatform('whatsapp');
                    setIsPrivateChannelModalOpen(true);
                  }}
                >
                  {channel.isConnected ? 'Gerenciar' : 'Reconectar'}
                </motion.button>
              </div>
            ))}

            {/* YouTube Integration */}
            {mockChannels.filter(channel => channel.platform === 'youtube').map((channel) => (
              <div key={channel.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{channel.name}</h3>
                    <p className="text-gray-400">YouTube • {channel.membersCount} membros</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                  <span>Criado em {channel.createdAt}</span>
                  <span className={`px-2 py-1 rounded-full ${channel.isConnected ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {channel.isConnected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  onClick={() => {
                    setSelectedPlatform('youtube');
                    setIsPrivateChannelModalOpen(true);
                  }}
                >
                  {channel.isConnected ? 'Gerenciar' : 'Reconectar'}
                </motion.button>
              </div>
            ))}
          </div>
        )}
        
        {/* Private Channel Modal */}
        <PrivateChannelModal
          isOpen={isPrivateChannelModalOpen}
          onClose={() => setIsPrivateChannelModalOpen(false)}
          platform={selectedPlatform}
              onSubmit={handleCreatePrivateGroup}
        />
          </>
        )}
      </div>

      {/* Users Modal */}
      <AnimatePresence>
        {isUserModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black cursor-pointer z-40"
              onClick={() => setIsUserModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-8 bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
            >
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiUsers className="w-5 h-5 text-gray-400" />
                  <h2 className="text-xl font-medium text-white">Gerenciar Acessos</h2>
                </div>
                <button
                  onClick={() => setIsUserModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium text-white">{user.name}</h3>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          {user.status === 'active' ? (
                            <span className="text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
                              Ativo desde {user.lastAccess}
                            </span>
                          ) : user.status === 'inactive' ? (
                            <span className="text-red-400 bg-red-900/30 px-2 py-1 rounded-full">
                              Inativo desde {user.lastAccess}
                            </span>
                          ) : (
                            <span className="text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded-full">
                              Pendente
                            </span>
                          )}
                        </div>

                        {user.status !== 'active' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleGrantAccess(user.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 text-sm"
                          >
                            <FiCheck className="w-4 h-4" />
                            <span>Conceder Acesso</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Access Modal */}
      {productId && (
        <ProductAccessModal
          isOpen={isAccessModalOpen}
          onClose={() => setIsAccessModalOpen(false)}
          productId={productId}
          productName={product?.name || 'Produto'}
        />
      )}
    </div>
  );
}