import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeButton from './ThemeButton';
import logo from '../../assets/chainalyze.svg';
import darkLogo from '../../assets/chainalyze-dark.svg';

const Navbar = () => {
  // Initialize the theme based on localStorage, without using React state initially
  const initialTheme = localStorage.getItem('theme') === 'dark';

  // State for toggling theme after the initial load
  const [isDarkMode, setIsDarkMode] = useState(initialTheme);

  useEffect(() => {
    // Apply theme class directly when component mounts
    if (initialTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <header className="bg-lightnav dark:bg-darknav w-screen px-[10%] py-[0.5%]">
      <nav className="flex gap-[30%] justify-between items-center">
        <Link to="/">
          <img
            src={isDarkMode ? darkLogo : logo}
            className="w-52"
            alt="Chainalyze Logo"
          />
        </Link>
        <div className="flex items-center gap-12">
          <ul className="flex content-center gap-5 text-2xl font-semibold">
            <li className="hover:bg-sterling dark:hover:bg-darknavhov rounded-lg p-2">
              <Link to="/">Discover</Link>
            </li>
            <li className="hover:bg-sterling dark:hover:bg-darknavhov rounded-lg p-2">
              <Link to="/portfolio">Portfolio</Link>
            </li>
          </ul>
          <ThemeButton isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;