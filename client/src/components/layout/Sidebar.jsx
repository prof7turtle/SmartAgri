import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTractor, 
  faDatabase, 
  faArrowRightFromBracket,
  faChartLine,
  faLeaf,
  faCloudSunRain,
  faDroplet,
  faCog,
  faAngleRight,
  faAngleDown,
  faUser,
  faUserGear,
  faChevronLeft,
  faChevronRight,
  faRobot
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isSidebarOpen, isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    analytics: true,
    settings: false
  });
  
  // Detect screen size for responsive behavior
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = (menu) => {
    // Don't expand menus if sidebar is collapsed on desktop
    if (!isMobile && isCollapsed) {
      toggleSidebar(); // Expand the sidebar first
      return;
    }
    
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside 
      id="sidebar"
      className={`fixed top-0 left-0 z-40 h-screen pt-16 transition-all duration-300 ease-in-out bg-white border-r border-gray-200 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } ${isMobile ? 'w-72' : ''} ${!isMobile && isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <div className="flex items-center justify-between py-2 px-1">
          {/* User Info */}
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-green-600" />
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <div className="font-medium text-gray-900">Farm Manager</div>
                <div className="text-xs text-gray-500">admin@example.com</div>
              </div>
            )}
          </div>
          
          {/* Toggle button - only visible on desktop */}
          <button 
            onClick={toggleSidebar} 
            type="button" 
            className="hidden md:inline-flex items-center justify-center p-1 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-expanded={!isCollapsed}
          >
            <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} className="w-5 h-5" />
            <span className="sr-only">Toggle sidebar</span>
          </button>
        </div>
        
        <div className="my-4 border-t border-gray-200"></div>
        
        {/* Navigation Links */}
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className={`flex items-center p-2 rounded-lg ${isCollapsed ? 'justify-center' : ''} ${
                isActive('/') 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-900 hover:bg-gray-100'
              } group`}
            >
              <FontAwesomeIcon icon={faTractor} className={`w-5 h-5 text-gray-500 transition ${isActive('/') ? 'text-green-700' : 'group-hover:text-gray-900'}`} />
              {!isCollapsed && <span className="flex-1 ml-3 whitespace-nowrap">Dashboard</span>}
            </Link>
          </li>
          
          {/* Analytics Section */}
          <li>
            <button
              type="button"
              className={`flex items-center w-full p-2 text-base transition duration-75 rounded-lg group ${isCollapsed ? 'justify-center' : ''} ${
                expandedMenus.analytics ? 'bg-gray-100' : 'hover:bg-gray-100'
              } text-gray-900`}
              onClick={() => toggleMenu('analytics')}
            >
              <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 text-gray-500 transition group-hover:text-gray-900" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">Analytics</span>
                  <FontAwesomeIcon icon={expandedMenus.analytics ? faAngleDown : faAngleRight} />
                </>
              )}
            </button>
            
            {expandedMenus.analytics && !isCollapsed && (
              <ul className="py-2 space-y-1">
                <li>
                  <Link
                    to="/climate"
                    className={`flex items-center p-2 pl-11 w-full text-base transition duration-75 rounded-lg ${
                      isActive('/climate') 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon icon={faCloudSunRain} className={`w-4 h-4 mr-2 ${isActive('/climate') ? 'text-green-700' : 'text-gray-500'}`} />
                    <span>Climate Analysis</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vegetation"
                    className={`flex items-center p-2 pl-11 w-full text-base transition duration-75 rounded-lg ${
                      isActive('/vegetation') 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon icon={faLeaf} className={`w-4 h-4 mr-2 ${isActive('/vegetation') ? 'text-green-700' : 'text-gray-500'}`} />
                    <span>Vegetation Health</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/water"
                    className={`flex items-center p-2 pl-11 w-full text-base transition duration-75 rounded-lg ${
                      isActive('/water') 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon icon={faDroplet} className={`w-4 h-4 mr-2 ${isActive('/water') ? 'text-green-700' : 'text-gray-500'}`} />
                    <span>Water Analysis</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          
          <li>
            <Link
              to="/farm-console"
              className={`flex items-center p-2 rounded-lg ${isCollapsed ? 'justify-center' : ''} ${
                isActive('/farm-console') 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-900 hover:bg-gray-100'
              } group`}
            >
              <FontAwesomeIcon icon={faUserGear} className={`w-5 h-5 text-gray-500 transition ${isActive('/farm-console') ? 'text-green-700' : 'group-hover:text-gray-900'}`} />
              {!isCollapsed && <span className="flex-1 ml-3 whitespace-nowrap">Farm Console</span>}
            </Link>
          </li>
          
          <li>
            <Link
              to="/reports"
              className={`flex items-center p-2 rounded-lg ${isCollapsed ? 'justify-center' : ''} ${
                isActive('/reports') 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-900 hover:bg-gray-100'
              } group`}
            >
              <FontAwesomeIcon icon={faDatabase} className={`w-5 h-5 text-gray-500 transition ${isActive('/reports') ? 'text-green-700' : 'group-hover:text-gray-900'}`} />
              {!isCollapsed && <span className="flex-1 ml-3 whitespace-nowrap">Reports</span>}
            </Link>
          </li>
          
          {/* AI Assistant */}
          <li>
            <Link
              to="/ai-assistant"
              className={`flex items-center p-2 rounded-lg ${isCollapsed ? 'justify-center' : ''} ${
                isActive('/ai-assistant') 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-900 hover:bg-gray-100'
              } group`}
            >
              <FontAwesomeIcon icon={faRobot} className={`w-5 h-5 text-gray-500 transition ${isActive('/ai-assistant') ? 'text-green-700' : 'group-hover:text-gray-900'}`} />
              {!isCollapsed && <span className="flex-1 ml-3 whitespace-nowrap">AI Assistant</span>}
            </Link>
          </li>
          
          {/* Settings Section */}
          <li>
            <button
              type="button"
              className={`flex items-center w-full p-2 text-base transition duration-75 rounded-lg group ${isCollapsed ? 'justify-center' : ''} ${
                expandedMenus.settings ? 'bg-gray-100' : 'hover:bg-gray-100'
              } text-gray-900`}
              onClick={() => toggleMenu('settings')}
            >
              <FontAwesomeIcon icon={faCog} className="w-5 h-5 text-gray-500 transition group-hover:text-gray-900" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">Settings</span>
                  <FontAwesomeIcon icon={expandedMenus.settings ? faAngleDown : faAngleRight} />
                </>
              )}
            </button>
            
            {expandedMenus.settings && !isCollapsed && (
              <ul className="py-2 space-y-1">
                <li>
                  <Link
                    to="/settings/profile"
                    className={`flex items-center p-2 pl-11 w-full text-base transition duration-75 rounded-lg ${
                      isActive('/settings/profile') 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings/preferences"
                    className={`flex items-center p-2 pl-11 w-full text-base transition duration-75 rounded-lg ${
                      isActive('/settings/preferences') 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <span>Preferences</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
        
        {/* Bottom Link */}
        <div className="pt-4 mt-6 space-y-2 border-t border-gray-200">
          <Link
            to="/logout"
            className={`flex items-center p-2 rounded-lg ${isCollapsed ? 'justify-center' : ''} text-gray-900 hover:bg-red-50 hover:text-red-700 group transition-colors`}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-5 h-5 text-gray-500 transition group-hover:text-red-700" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
