import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function AuthPage() {
  const [activeForm, setActiveForm] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add your login logic here
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Imagem e texto */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white flex-col relative overflow-hidden p-12"
      >
        <div className="space-y-6 z-10 relative">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl font-bold leading-tight"
          >
            A melhor <span className="text-green-400 inline-block hover:scale-105 transition-transform">plataforma</span><br />
            para você<br />
            vender seu<br />
            produto digital.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300"
          >
            A única que integra com
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-6"
          >
            {/* Ícones com hover effect */}
            {['discord', 'instagram', 'telegram', 'whatsapp'].map((icon) => (
              <motion.img
                key={icon}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                src={`https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/${icon}.svg`}
                alt={icon}
                className="h-8 w-8 cursor-pointer filter invert hover:text-green-400 transition-all"
              />
            ))}
          </motion.div>
        </div>
        {/* Background com efeito parallax */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/95">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop"
            alt="Background" 
            className="w-full h-full object-cover mix-blend-overlay opacity-40"
          />
        </div>
      </motion.div>

      {/* Lado direito - Formulários */}
      <div className="w-full lg:w-1/2 bg-white">
        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end gap-2 mb-8"
          >
            {/* Botões com efeito hover melhorado */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveForm('login')}
              className={`px-6 py-2 rounded-lg transition-all duration-200 margin-2 padding-5${
                activeForm === 'login'
                  ? 'bg-gray-100 text-gray-700 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Entrar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveForm('register')}
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                activeForm === 'register'
                  ? 'bg-gray-100 text-gray-700 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Cadastrar
            </motion.button>
          </motion.div>

          {/* Logo com animação */}
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="h-8 mb-12" 
          />

          {/* Formulários com animação de transição */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeForm}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeForm === 'login' ? (
                <div>
                  <h1 className="text-2xl text-gray-700 font-medium mb-8">Acesse sua conta</h1>
                  <div className="space-y-6">
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/google.svg" alt="Google" className="h-5 w-5" />
                      Fazer login com o Google
                    </motion.button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">ou</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="email"
                        placeholder="E-mail utilizado na compra"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-all"
                      />
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="password"
                        placeholder="Digite a senha"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-all"
                      />
                    </div>
                    <motion.button
                    onClick={handleLogin}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all font-medium"
                    >
                      Entrar
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href="#"
                      className="block text-center text-green-500 hover:text-green-600 transition-colors"
                    >
                      Criar ou recuperar senha
                    </motion.a>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl text-gray-700 font-medium mb-8">Crie sua conta</h1>
                  <div className="space-y-6">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/google.svg" alt="Google" className="h-5 w-5" />
                      Fazer login com o Google
                    </motion.button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">ou</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        placeholder="Nome completo"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-all"
                      />
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="email"
                        placeholder="E-mail"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-all"
                      />
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="password"
                        placeholder="Crie sua senha"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-all"
                      />
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="password"
                        placeholder="Confirme sua senha"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-all"
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <motion.input
                        whileHover={{ scale: 1.1 }}
                        type="checkbox"
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-600">
                        Li e aceito os{' '}
                        <motion.a whileHover={{ scale: 1.05 }} href="#" className="text-green-500 hover:text-green-600">
                          Termos de uso
                        </motion.a>
                        ,{' '}
                        <motion.a whileHover={{ scale: 1.05 }} href="#" className="text-green-500 hover:text-green-600">
                          Política de privacidade
                        </motion.a>{' '}
                        e os{' '}
                        <motion.a whileHover={{ scale: 1.05 }} href="#" className="text-green-500 hover:text-green-600">
                          Termos do Programa de afiliados
                        </motion.a>
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all font-medium"
                    >
                      Cadastrar
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}