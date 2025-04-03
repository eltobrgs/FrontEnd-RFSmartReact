import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiMessageCircle, FiUsers, FiPlus, FiX, FiCheck, FiInfo, FiEdit, FiTrash2, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { CreatePostModal } from '../../components/CreatePostModal';
import { CourseCreateSectionModal } from '../../components/CourseCreateSectionModal';
import { CourseCreateLessonModal } from '../../components/CourseCreateLessonModal';
import { PrivateChannelModal } from '../../components/PrivateChannelModal';
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
  image?: string;
  lessonsCount: number;
  lessons?: Lesson[];
  createdAt: string;
  isLoadingLessons?: boolean;
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
  inviteLink?: string;
  description?: string;
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
  inviteLink?: string;
  description?: string;
}

interface ApiUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: string;
  lastAccessed?: string;
}

// Adicionar interfaces para confirmações de exclusão
interface DeleteConfirmation {
  type: 'module' | 'lesson' | 'post' | 'channel';
  id: string;
  title: string;
  isOpen: boolean;
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
  const [isCreateLessonModalOpen, setIsCreateLessonModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isModuleDetailsModalOpen, setIsModuleDetailsModalOpen] = useState(false);

  // Estados para controle do módulo selecionado e modal
  const [mockModules, setMockModules] = useState<Module[]>([]);

