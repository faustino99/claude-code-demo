import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { FavoritesProvider } from './context/FavoritesContext';
import Dashboard from './pages/Dashboard/Dashboard';
import PlayerSearch from './pages/PlayerSearch/PlayerSearch';
import PlayerProfile from './pages/PlayerProfile/PlayerProfile';
import TeamList from './pages/TeamList/TeamList';
import TeamSchedule from './pages/TeamSchedule/TeamSchedule';
import TradeRumors from './pages/TradeRumors/TradeRumors';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter>
        <Navbar />
        <main className="page container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/players" element={<PlayerSearch />} />
            <Route path="/players/:playerId" element={<PlayerProfile />} />
            <Route path="/teams" element={<TeamList />} />
            <Route path="/teams/:teamId/schedule" element={<TeamSchedule />} />
            <Route path="/trades" element={<TradeRumors />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </FavoritesProvider>
  );
}

export default App;
