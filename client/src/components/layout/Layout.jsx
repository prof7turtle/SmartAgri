import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faLeaf } from '@fortawesome/free-solid-svg-icons';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Check screen size and scroll position
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      
      // Close sidebar when switching between mobile and desktop
      if (isMobileView !== isMobile) {
        setSidebarOpen(false);
      }
      
      // Auto-collapse sidebar on small screens (but not mobile)
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      }
    };
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen && 
          !event.target.closest('aside') && 
          !event.target.closest('button[aria-controls="sidebar"]')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);
  
  // Toggle sidebar visibility on mobile or desktop
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-white to-green-50 overflow-hidden">
      <Navbar isScrolled={isScrolled} />
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        type="button"
        className="md:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 shadow-xl transition-all duration-300 transform hover:scale-105"
        aria-controls="sidebar"
        aria-expanded={sidebarOpen}
      >
        <span className="sr-only">Toggle sidebar</span>
        <FontAwesomeIcon icon={sidebarOpen ? faXmark : faBars} className="text-xl" />
      </button>
      
      {/* Dark Overlay - visible when mobile sidebar is open */}
      {sidebarOpen && isMobile && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-60 backdrop-blur-sm transition-all duration-300 md:hidden"
          aria-hidden="true"
        ></div>
      )}
      
      {/* Sidebar */}
      <Sidebar isSidebarOpen={sidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div 
        className={`flex-1 transition-all duration-300 mt-16 ${
          isMobile ? 'ml-0' : (isCollapsed ? 'md:ml-20' : 'md:ml-64')
        }`}
      >
        <main className="p-4 md:p-6">
          <div className="container mx-auto px-0 sm:px-4">
            <div className="transition-all duration-500 ease-in-out">
              {children}
            </div>
          </div>
        </main>
        
        {/* Footer with branding */}
        <footer className="bg-white/50 backdrop-blur-sm py-4 border-t border-green-100">
          <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <FontAwesomeIcon icon={faLeaf} className="text-green-500 mr-2" />
              <span className="text-sm text-gray-600">Smart Agriculture © 2025</span>
            </div>
            <div className="text-sm text-gray-500">
              Sustainable farming for a better tomorrow
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