  // Adicionar estados para confirmações de exclusão
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    type: 'module',
    id: '',
    title: '',
    isOpen: false
  });
  const [isEditModuleModalOpen, setIsEditModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Adicionar estado para controlar edição do nome do produto
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

  // Adicionar estado para controlar upload da logo
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Função para criar um grupo privado
  const handleCreatePrivateGroup = async (groupData: { name: string; description: string; type: string; inviteLink?: string }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !productId) return;
      
      console.log('[DEBUG handleCreatePrivateGroup] Criando grupo privado:', {
        ...groupData,
        productId,
        memberCount: 0,
        isLocked: false,
        inviteLink: groupData.inviteLink
      });
      
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
          isLocked: false,
          inviteLink: groupData.inviteLink
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('[DEBUG handleCreatePrivateGroup] Resposta de erro:', errorData);
        throw new Error(`Falha ao criar grupo privado: ${response.status}`);
      }
      
      const newGroup = await response.json();
      console.log('[DEBUG handleCreatePrivateGroup] Grupo privado criado com sucesso:', newGroup);
      
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
            createdAt: new Date(newGroup.createdAt).toLocaleDateString('pt-BR'),
            inviteLink: groupData.inviteLink,
            description: groupData.description
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
      console.error('[DEBUG handleCreatePrivateGroup] Erro ao criar grupo privado:', err);
      // Mostrar mensagem de erro
    }
  };

  // Função para editar um canal privado
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [isEditChannelModalOpen, setIsEditChannelModalOpen] = useState(false);

  const handleEditChannelClick = (channel: Channel) => {
    setEditingChannel(channel);
    setSelectedPlatform(channel.platform);
    setIsEditChannelModalOpen(true);
  };

  const handleUpdateChannel = async (groupData: { name: string; description: string; type: string; inviteLink?: string }) => {
    try {
      if (!editingChannel) return;

      const token = localStorage.getItem('token');
      if (!token || !productId) return;
      
      const response = await fetch(`${API_BASE_URL}/privateGroups/${editingChannel.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: groupData.name,
          description: groupData.description,
          type: groupData.type,
          inviteLink: groupData.inviteLink,
          isLocked: !editingChannel.isConnected
        })
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar canal privado');
      }
      
      const updatedChannel = await response.json();
      
      // Atualizar o canal na lista
      setMockChannels(prevChannels => 
        prevChannels.map(channel => 
          channel.id === editingChannel.id
            ? {
                ...channel,
                name: groupData.name,
                description: groupData.description,
                inviteLink: groupData.inviteLink,
                isConnected: !updatedChannel.isLocked
              }
            : channel
        )
      );
      
      // Fechar o modal
      setIsEditChannelModalOpen(false);
      setEditingChannel(null);
      
      alert('Canal atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar canal privado:', err);
      alert(err instanceof Error ? err.message : 'Erro ao atualizar canal privado');
    }
  };

  // Função para excluir um canal privado
  const handleDeleteChannelClick = (channelId: number) => {
    setDeleteConfirmation({
      type: 'channel',
      id: channelId.toString(),
      title: mockChannels.find(c => c.id === channelId)?.name || 'Canal',
      isOpen: true
    });
  };

  const handleDeleteChannel = async (channelId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/privateGroups/${channelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir canal privado');
      }
      
      // Remover o canal da lista
      setMockChannels(prevChannels => prevChannels.filter(channel => channel.id.toString() === channelId ? false : true));
      
      alert('Canal excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir canal privado:', err);
      alert(err instanceof Error ? err.message : 'Erro ao excluir canal privado');
    }
  };

  // Buscar dados do produto
  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
    
    // Adiciona um evento para quando a página receber foco novamente
    const handleFocus = () => {
      if (productId) {
        console.log('[DEBUG] Página recebeu foco, atualizando dados');
        fetchGroups(); // Busca os grupos novamente quando a página recebe foco
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [productId]);

  // Função para buscar os dados do produto
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token || !productId) return;

        console.log('[DEBUG fetchProductData] Buscando dados do produto:', productId);
        
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
          
          // Formatar os módulos para o formato esperado
        const formattedModules = modulesData.map((module: {
          id: string;
          title: string;
          description: string;
          icon: string;
          image?: string;
          lessonsCount: number;
          createdAt: string;
          lessons?: any[];
        }) => ({
          id: module.id.toString(),
            title: module.title,
            description: module.description,
            icon: 'default',
            image: module.image || '',
            lessonsCount: module.lessons?.length || 0,
            createdAt: new Date(module.createdAt).toLocaleDateString('pt-BR'),
          lessons: module.lessons || [],
          isLoadingLessons: false
          }));
          
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
        
      // Buscar grupos e canais - sempre atualiza, mesmo se o resto já tiver sido carregado
      await fetchGroups();
      
      // Buscar usuários
      await fetchUsers();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes do produto');
      console.error('Erro ao buscar detalhes do produto:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar usuários do produto
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !productId) return;
        
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
      console.error('Erro ao buscar usuários do produto:', err);
    }
  };
  
  // Função para buscar grupos e canais do produto
  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !productId) {
        console.error('[DEBUG fetchGroups] Token ou productId não encontrado');
        return;
      }
      
      console.log(`[DEBUG fetchGroups] Buscando grupos para o produto: ${productId}`);
      
      // Buscar grupos privados do produto
      const groupsResponse = await fetch(`${API_BASE_URL}/privateGroups/product/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`[DEBUG fetchGroups] Status da resposta: ${groupsResponse.status}`);
      
      if (groupsResponse.ok) {
        const groupsData = await groupsResponse.json();
        console.log(`[DEBUG fetchGroups] Grupos recebidos da API:`, groupsData);
        
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
        
        console.log(`[DEBUG fetchGroups] Grupos formatados:`, formattedGroups);
        setMockGroups(formattedGroups);
        
        // Formatando os canais vindos da API
        const formattedChannels = groupsData
          .filter((group: ApiGroup) => group.type === 'TELEGRAM' || group.type === 'WHATSAPP' || group.type === 'YOUTUBE')
          .map((group: ApiGroup & { inviteLink?: string; description?: string }) => ({
            id: group.id.toString(),
            name: group.name,
            platform: group.type.toLowerCase() as 'telegram' | 'whatsapp' | 'youtube',
            membersCount: group.memberCount,
            status: group.isLocked ? 'Locked' : 'Open',
            isConnected: !group.isLocked,
            createdAt: new Date(group.createdAt).toLocaleDateString('pt-BR'),
            inviteLink: group.inviteLink,
            description: group.description
          }));
        
        console.log(`[DEBUG fetchGroups] Canais formatados:`, formattedChannels);
        setMockChannels(formattedChannels);
      } else {
        const errorText = await groupsResponse.text().catch(() => 'Não foi possível ler o erro');
        console.error(`[DEBUG fetchGroups] Erro na resposta: ${errorText}`);
      }
    } catch (err) {
      console.error('[DEBUG fetchGroups] Erro ao buscar grupos e canais:', err);
    }
  };

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
  const handleCreateModule = async () => {
    setEditingModule(null);
    setSelectedModule(null);
    setIsCreateSectionModalOpen(true);
  };

  const handleEditModuleClick = (module: Module) => {
    setEditingModule(module);
    setIsEditModuleModalOpen(true);
  };
  
  // Função para lidar com o sucesso na criação/edição de módulo
  const handleModuleSuccess = async () => {
    await fetchProductData();
  };

  // Função para adicionar uma aula a um módulo específico
  const handleAddLessonClick = (moduleId: string) => {
    const module = mockModules.find(m => m.id === moduleId);
    if (module) {
      setSelectedModule(module);
      setEditingLesson(null);
      setIsCreateLessonModalOpen(true);
    }
  };

  // Função para editar uma aula
  const handleEditLessonClick = (lesson: Lesson, moduleId: string) => {
    const module = mockModules.find(m => m.id === moduleId);
    if (module) {
      setSelectedModule(module);
      setEditingLesson(lesson);
      setIsCreateLessonModalOpen(true);
    }
  };

  // Função para lidar com o sucesso na criação/edição de aula
  const handleLessonSuccess = async () => {
    if (selectedModule) {
      await fetchModuleLessons(selectedModule.id);
    }
    await fetchProductData();
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
      setIsCreateLessonModalOpen(false); // Garante que o modal de adicionar aula esteja fechado
      
      // Atualiza o estado para mostrar que este módulo está carregando aulas
      setMockModules(prevModules => 
        prevModules.map(module => 
          module.id === moduleId
            ? { ...module, isLoadingLessons: true }
            : module
        )
      );
      
      fetchModuleLessons(moduleId);
      setIsModuleDetailsModalOpen(true); // Abre o modal de detalhes
    }
  };

  // Função para fechar o modal de informações
  const handleCloseModuleInfo = () => {
    setSelectedModule(null);
    setIsModuleDetailsModalOpen(false);
  };

  // Função para fechar o modal de adicionar aula
  const handleCloseAddLesson = () => {
    setIsCreateLessonModalOpen(false);
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
      
      // Indica que está carregando aulas deste módulo
      setMockModules(prevModules => 
        prevModules.map(module => 
          module.id === moduleId
            ? { ...module, isLoadingLessons: true }
            : module
        )
      );
      
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
                lessonsCount: moduleData.lessons?.length || 0,
                isLoadingLessons: false
              }
            : module
        )
      );
      
      // Se este é o módulo selecionado, atualizá-lo também
      if (selectedModule?.id === moduleId) {
        setSelectedModule({
          ...selectedModule,
          lessons: moduleData.lessons || [],
          lessonsCount: moduleData.lessons?.length || 0,
          isLoadingLessons: false
        });
      }
      
      // Finaliza o carregamento deste módulo
      setMockModules(prevModules => 
        prevModules.map(module => 
          module.id === moduleId
            ? { ...module, isLoadingLessons: false }
            : module
        )
      );
      
      return moduleData;
    } catch (err) {
      console.error('Erro ao buscar aulas do módulo:', err);
      
      // Atualiza o estado para mostrar que o carregamento falhou
      setMockModules(prevModules => 
        prevModules.map(module => 
          module.id === moduleId
            ? { ...module, isLoadingLessons: false }
            : module
        )
      );
      
      return null;
    }
  };

  useEffect(() => {
    // Carregar automaticamente as aulas de todos os módulos ao montar o componente
    const loadAllModuleLessons = async () => {
      if (mockModules.length === 0) return;
      
      // Marca todos módulos como carregando
      setMockModules(prevModules => 
        prevModules.map(module => {
          return { ...module, isLoadingLessons: true };
        })
      );
      
      // Busca as aulas para cada módulo
      for (const module of mockModules) {
        await fetchModuleLessons(module.id);
      }
    };
    
    loadAllModuleLessons();
  }, [mockModules.length]);

  // Função para excluir um módulo
  const handleDeleteModule = async (moduleId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }
      
      const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir módulo');
      }
      
      // Atualizar a lista de módulos
      setMockModules(prevModules => prevModules.filter(module => module.id !== moduleId));
      
      // Fechar o modal de confirmação
      setDeleteConfirmation({
        type: 'module',
        id: '',
        title: '',
        isOpen: false
      });
      
      alert('Módulo excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir módulo:', err);
      alert(err instanceof Error ? err.message : 'Erro ao excluir módulo');
    }
  };
  
  // Função para excluir uma aula
  const handleDeleteLesson = async (lessonId: string, moduleId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }
      
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir aula');
      }
      
      // Atualizar o módulo na lista
      setMockModules(prevModules => 
        prevModules.map(module => 
          module.id === moduleId
            ? {
                ...module,
                lessonsCount: Math.max(0, (module.lessonsCount || 0) - 1),
                lessons: module.lessons?.filter(lesson => lesson.id !== lessonId) || []
              }
            : module
        )
      );
      
      // Se este é o módulo selecionado, atualizá-lo também
      if (selectedModule?.id === moduleId) {
        setSelectedModule({
          ...selectedModule,
          lessonsCount: Math.max(0, (selectedModule.lessonsCount || 0) - 1),
          lessons: selectedModule.lessons?.filter(lesson => lesson.id !== lessonId) || []
        });
      }
      
      // Fechar o modal de confirmação
      setDeleteConfirmation({
        type: 'lesson',
        id: '',
        title: '',
        isOpen: false
      });
      
      alert('Aula excluída com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir aula:', err);
      alert(err instanceof Error ? err.message : 'Erro ao excluir aula');
    }
  };
  
  // Função para excluir um post
  const handleDeletePost = async (postId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }
      
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir post');
      }
      
      // Atualizar a lista de posts
      setMockPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      
      // Fechar o modal de confirmação
      setDeleteConfirmation({
        type: 'post',
        id: '',
        title: '',
        isOpen: false
      });
      
      alert('Post excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir post:', err);
      alert(err instanceof Error ? err.message : 'Erro ao excluir post');
    }
  };
  
  // Função para editar um módulo
  const handleEditModule = async (moduleData: { title: string; description: string; icon: string; image: string }) => {
    if (!editingModule) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }
      
      const response = await fetch(`${API_BASE_URL}/modules/${editingModule.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(moduleData)
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar módulo');
      }
      
      const updatedModule = await response.json();
      
      // Atualizar o módulo na lista
      setMockModules(prevModules => 
        prevModules.map(module => 
          module.id === editingModule.id
            ? {
                ...module,
                title: updatedModule.title,
                description: updatedModule.description,
                icon: moduleData.icon,
                image: moduleData.image
              }
            : module
        )
      );
      
      // Fechar o modal
      setIsEditModuleModalOpen(false);
      setEditingModule(null);
      
      alert('Módulo atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar módulo:', err);
      alert(err instanceof Error ? err.message : 'Erro ao atualizar módulo');
    }
  };
  
  // Função para editar um post
  const handleEditPost = async (postData: { title: string; description: string; space: string; tags: string[] }) => {
    if (!editingPost) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }
      
      const response = await fetch(`${API_BASE_URL}/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar post');
      }
      
      const updatedPost = await response.json();
      
      // Atualizar o post na lista
      setMockPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === editingPost.id
            ? {
                ...post,
                title: updatedPost.title,
                description: updatedPost.description,
                space: updatedPost.space || 'Geral'
              }
            : post
        )
      );
      
      // Fechar o modal
      setIsEditPostModalOpen(false);
      setEditingPost(null);
      
      alert('Post atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar post:', err);
      alert(err instanceof Error ? err.message : 'Erro ao atualizar post');
    }
  };

  // Função para atualizar o nome do produto
  const handleUpdateProductName = async () => {
    if (!product || !editedName || editedName === product.name) {
      setIsEditingName(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }
      
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editedName })
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar nome do produto');
      }
      
      // Atualizar o produto no estado local
      setProduct(prev => prev ? { ...prev, name: editedName } : null);
      setIsEditingName(false);
      
      alert('Nome do produto atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar nome do produto:', err);
      alert(err instanceof Error ? err.message : 'Erro ao atualizar nome do produto');
    }
  };
  
  // Inicializar o estado de edição do nome quando o produto é carregado
  useEffect(() => {
    if (product) {
      setEditedName(product.name);
    }
  }, [product]);

  // Função para fazer upload da nova logo do produto
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validação básica do arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }
    
    setLogoFile(file);
    
    try {
      const token = localStorage.getItem('token');
      if (!token || !productId) return;
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar a imagem do produto');
      }
      
      const updatedProduct = await response.json();
      
      // Atualizar o produto no estado local - corrigindo o erro de tipo
      setProduct(prev => {
        if (!prev) return null;
        return {
          ...prev,
          image: updatedProduct.image
        };
      });
      
      alert('Imagem do produto atualizada com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar imagem:', err);
      alert(err instanceof Error ? err.message : 'Erro ao atualizar imagem');
    } finally {
      setLogoFile(null);
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
              <label className="block">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-green-500 transition-colors cursor-pointer relative">
                  {product?.image ? (
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="max-w-full max-h-36 mb-3 rounded-lg"
                      />
                      <p className="text-gray-400 text-sm mb-2">Alterar imagem do produto</p>
                    </div>
                  ) : (
                    <p className="text-gray-400 mb-2">Adicionar imagem do produto</p>
                  )}
                  <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm inline-block"
                  >
                    {logoFile ? 'Enviando...' : 'Selecionar imagem'}
                  </motion.div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={handleLogoUpload}
                  />
              </div>
              </label>
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
            <div className="flex items-center gap-4 w-full">
              {isEditingName ? (
                <>
              <input
                type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-transparent text-xl font-medium text-white border-b border-gray-600 focus:border-green-500 focus:outline-none transition-colors px-2 py-1 w-full"
                    autoFocus
                  />
                  <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                      onClick={handleUpdateProductName}
                      className="text-green-500 hover:text-green-400 transition-colors"
                    >
                      <FiCheck className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsEditingName(false);
                        if (product) setEditedName(product.name);
                      }}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <FiX className="w-5 h-5" />
              </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="bg-transparent text-xl font-medium text-white px-2 py-1 w-full">
                    {product?.name || ''}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditingName(true)}
                    className="text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <FiEdit className="w-5 h-5" />
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'community' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Group Management Panel */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white">Gerenciar grupos</h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fetchGroups()}
                  className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  title="Atualizar grupos"
                >
                  <FiRefreshCw className="w-4 h-4" />
                </motion.button>
              </div>
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
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-white mb-1">{post.title}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setIsEditPostModalOpen(true);
                          }}
                          className="p-1 text-gray-300 hover:text-blue-400"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmation({
                            type: 'post',
                            id: post.id.toString(),
                            title: post.title,
                            isOpen: true
                          })}
                          className="p-1 text-gray-300 hover:text-red-400"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
              
              {/* Modal de edição de post */}
              <CreatePostModal
                isOpen={isEditPostModalOpen}
                onClose={() => setIsEditPostModalOpen(false)}
                onSubmit={handleEditPost}
                initialValues={editingPost ? {
                  title: editingPost.title,
                  description: editingPost.description,
                  space: editingPost.space,
                  tags: []
                } : undefined}
                isEditing={true}
              />
            </div>
          </div>
        ) : activeTab === 'courses' ? (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Módulos do Curso</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCreateModule()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
              >
                <FiPlus className="h-4 w-4" />
                Adicionar Módulo
              </motion.button>
            </div>

            {mockModules.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-center">
                  <FiInfo className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum módulo criado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece criando seu primeiro módulo para o curso.
                </p>
                <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                    onClick={() => handleCreateModule()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                    Criar módulo
              </motion.button>
            </div>
              </div>
            ) : (
              // Lista de Módulos
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {mockModules.map((module) => (
                  <div key={module.id} className="bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden hover:border-green-500 transition-all duration-300">
                    {/* Imagem do Módulo */}
                    <div className="h-40 bg-gray-700 relative">
                      {module.image ? (
                        <img 
                          src={module.image} 
                          alt={module.title} 
                          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-700">
                          <FiInfo className="h-10 w-10 text-gray-500" />
                        </div>
                      )}
                      
                      {/* Menu de opções */}
                      <div className="absolute top-2 right-2 flex space-x-1">
                      <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditModuleClick(module)}
                          className="p-1.5 rounded-full bg-gray-800 text-gray-300 hover:text-green-400 hover:bg-gray-900 transition-all shadow-lg"
                        >
                          <FiEdit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteConfirmation({
                          type: 'module',
                          id: module.id,
                          title: module.title,
                          isOpen: true
                        })}
                          className="p-1.5 rounded-full bg-gray-800 text-gray-300 hover:text-red-400 hover:bg-gray-900 transition-all shadow-lg"
                      >
                          <FiTrash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-white text-lg">{module.title}</h3>
            </div>

                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{module.description}</p>
                      
                      <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                        <span className="bg-gray-700 px-3 py-1 rounded-full">
                          {module.isLoadingLessons ? (
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-green-400 animate-spin"></div>
                              <span>Carregando...</span>
                            </div>
                          ) : module.lessonsCount === 0 ? (
                            'Sem aulas'
                          ) : (
                            `${module.lessonsCount} aulas`
                          )}
                        </span>
                        <span>{module.createdAt}</span>
                      </div>
                      
                      {/* Botões para adicionar aula ou ver detalhes */}
                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                              onClick={() => handleAddLessonClick(module.id)}
                          className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <FiPlus className="h-4 w-4" /> Adicionar aula
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleModuleInfoClick(module.id)}
                          className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <FiInfo className="h-4 w-4" /> Ver detalhes do módulo
                        </motion.button>
                              </div>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Botão para adicionar novo canal/grupo */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 flex flex-col justify-center items-center">
              <h3 className="text-lg font-medium text-white mb-6">Adicionar canal privado</h3>
              <div className="space-y-4 w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedPlatform('telegram');
                    setIsPrivateChannelModalOpen(true);
                  }}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center justify-center"
                >
                  <FiPlus className="mr-2" /> Canal do Telegram
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedPlatform('whatsapp');
                    setIsPrivateChannelModalOpen(true);
                  }}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center justify-center"
                >
                  <FiPlus className="mr-2" /> Grupo de WhatsApp
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedPlatform('youtube');
                    setIsPrivateChannelModalOpen(true);
                  }}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center justify-center"
                >
                  <FiPlus className="mr-2" /> Canal do YouTube
                </motion.button>
              </div>
            </div>
            
            {/* Canais conectados */}
            {mockChannels.filter(channel => channel.platform === 'telegram').map((channel) => (
              <div key={channel.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.056-.056-.212s-.041-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.098.098.152.228.166.331.016.122.033.391.019.591z"/>
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
                <div className="flex flex-col space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    onClick={() => handleEditChannelClick(channel)}
                  >
                    Editar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteChannelClick(channel.id)}
                    className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Excluir
                </motion.button>
                </div>
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
                <div className="flex flex-col space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    onClick={() => handleEditChannelClick(channel)}
                  >
                    Editar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteChannelClick(channel.id)}
                    className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Excluir
                </motion.button>
                </div>
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
                <div className="flex flex-col space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    onClick={() => handleEditChannelClick(channel)}
                  >
                    Editar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteChannelClick(channel.id)}
                    className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Excluir
                </motion.button>
                </div>
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

        {/* Edit Channel Modal */}
        <PrivateChannelModal
          isOpen={isEditChannelModalOpen}
          onClose={() => setIsEditChannelModalOpen(false)}
          platform={editingChannel?.platform || 'telegram'}
          onSubmit={handleUpdateChannel}
          initialData={editingChannel ? {
            id: editingChannel.id.toString(),
            name: editingChannel.name,
            description: editingChannel.description || '',
            type: editingChannel.platform.toUpperCase(),
            inviteLink: editingChannel.inviteLink
          } : undefined}
          isEditing={true}
        />
          </>
        )}
      </div>

      {/* Modais */}
      <CourseCreateSectionModal
        isOpen={isCreateSectionModalOpen}
        onClose={() => setIsCreateSectionModalOpen(false)}
        onSuccess={handleModuleSuccess}
        productId={productId || ''}
      />
      
      <CourseCreateSectionModal
        isOpen={isEditModuleModalOpen}
        onClose={() => setIsEditModuleModalOpen(false)}
        onSuccess={handleModuleSuccess}
        productId={productId || ''}
        initialData={editingModule ? {
          id: editingModule.id,
          title: editingModule.title,
          description: editingModule.description,
          image: editingModule.image
        } : undefined}
        isEditing={true}
      />

      <CourseCreateLessonModal
        isOpen={isCreateLessonModalOpen}
        onClose={() => setIsCreateLessonModalOpen(false)}
        onSuccess={handleLessonSuccess}
        moduleId={selectedModule?.id || ''}
        initialData={editingLesson ? {
          id: editingLesson.id,
          title: editingLesson.title,
          description: editingLesson.description,
          videoUrl: editingLesson.videoUrl
        } : undefined}
        isEditing={!!editingLesson}
      />
      
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSubmit={handleCreatePost}
      />
      
      <PrivateChannelModal
        isOpen={isPrivateChannelModalOpen}
        onClose={() => setIsPrivateChannelModalOpen(false)}
        platform={selectedPlatform}
        onSubmit={handleCreatePrivateGroup}
      />
      
      {productId && (
        <ProductAccessModal
          isOpen={isAccessModalOpen}
          onClose={() => setIsAccessModalOpen(false)}
          productId={productId}
          productName={product?.name || 'Produto'}
        />
      )}

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

      {/* Modal de Confirmação de Exclusão */}
        {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center text-red-500 mb-4">
              <FiAlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Confirmar exclusão</h3>
                </div>
            
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja excluir {
                deleteConfirmation.type === 'module' ? 'o módulo' : 
                deleteConfirmation.type === 'lesson' ? 'a aula' : 'o post'
              } <span className="font-medium">"{deleteConfirmation.title}"</span>?
              <br />
                  Esta ação não pode ser desfeita.
                </p>
            
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirmation({...deleteConfirmation, isOpen: false})}
                className="px-4 py-2 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (deleteConfirmation.type === 'module') {
                        handleDeleteModule(deleteConfirmation.id);
                      } else if (deleteConfirmation.type === 'lesson') {
                        handleDeleteLesson(deleteConfirmation.id, selectedModule?.id || '');
                      } else if (deleteConfirmation.type === 'post') {
                    handleDeletePost(Number(deleteConfirmation.id));
                      } else if (deleteConfirmation.type === 'channel') {
                        handleDeleteChannel(deleteConfirmation.id);
                      }
                  setDeleteConfirmation({...deleteConfirmation, isOpen: false});
                    }}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
        </div>
        )}

      {/* Modal de detalhes do módulo */}
      <AnimatePresence>
        {isModuleDetailsModalOpen && selectedModule && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black cursor-pointer z-40"
              onClick={() => setIsModuleDetailsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-8 bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
            >
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiInfo className="w-5 h-5 text-gray-400" />
                  <h2 className="text-xl font-medium text-white">{selectedModule.title}</h2>
                </div>
                <button
                  onClick={() => setIsModuleDetailsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-2">Descrição</h3>
                  <p className="text-gray-300">{selectedModule.description}</p>
                </div>
                
                {selectedModule.image && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-2">Imagem do módulo</h3>
                    <div className="relative h-40 rounded-lg overflow-hidden">
                      <img 
                        src={selectedModule.image} 
                        alt={selectedModule.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Aulas</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsModuleDetailsModalOpen(false);
                      setIsCreateLessonModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-500 transition-colors"
                  >
                    <FiPlus className="h-4 w-4" />
                    Adicionar Aula
                  </motion.button>
                </div>

                {selectedModule?.isLoadingLessons ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400">Carregando aulas do módulo...</p>
                  </div>
                ) : (!selectedModule?.lessons || selectedModule.lessons.length === 0) ? (
                  <div className="bg-gray-700/30 rounded-lg p-8 text-center">
                    <div className="flex justify-center">
                      <FiInfo className="h-10 w-10 text-gray-500" />
                    </div>
                    <h3 className="mt-2 text-md font-medium text-white">Nenhuma aula disponível</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Clique no botão "Adicionar Aula" para começar.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedModule.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium text-white">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{lesson.title}</h4>
                              {lesson.description && (
                                <p className="text-sm text-gray-400 mt-1">{lesson.description}</p>
                              )}
                              {lesson.duration && (
                                <span className="text-xs text-gray-500 mt-2 block">
                                  Duração: {lesson.duration}
                                </span>
                              )}
                              {lesson.videoUrl && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                  Vídeo disponível
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditLessonClick(lesson, selectedModule.id)}
                              className="p-1.5 text-gray-400 hover:text-green-400"
                            >
                              <FiEdit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setDeleteConfirmation({
                                type: 'lesson',
                                id: lesson.id,
                                title: lesson.title,
                                isOpen: true
                              })}
                              className="p-1.5 text-gray-400 hover:text-red-400"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-700 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModuleDetailsModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Fechar
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}