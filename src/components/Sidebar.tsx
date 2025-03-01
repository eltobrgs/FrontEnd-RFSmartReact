import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine role based on URL path
  const isMemberRoute = location.pathname.startsWith('/member');
  const [selectedRole, setSelectedRole] = useState(isMemberRoute ? 'member' : 'producer');

  // Update role when route changes
  useEffect(() => {
    const newRole = location.pathname.startsWith('/member') ? 'member' : 'producer';
    setSelectedRole(newRole);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileMenuOpen(window.innerWidth >= 1024);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    // Navigate to the appropriate section based on role
    if (role === 'member') {
      navigate('/member/products');
    } else {
      navigate('/dashboard');
    }
  };

  const producerMenuItems = [
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

  const memberMenuItems = [
    { icon: '📦', label: 'Meus Produtos', path: '/member/products' },
    { icon: '🛍️', label: 'Comprar Produtos', path: '/member/buy-products' },
    { icon: '👤', label: 'Minha conta', path: '/member/account' },
  ];

  const menuItems = selectedRole === 'producer' ? producerMenuItems : memberMenuItems;

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
                  alt="Logo"
                  className="h-8"
                />
              </div>

              {/* Role selector */}
              <div className="p-4 border-b">
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="producer">Produtor</option>
                  <option value="member">Membro</option>
                </select>
              </div>

              {/* Menu items */}
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-4 px-8 py-4 text-base font-medium transition-colors ${location.pathname === item.path
                          ? 'text-green-500 bg-green-50'
                          : 'text-gray-600 hover:text-green-500 hover:bg-green-50'
                          }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}