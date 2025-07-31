import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../store/useAuth';
import GeoMap from '../components/GeoMap';

export default function Home() {
  const token = useAuth((s) => s.token);
  const clearToken = useAuth((s) => s.clearToken);
  const navigate = useNavigate();

  const [ownGeo, setOwnGeo] = useState(null);
  const [inputIP, setInputIP] = useState('');
  const [geoResult, setGeoResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState([]);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) return navigate('/login');

    (async () => {
      try {
        const ip = (await axios.get('https://api.ipify.org?format=json')).data.ip;
        const geo = await axios.post('http://localhost:3000/api/geo', { ip }, { headers });
        setOwnGeo(geo.data);
        setGeoResult(geo.data);
        loadHistory();
      } catch (err) {
        console.error('Failed to load IP info', err);
      }
    })();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/geo/history', { headers });
      setHistory(res.data);
    } catch {
      alert('Failed to load history');
    }
  };

  const handleSearch = async () => {
    if (!inputIP || !/^(\d{1,3}\.){3}\d{1,3}$/.test(inputIP)) return alert('Invalid IP');
    try {
      const res = await axios.post('http://localhost:3000/api/geo/search', { ip: inputIP }, { headers });
      setGeoResult(res.data);
      loadHistory();
    } catch {
      alert('Failed to fetch geo data');
    }
  };

  const handleClearSearch = () => {
    setGeoResult(ownGeo);
    setInputIP('');
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;
    try {
        await axios.delete('http://localhost:3000/api/geo/history/multiple', {
        headers,
        data: { ids: selected },
        });
        await loadHistory();
        setSelected([]);
    } catch {
        alert('Failed to delete selected items');
    }
    };


  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  const handleHistoryClick = async (ip) => {
    try {
      const res = await axios.post('http://localhost:3000/api/geo/search', { ip }, { headers });
      setGeoResult(res.data);
    } catch {
      alert('Failed to fetch geo data');
    }
  };

  const renderTable = (data) => {
    const entries = Object.entries(data || {});
    if (entries.length === 0) return null;

    return (
      <table className="w-full table-auto border border-gray-300 text-sm bg-white rounded">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key} className="border-t">
              <td className="p-2 font-semibold capitalize w-1/3 bg-gray-50">{key}</td>
              <td className="p-2">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Geo Lookup</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Enter IP"
          value={inputIP}
          onChange={(e) => setInputIP(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >
          Search
        </button>
        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={handleClearSearch}
        >
          Clear
        </button>
      </div>

      {geoResult?.loc && <GeoMap loc={geoResult.loc} />}

      {geoResult && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-bold mb-2">Geo Info</h3>
          {renderTable(geoResult)}
        </div>
      )}

      <div>
        <h3 className="font-bold mb-2">Search History</h3>
        {history.length > 0 && (
          <button
            className="mb-2 bg-red-500 text-white px-4 py-1 rounded"
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </button>
        )}
        <ul className="space-y-1">
          <li className="text-gray-600 italic">Click IP to view info</li>
          {history.map((h) => (
            <li key={h.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(h.id)}
                onChange={() => toggleSelect(h.id)}
              />
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => handleHistoryClick(h.ip)}
              >
                {h.ip}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
