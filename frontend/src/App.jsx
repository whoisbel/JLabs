import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './store/useAuth';
import Login from './pages/Login';
import Home from './pages/Home';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


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
