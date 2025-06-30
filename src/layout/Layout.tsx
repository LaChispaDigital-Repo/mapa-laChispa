import "./Layout.css";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { MapView } from "../components/Map/MapView";
import { ShowInfo } from "../components/DataDisplay/ShowInfo";
import { Footer } from "../components/Footer";

export const Layout: React.FC = () => {
  return (
    <div className="my-container">
      <header className="bg-gray-800 text-white">
        <FilterBar />
      </header>
      <main className="main-content">
        <div className="flex-1">
          <MapView />
        </div>
        <div className="bg-white border-t border-gray-200">
          <ShowInfo />
        </div>
      </main>
      <Footer />
    </div>
  );
};
