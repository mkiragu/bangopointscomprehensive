import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import RoleSelector from './pages/RoleSelector';
import Shopper from './pages/Shopper';
import Admin from './pages/Admin';
import BrandManager from './pages/BrandManager';
import PPG from './pages/PPG';
import BEO from './pages/BEO';
import Executive from './pages/Executive';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelector />} />
          <Route element={<Layout />}>
            <Route path="/shopper" element={<Shopper />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/brand-manager" element={<BrandManager />} />
            <Route path="/ppg" element={<PPG />} />
            <Route path="/beo" element={<BEO />} />
            <Route path="/executive" element={<Executive />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
