import { useState, useEffect } from 'react';
import ThemeButton from './ThemeButton';
import logo from '../../assets/chainalyze.svg';
import darkLogo from '../../assets/chainalyze-dark.svg';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const userTheme = localStorage.getItem('theme');
    if (userTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
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
    <header className="bg-lightnav py-2 px-[10%] dark:bg-darknav w-screen">
      <nav className="flex gap-10 justify-between items-center">
        <img
          src={isDarkMode ? darkLogo : logo}
          className="w-52"
          alt="Chainalyze Logo"
        />
        <div className="flex items-center gap-12">
          <ul className="flex content-center gap-7 text-2xl dark:text-white">
            <a href="#">Discover</a>
            <a href="#">Portfolio</a>
          </ul>
          <ThemeButton isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
