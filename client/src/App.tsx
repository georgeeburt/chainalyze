import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MetadataProvider } from './components/contexts/MetadataContext';
import Discover from './components/Discover/Discover';
import Navbar from './components/Navbar/Navbar';
import TokenOverview from './components/TokenOverview/TokenOverview';
import './App.css';
import Portfolio from './components/Portfolio/Portfolio';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col">
        <Navbar />
        <MetadataProvider>
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/token/:id" element={<TokenOverview />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </MetadataProvider>
      </div>
    </Router>
  );
};

export default App;
