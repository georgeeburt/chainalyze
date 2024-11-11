import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Discover from './components/Discover/Discover';
import Navbar from './components/Navbar/Navbar';
import TokenOverview from './components/TokenOverview/TokenOverview';
import './App.css';
import Portfolio from './components/Portfolio';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/token/:id" element={<TokenOverview />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
