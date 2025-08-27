import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TripPreferencesPage from './pages/TripPreferencesPage';
import LoadingPage from './pages/LoadingPage';
import ItineraryPage from './pages/ItineraryPage';
import BlogPage from './pages/BlogPage';
import BudgetTrackerPage from './pages/BudgetTrackerPage';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/trip_preferences" element={<TripPreferencesPage />} />
        <Route path="/loading/:id" element={<LoadingPage />} />
        <Route path="/itinerary/:id" element={<ItineraryPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/budget_tracker" element={<BudgetTrackerPage />} />
      </Routes>
    </div>
  );
}

export default App;