// React core
import { useState } from 'react';

// Components
import { Sidebar } from '../../components/Sidebar';

// Animations
import { motion } from 'framer-motion';

// Icons
import { FiEye, FiInfo, FiMoreVertical } from 'react-icons/fi';
import { HiArrowRight } from 'react-icons/hi';

export function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('Últimos 7 dias');
  const [selectedWallet, setSelectedWallet] = useState('Todas as carteiras');

  const periods = [
    'Hoje',
    'Ontem',
    'Últimos 7 dias',
    'Últimos 30 dias',
    'Últimos 90 dias',
    'Todo período',
    'Personalizado'
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Wallet selector and balance section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <select
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              className="p-2 border rounded-lg w-64 bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option>Todas as carteiras</option>
            </select>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiEye className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available balance */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-white rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-600">Saldo disponível</h3>
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
              >
                <FiInfo className="w-4 h-4" />
              </motion.button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500">R$</span>
                <span className="text-3xl font-medium">0,00</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 text-green-500 hover:text-green-600 font-medium flex items-center gap-2 group"
              >
                Sacar
                <HiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </motion.div>

            {/* Future releases */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-white rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-600">Lançamentos futuros</h3>
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
              >
                <FiInfo className="w-4 h-4" />
              </motion.button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500">R$</span>
                <span className="text-3xl font-medium">0,00</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 text-green-500 hover:text-green-600 font-medium flex items-center gap-2 group"
              >
                Antecipar
                <HiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Sales section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-gray-800">Minhas vendas</h2>
            <div className="flex items-center gap-4">
              <select
                className="p-2 border rounded-lg"
                defaultValue="4"
              >
                <option value="4">Todos os produtos</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 p-1 transition-colors"
              >
                <FiMoreVertical className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Period selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedPeriod === period ? 'bg-green-50 text-green-700 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Commission stats */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-gray-400"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-600">Total em comissões: 0</h3>
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
              >
                <FiInfo className="w-4 h-4" />
              </motion.button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500">R$</span>
                <span className="text-2xl font-medium">0,00</span>
              </div>
            </motion.div>

            {/* New sales stats */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-green-400"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-600">Novas vendas: 0</h3>
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
              >
                <FiInfo className="w-4 h-4" />
              </motion.button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500">R$</span>
                <span className="text-2xl font-medium">0,00</span>
              </div>
            </motion.div>

            {/* Renewals stats */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-400"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-600">Renovações: 0</h3>
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
              >
                <FiInfo className="w-4 h-4" />
              </motion.button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500">R$</span>
                <span className="text-2xl font-medium">0,00</span>
              </div>
            </motion.div>
          </div>

          {/* Payment methods stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Card sales */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-teal-400"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-600">Vendas por cartão: 0</h3>
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
              >
                <FiInfo className="w-4 h-4" />
              </motion.button>
              </div>
              <span className="text-2xl font-medium">0%</span>
            </motion.div>

            {/* Pix sales */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-teal-400"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-600">Vendas por Pix: 0</h3>
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
              >
                <FiInfo className="w-4 h-4" />
              </motion.button>
              </div>
              <span className="text-2xl font-medium">0%</span>
            </motion.div>

            {/* Boleto sales */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-teal-400"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-600">Vendas por boleto: 0</h3>
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
              >
                <FiInfo className="w-4 h-4" />
              </motion.button>
              </div>
              <span className="text-2xl font-medium">0%</span>
            </motion.div>

            {/* Refunds */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-red-400"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-600">Reembolsos: 0</h3>
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
              >
                <FiInfo className="w-4 h-4" />
              </motion.button>
              </div>
              <span className="text-2xl font-medium">0%</span>
            </motion.div>

            {/* Chargebacks */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-red-400"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-600">Chargebacks: 0</h3>
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
              >
                <FiInfo className="w-4 h-4" />
              </motion.button>
              </div>
              <span className="text-2xl font-medium">0%</span>
            </motion.div>
          </div>

          {/* No sales message */}
          <div className="text-center text-gray-500 mt-8">
            Você não possui registros de vendas neste período.
          </div>
        </div>
      </main>
    </div>
  );
}