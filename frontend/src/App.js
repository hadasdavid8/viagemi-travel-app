import './App.css';
import { Routes, Route, Router } from 'react-router-dom';
import Home from './pages/Home';
import TripPreferencesPage from './pages/TripPreferencesPage';
import LoadingPage from './pages/LoadingPage';
import ItineraryPage from './pages/ItineraryPage';
import DesignPage from './pages/DesignPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/trip_preferences" element={<TripPreferencesPage />} />
        <Route path="/loading/:id" element={<LoadingPage />} />
        <Route path="/itinerary/:id" element={<ItineraryPage />} />
        <Route path="/design" element={<DesignPage />} />
      </Routes>
    </div>
  );
}

export default App;