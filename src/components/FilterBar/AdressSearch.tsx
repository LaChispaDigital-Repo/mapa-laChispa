import { useState } from "react";
import { useMapStore } from "../../store/useMapStore";

export const AddressSearch = () => {
  const [query, setQuery] = useState("");
  const { setPosition, setSearchPosition } = useMapStore();

  const handleSearch = async () => {
    if (!query.trim()) return;

    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
      setPosition(newPos); // centra el mapa
      setSearchPosition(newPos); // guarda el pin
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="join w-full">
      <input
        type="input"
        placeholder="Busca tu dirección..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 bg-slate-700 text-gray-200 border border-slate-600 shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-slate-400 join-item input"
      />
      <button className="btn btn-accent join-item" onClick={handleSearch}>
        Buscar
      </button>
    </div>
  );
};
