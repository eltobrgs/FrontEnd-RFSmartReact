import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiSearch, FiUserPlus } from 'react-icons/fi';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: string;
}

interface ProductAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

export function ProductAccessModal({ isOpen, onClose, productId, productName }: ProductAccessModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [accessUsers, setAccessUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
  const [grantingAccess, setGrantingAccess] = useState<string | null>(null);

  // Buscar usuários sem acesso ao produto
  useEffect(() => {
    if (!isOpen || !productId) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Não autenticado. Faça login novamente.');
          return;
        }

        console.log('Buscando usuários sem acesso para o produto:', productId);
        
        // Buscar usuários sem acesso
        const response = await fetch(`http://localhost:3000/api/products/${productId}/non-users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Resposta da API (non-users):', response.status, errorData);
          throw new Error(`Falha ao carregar usuários: ${response.status} ${errorData.message || ''}`);
        }

        const data = await response.json();
        console.log('Usuários sem acesso encontrados:', data.length);
        setUsers(data);

        console.log('Buscando usuários com acesso para o produto:', productId);
        
        // Buscar usuários com acesso
        const accessResponse = await fetch(`http://localhost:3000/api/products/${productId}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!accessResponse.ok) {
          const errorData = await accessResponse.json().catch(() => ({}));
          console.error('Resposta da API (users):', accessResponse.status, errorData);
          throw new Error(`Falha ao carregar usuários com acesso: ${accessResponse.status} ${errorData.message || ''}`);
        }

        const accessData = await accessResponse.json();
        console.log('Usuários com acesso encontrados:', accessData.length);
        setAccessUsers(accessData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
        console.error('Erro ao buscar usuários:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, productId]);

  // Conceder acesso a um usuário
  const handleGrantAccess = async (userId: string) => {
    try {
      setGrantingAccess(userId);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Não autenticado. Faça login novamente.');
        return;
      }

      console.log('Concedendo acesso para o usuário:', userId, 'no produto:', productId);
      
      const response = await fetch(`http://localhost:3000/api/products/${productId}/access/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Resposta da API (grant access):', response.status, errorData);
        throw new Error(`Falha ao conceder acesso: ${response.status} ${errorData.message || ''}`);
      }

      console.log('Acesso concedido com sucesso');
      
      // Atualizar listas de usuários
      setUsers(users.filter(user => user.id !== userId));
      
      // Buscar usuários com acesso novamente
      const accessResponse = await fetch(`http://localhost:3000/api/products/${productId}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (accessResponse.ok) {
        const accessData = await accessResponse.json();
        console.log('Usuários com acesso atualizados:', accessData.length);
        setAccessUsers(accessData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conceder acesso');
      console.error('Erro ao conceder acesso:', err);
    } finally {
      setGrantingAccess(null);
    }
  };

  // Revogar acesso de um usuário
  const handleRevokeAccess = async (userId: string) => {
    try {
      setGrantingAccess(userId);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Não autenticado. Faça login novamente.');
        return;
      }

      console.log('Revogando acesso para o usuário:', userId, 'no produto:', productId);
      
      const response = await fetch(`http://localhost:3000/api/products/${productId}/access/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Resposta da API (revoke access):', response.status, errorData);
        throw new Error(`Falha ao revogar acesso: ${response.status} ${errorData.message || ''}`);
      }

      console.log('Acesso revogado com sucesso');
      
      // Atualizar listas de usuários
      setAccessUsers(accessUsers.filter(user => user.id !== userId));
      
      // Buscar usuários sem acesso novamente
      const usersResponse = await fetch(`http://localhost:3000/api/products/${productId}/non-users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('Usuários sem acesso atualizados:', usersData.length);
        setUsers(usersData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao revogar acesso');
      console.error('Erro ao revogar acesso:', err);
    } finally {
      setGrantingAccess(null);
    }
  };

  // Filtrar usuários com base no termo de pesquisa
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccessUsers = accessUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            className="fixed inset-8 bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-medium text-white">Gerenciar Acessos</h2>
                <p className="text-sm text-gray-400">Produto: {productName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setActiveTab('add')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'add' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FiUserPlus className="w-4 h-4" />
                    Adicionar Usuários
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'manage' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4" />
                    Gerenciar Acessos ({accessUsers.length})
                  </span>
                </button>
              </div>

              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome ou email..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="bg-red-900/30 text-red-400 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : activeTab === 'add' ? (
                <div className="space-y-4">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">
                        {searchTerm 
                          ? 'Nenhum usuário encontrado para esta busca' 
                          : 'Não há usuários disponíveis para adicionar'}
                      </p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h3 className="font-medium text-white">{user.name}</h3>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleGrantAccess(user.id)}
                          disabled={grantingAccess === user.id}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {grantingAccess === user.id ? (
                            <span>Concedendo...</span>
                          ) : (
                            <>
                              <FiCheck className="w-4 h-4" />
                              <span>Conceder Acesso</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAccessUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">
                        {searchTerm 
                          ? 'Nenhum usuário encontrado para esta busca' 
                          : 'Não há usuários com acesso a este produto'}
                      </p>
                    </div>
                  ) : (
                    filteredAccessUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h3 className="font-medium text-white">{user.name}</h3>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRevokeAccess(user.id)}
                          disabled={grantingAccess === user.id}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {grantingAccess === user.id ? (
                            <span>Revogando...</span>
                          ) : (
                            <>
                              <FiX className="w-4 h-4" />
                              <span>Revogar Acesso</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
