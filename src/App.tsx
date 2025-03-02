import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthPage } from './pages/auth/AuthPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProductsPage } from './pages/products/ProductsPage';
import { CreateProductPage } from './pages/products/CreateProductPage';
import { SelectProductTypePage } from './pages/products/SelectProductTypePage';
import { SelectMembershipTypePage } from './pages/products/SelectMembershipTypePage';
import { MembershipSetupPage } from './pages/products/MembershipSetupPage';
import { MemberProductsPage } from './pages/member/MemberProductsPage';
import { BuyProductsPage } from './pages/member/BuyProductsPage';
import { MemberContentPage } from './pages/member/MemberContentPage';
import { ModuleLessonsPage } from './pages/member/ModuleLessonsPage';


function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/create" element={<CreateProductPage />} />
          <Route path="/products/create/type" element={<SelectProductTypePage />} />
          <Route path="/products/create/membership" element={<SelectMembershipTypePage />} />
          <Route path="/products/create/membership/setup" element={<MembershipSetupPage />} />
          <Route path="/member/products" element={<MemberProductsPage />} />
          <Route path="/member/buy-products" element={<BuyProductsPage />} />
          <Route path="/member/products/:productId/content" element={<MemberContentPage />} />
          <Route path="/member/products/:productId/modules/:moduleId" element={<ModuleLessonsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

