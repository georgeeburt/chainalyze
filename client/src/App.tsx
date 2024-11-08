import './App.css';
import Discover from './components/Discover/Discover';
import Navbar from './components/Navbar/Navbar';

const App = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <Discover />
    </div>
  );
};

export default App;
