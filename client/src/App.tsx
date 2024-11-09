import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Discover from './components/Discover/Discover';
import Navbar from './components/Navbar/Navbar';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Discover />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
