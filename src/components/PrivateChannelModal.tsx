import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUsers, FiLink } from 'react-icons/fi';

interface PrivateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: 'telegram' | 'whatsapp' | 'youtube' | 'group';
  onSubmit?: (groupData: { name: string; description: string; type: string; inviteLink?: string }) => void;
  initialData?: {
    id: string;
    name: string;
    description: string;
    type: string;
    inviteLink?: string;
  };
  isEditing?: boolean;
}

export function PrivateChannelModal({ 
  isOpen, 
  onClose, 
  platform, 
  onSubmit,
  initialData,
  isEditing = false 
}: PrivateChannelModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      console.log('[DEBUG PrivateChannelModal] Recebendo dados iniciais:', initialData);
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setInviteLink(initialData.inviteLink || '');
    } else if (isOpen) {
      // Reset form when opening for new creation
      console.log('[DEBUG PrivateChannelModal] Abrindo modal para criação de novo grupo');
      setName('');
      setDescription('');
      setInviteLink('');
      setError('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (onSubmit) {
      const groupData = {
        name,
        description,
        type: platform === 'group' ? 'GROUP' : platform.toUpperCase(),
        inviteLink: inviteLink || undefined
      };
      
      console.log('[DEBUG PrivateChannelModal] Enviando dados do grupo:', groupData);
      onSubmit(groupData);
    }
    
    // Limpar o formulário apenas se não estiver editando
    if (!isEditing) {
      setName('');
      setDescription('');
      setInviteLink('');
      setError('');
    }
    
    onClose();
  };

  const platformInfo = {
    telegram: {
      title: 'Telegram',
      description: 'Conecte seu canal do Telegram para compartilhar conteúdo exclusivo com seus membros.'
    },
    whatsapp: {
      title: 'WhatsApp',
      description: 'Conecte seu grupo do WhatsApp para interagir diretamente com seus membros.'
    },
    youtube: {
      title: 'YouTube',
      description: 'Conecte seu canal do YouTube para compartilhar vídeos exclusivos com seus membros.'
    },
    group: {
      title: 'Grupo',
      description: 'Crie um grupo de discussão na plataforma para interação entre seus membros.'
    }
  };

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
              <div className="flex items-center gap-2">
                {platform === 'group' && <FiUsers className="w-5 h-5 text-green-400" />}
                <h2 className="text-xl font-medium text-white">
                  {isEditing 
                    ? `Editar ${platform === 'group' ? 'Grupo' : `Canal ${platformInfo[platform].title}`}`
                    : platform === 'group' 
                      ? 'Criar Novo Grupo' 
                      : `Conectar ${platformInfo[platform].title}`}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-gray-400 mb-6">{platformInfo[platform].description}</p>
              
              {error && (
                <div className="bg-red-900/30 text-red-400 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Nome do {platform === 'group' ? 'Grupo' : 'Canal'} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    placeholder={`Ex: ${platform === 'group' ? 'Grupo de Discussão Principal' : `Canal ${platformInfo[platform].title} Exclusivo`}`}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Descrição *
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    placeholder={`Descreva o propósito deste ${platform === 'group' ? 'grupo' : 'canal'}`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="inviteLink" className="block text-sm font-medium text-gray-300 mb-1">
                    Link de convite
                  </label>
                  <div className="flex items-center">
                    <div className="flex-1 relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <FiLink className="w-4 h-4" />
                      </span>
                      <input
                        type="url"
                        id="inviteLink"
                        value={inviteLink}
                        onChange={(e) => setInviteLink(e.target.value)}
                        className="w-full pl-10 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                        placeholder={`https://${platform}.com/...`}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Insira o link de convite completo para seu {platform === 'group' ? 'grupo' : 'canal'}
                  </p>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    {isEditing ? 'Salvar alterações' : platform === 'group' ? 'Criar Grupo' : 'Conectar Canal'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}