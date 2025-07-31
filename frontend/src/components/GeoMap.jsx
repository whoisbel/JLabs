import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


function ResetMap({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 10);
  }, [lat, lng, map]);

  return null;
}

export default function GeoMap({ loc }) {
  if (!loc) return null;

  const [lat, lng] = loc.split(',').map(Number);

  return (
    <div className="h-96 mb-4 border rounded overflow-hidden">
      <MapContainer center={[lat, lng]} zoom={10} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]}>
          <Popup>Location: {lat}, {lng}</Popup>
        </Marker>
        <ResetMap lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}
