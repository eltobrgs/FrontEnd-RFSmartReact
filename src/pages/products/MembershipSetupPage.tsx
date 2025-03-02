import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { useState } from 'react';
import { CreatePostModal } from '../../components/CreatePostModal';
import { CourseCreateSectionModal } from '../../components/CourseCreateSectionModal';
import { PrivateChannelModal } from '../../components/PrivateChannelModal';

export function MembershipSetupPage() {
  const [activeTab, setActiveTab] = useState('community');
  const [coursesTabText, setCoursesTabText] = useState('+Incluir área de cursos');
  const [channelTabText, setChannelTabText] = useState('+Incluir canal privado');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCreateSectionModalOpen, setIsCreateSectionModalOpen] = useState(false);
  const [isPrivateChannelModalOpen, setIsPrivateChannelModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'telegram' | 'whatsapp' | 'youtube'>('telegram');
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Header Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/products/create/membership"
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
        {/* Logo Upload Section */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-center w-full">
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
              <div className="flex flex-col gap-4">
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
            </div>

            {/* First Post Panel */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="text-center py-8 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Crie seu primeiro post</h3>
                <p className="text-gray-400 mb-6">
                  Comece a criar conteúdo para sua comunidade
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  onClick={() => setIsCreatePostModalOpen(true)}
                >
                  Criar post
                </motion.button>
                <CreatePostModal
                  isOpen={isCreatePostModalOpen}
                  onClose={() => setIsCreatePostModalOpen(false)}
                />
              </div>
            </div>
          </div>
        ) : activeTab === 'courses' ? (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Criar Modulo</h3>
              <p className="text-gray-400 mb-6">
                Organize seus cursos em Modulos
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreateSectionModalOpen(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Criar Modulo              </motion.button>
              <CourseCreateSectionModal
                isOpen={isCreateSectionModalOpen}
                onClose={() => setIsCreateSectionModalOpen(false)}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Telegram Integration */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.331.016.122.033.391.019.591z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Canal privado ou grupo privado</h3>
                  <p className="text-gray-400">Telegram</p>
                </div>
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
                Conectar
              </motion.button>
            </div>

            {/* WhatsApp Integration */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Canal privado ou grupo privado</h3>
                  <p className="text-gray-400">WhatsApp</p>
                </div>
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
                Conectar
              </motion.button>
            </div>

            {/* YouTube Integration */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Canal privado</h3>
                  <p className="text-gray-400">YouTube</p>
                </div>
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
                Conectar
              </motion.button>
            </div>
          </div>
        )}
        
        {/* Private Channel Modal */}
        <PrivateChannelModal
          isOpen={isPrivateChannelModalOpen}
          onClose={() => setIsPrivateChannelModalOpen(false)}
          platform={selectedPlatform}
        />
      </div>
    </div>
  );
}