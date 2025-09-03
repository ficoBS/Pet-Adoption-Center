import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/auth-context';
import Home from './pages/home/index';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import CompleteRegister from './pages/auth/complete-register';
import Pets from './pages/pets-list/index';
import PetDetails from './pages/pets-details/index';
import AddPet from './pages/add-pet';
import UserProfile from './pages/user-profile';
import AdminDashboard from './pages/admin-dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complete-register" element={<CompleteRegister />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/pets/:id" element={<PetDetails />} />
          <Route path="/pets/add-pet" element={<AddPet />} />
          <Route path="/profile/" element={<UserProfile />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;