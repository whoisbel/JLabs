import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './store/useAuth';
import Login from './pages/Login';
import Home from './pages/Home';

export default function App() {
  const token = useAuth((s) => s.token);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={token ? '/home' : '/login'} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={token ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
