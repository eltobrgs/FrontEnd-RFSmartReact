import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileMenuOpen(window.innerWidth >= 1024);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: '🎯', label: 'Dashboard', path: '/dashboard' },
    { icon: '📦', label: 'Produtos', path: '/products' },
    { icon: '💰', label: 'Vendas', path: '/sales' },
    { icon: '🔄', label: 'Assinaturas', path: '/subscriptions' },
    { icon: '👥', label: 'Membros', path: '/members' },
    { icon: '📊', label: 'Relatórios', path: '/reports' },
    { icon: '💳', label: 'Financeiro', path: '/financial' },
    { icon: '🎟️', label: 'Cupons', path: '/coupons' },
    { icon: '🤝', label: 'Afiliados', path: '/affiliates' },
    { icon: '👥', label: 'Coprodutores', path: '/coproducers' },
    { icon: '👥', label: 'Colaboradores', path: '/collaborators' },
  ];

  return (
    <>
      {/* Botão de abrir o menu móvel */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-lg bg-white shadow-md"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <AnimatePresence mode="wait">
        {(isMobileMenuOpen || window.innerWidth >= 1024) && (
          <>
            {/* Overlay para mobile */}
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black lg:hidden z-30"
              />
            )}

            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className={`fixed lg:static w-72 h-screen bg-white shadow-lg z-40 flex flex-col`}
            >
              {/* Logo section */}
              <div className="p-6 border-b">
                <img
                  src="/src/assets/logo.svg"
                  alt="LastLink"
                  className="h-8"
                />
              </div>

              {/* User section */}
              <div className="p-6 border-b">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    B
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">borges</h3>
                    <span className="text-sm text-gray-500">Starter</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Bottom section */}
              <div className="p-4 border-t">
                <Link
                  to="/help"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl">❓</span>
                  <span className="font-medium">Ajuda</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}