import { useDarkMode } from '../../context/DarkModeContext';

export default function DarkModeToggle({ className = '' }) {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={() => setDarkMode(!darkMode)}
      className={`relative w-14 h-6 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full px-1 transition-colors duration-300 border border-gray-400 dark:border-gray-600 ${className}`}
    >
      {/* Icon */}
      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-yellow-400 text-lg">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>
      </span>
      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 dark:text-yellow-300 text-lg">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>
      </span>
      {/* Slider */}
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white dark:bg-gray-900 rounded-full shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-8' : ''}`}
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
      />
    </button>
  );
}