import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MdDashboard } from "react-icons/md";
import { MdOutlineStorage } from "react-icons/md";
import { MdStorage } from "react-icons/md";
import { 
  faTractor, 
  faDatabase, 
  faArrowRightFromBracket,
  faLayerGroup,
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
  faRobot,
  faHome,
  faChartArea,
  faWater,
  faSeedling,
  faCloudRain,
  faWarning,
  faBug,
  faSprayCan,
  faWheatAwn,
  faPlantWilt,
  faMap,
  faDraftingCompass,
  faLocationDot,
  faHandshake,
  faRupeeSign,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isSidebarOpen, isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    analytics: true,
    pests: false,
    crops: false,
    irrigation: false,
    fields: false
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
      className={`fixed top-0 left-0 z-40 h-screen pt-14 transition-all duration-300 ease-in-out bg-gradient-to-b from-green to-gray-50 border-r border-gray-200 shadow-sm ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } ${isMobile ? 'w-72' : ''} ${!isMobile && isCollapsed ? 'md:w-20' : 'md:w-64'}` }
      aria-label="Sidebar"
    >
      <div className="h-full flex flex-col justify-between overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        <div>
          {/* Top section with logo & collapse button */}
          <div className="flex items-center justify-between py-2 px-3 border-b border-gray-200">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <span className="font-bold text-green-700 text-lg">Smart Agri</span>
              </div>
            )}
            
            {/* Toggle button */}
            <button 
              onClick={toggleSidebar} 
              type="button" 
              className={`${isCollapsed ? 'mx-auto' : ''} inline-flex items-center justify-center p-1.5 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors`}
              aria-expanded={!isCollapsed}
            >
              <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} className="w-4 h-4" />
              <span className="sr-only">Toggle sidebar</span>
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="mt-2">
            <div className={`px-3 py-2 ${!isCollapsed && 'mb-1'}`}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Main
                </h3>
              )}
              <ul className="mt-1 space-y-1">
                <li>
                  <Link
                    to="/"
                    className={`flex items-center px-3 py-2.5 rounded-lg ${isCollapsed ? 'justify-center' : ''} ${
                      isActive('/') 
                        ? 'bg-green-100 text-green-800 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    } group transition-colors duration-150`}
                  >
                    <FontAwesomeIcon
                      icon={faHome}
                      className={`w-5 h-5 ${isActive('/') ? 'text-green-700' : 'text-gray-500 group-hover:text-gray-900'}`}
                    />
                    {!isCollapsed && <span className="ml-3 whitespace-nowrap">Dashboard</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/reports"
                    className={`flex items-center px-3 py-2.5 rounded-lg ${isCollapsed ? 'justify-center' : ''} ${
                      isActive('/reports') 
                        ? 'bg-green-100 text-green-800 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    } group transition-colors duration-150`}
                  >
                    <FontAwesomeIcon
                      icon={faChartArea}
                      className={`w-5 h-5 ${isActive('/reports') ? 'text-green-700' : 'text-gray-500 group-hover:text-gray-900'}`}
                    />
                    {!isCollapsed && <span className="ml-3 whitespace-nowrap">Reports</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/farm-console"
                    className={`flex items-center px-3 py-2.5 rounded-lg ${isCollapsed ? 'justify-center' : ''} ${
                      isActive('/farm-console') 
                        ? 'bg-green-100 text-green-800 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    } group transition-colors duration-150`}
                  >
                    <FontAwesomeIcon
                      icon={faTractor}
                      className={`w-5 h-5 ${isActive('/farm-console') ? 'text-green-700' : 'text-gray-500 group-hover:text-gray-900'}`}
                    />
                    {!isCollapsed && <span className="ml-3 whitespace-nowrap">Farm Console</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/crop-management"
                    className={`flex items-center px-3 py-2.5 rounded-lg ${isCollapsed ? 'justify-center' : ''} ${
                      isActive('/crop-management') 
                        ? 'bg-green-100 text-green-800 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    } group transition-colors duration-150`}
                  >
                    <FontAwesomeIcon
                      icon={faWarehouse}
                      className={`w-5 h-5 ${isActive('/crop-management') ? 'text-green-700' : 'text-gray-500 group-hover:text-gray-900'}`}
                    />
                    {!isCollapsed && <span className="ml-3 whitespace-nowrap">Crop Management</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/financial-aid"
                    className={`flex items-center px-3 py-2.5 rounded-lg ${isCollapsed ? 'justify-center' : ''} ${
                      isActive('/financial-aid') 
                        ? 'bg-green-100 text-green-800 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    } group transition-colors duration-150`}
                  >
                    <FontAwesomeIcon
                      icon={faHandshake}
                      className={`w-5 h-5 ${isActive('/financial-aid') ? 'text-green-700' : 'text-gray-500 group-hover:text-gray-900'}`}
                    />
                    {!isCollapsed && <span className="ml-3 whitespace-nowrap">Financial Aid</span>}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Analytics Sections */}
            <div className={`px-3 py-2 ${!isCollapsed && 'mb-1'}`}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Analytics
                </h3>
              )}
              <ul className="mt-1 space-y-1">
                {/* Climate Analysis Section */}
                <li>
                  <button
                    type="button"
                    className={`flex items-center w-full px-3 py-2.5 rounded-lg text-left text-gray-700 ${
                      isCollapsed ? 'justify-center' : ''
                    } hover:bg-gray-100 transition-colors duration-150`}
                    onClick={() => toggleMenu('analytics')}
                  >
                    <FontAwesomeIcon
                      icon={faCloudSunRain}
                      className="w-5 h-5 text-gray-500 group-hover:text-gray-900"
                    />
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 mr-auto font-medium">Climate Analysis</span>
                        <FontAwesomeIcon
                          icon={expandedMenus.analytics ? faAngleDown : faAngleRight}
                          className="w-4 h-4"
                        />
                      </>
                    )}
                  </button>

                  {expandedMenus.analytics && !isCollapsed && (
                    <ul className="mt-1 pl-7 space-y-1">
                      <li>
                        <Link
                          to="/climate"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/climate') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon
                            icon={faCloudSunRain}
                            className={`w-4 h-4 mr-2 ${isActive('/climate') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>Weather Forecast</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/vegetation"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/vegetation') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon
                            icon={faLeaf}
                            className={`w-4 h-4 mr-2 ${isActive('/vegetation') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>Vegetation Health</span>
                        </Link>
                      </li>
                      {/* <li>
                        <Link
                          to="/hazards"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/hazards') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon
                            icon={faWarning}
                            className={`w-4 h-4 mr-2 ${isActive('/hazards') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>Hazard Activities</span>
                        </Link>
                      </li> */}
                      <li>
                        <Link
                          to="/monsoon"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/monsoon') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon
                            icon={faCloudRain}
                            className={`w-4 h-4 mr-2 ${isActive('/monsoon') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>Water Irrigation</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/soil"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/soil') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon 
                            icon={faLayerGroup}
                            className={`w-4 h-4 mr-2 ${isActive('/soil') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>Soil Info</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                
                {/* Pest Detection Section */}
                <li>
                  <button
                    type="button"
                    className={`flex items-center w-full px-3 py-2.5 rounded-lg text-left text-gray-700 ${
                      isCollapsed ? 'justify-center' : ''
                    } hover:bg-gray-100 transition-colors duration-150`}
                    onClick={() => toggleMenu('pests')}
                  >
                    <FontAwesomeIcon
                      icon={faBug}
                      className="w-5 h-5 text-gray-500 group-hover:text-gray-900"
                    />
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 mr-auto font-medium">Pest Detection</span>
                        <FontAwesomeIcon
                          icon={expandedMenus.pests ? faAngleDown : faAngleRight}
                          className="w-4 h-4"
                        />
                      </>
                    )}
                  </button>

                  {expandedMenus.pests && !isCollapsed && (
                    <ul className="mt-1 pl-7 space-y-1">
                      <li>
                        <Link
                          to="/pest-monitor"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/pest-monitor') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon
                            icon={faBug}
                            className={`w-4 h-4 mr-2 ${isActive('/pest-monitor') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>Monitor & Detect</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/pest-treatment"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/pest-treatment') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon
                            icon={faSprayCan}
                            className={`w-4 h-4 mr-2 ${isActive('/pest-treatment') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>Treatment Advisor</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                
                {/* Crop Management Section */}
                <li>
                  <button
                    type="button"
                    className={`flex items-center w-full px-3 py-2.5 rounded-lg text-left text-gray-700 ${
                      isCollapsed ? 'justify-center' : ''
                    } hover:bg-gray-100 transition-colors duration-150`}
                    onClick={() => toggleMenu('crops')}
                  >
                    <FontAwesomeIcon
                      icon={faWheatAwn}
                      className="w-5 h-5 text-gray-500 group-hover:text-gray-900"
                    />
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 mr-auto font-medium">Crop Management</span>
                        <FontAwesomeIcon
                          icon={expandedMenus.crops ? faAngleDown : faAngleRight}
                          className="w-4 h-4"
                        />
                      </>
                    )}
                  </button>

                  {expandedMenus.crops && !isCollapsed && (
                    <ul className="mt-1 pl-7 space-y-1">
                      <li>
                        <Link
                          to="/crop-planning"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/crop-planning') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon
                            icon={faWheatAwn}
                            className={`w-4 h-4 mr-2 ${isActive('/crop-planning') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>Crop Planning</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/crop-health"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/crop-health') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon
                            icon={faPlantWilt}
                            className={`w-4 h-4 mr-2 ${isActive('/crop-health') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>Health Monitoring</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/crop-yield"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/crop-yield') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon
                            icon={faChartLine}
                            className={`w-4 h-4 mr-2 ${isActive('/crop-yield') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>Yield Prediction</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                
                {/* Irrigation Management Section */}
                <li>
                  <button
                    type="button"
                    className={`flex items-center w-full px-3 py-2.5 rounded-lg text-left text-gray-700 ${
                      isCollapsed ? 'justify-center' : ''
                    } hover:bg-gray-100 transition-colors duration-150`}
                    onClick={() => toggleMenu('irrigation')}
                  >
                    <FontAwesomeIcon
                      icon={faWater}
                      className="w-5 h-5 text-gray-500 group-hover:text-gray-900"
                    />
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 mr-auto font-medium">Irrigation</span>
                        <FontAwesomeIcon
                          icon={expandedMenus.irrigation ? faAngleDown : faAngleRight}
                          className="w-4 h-4"
                        />
                      </>
                    )}
                  </button>

                  {expandedMenus.irrigation && !isCollapsed && (
                    <ul className="mt-1 pl-7 space-y-1">
                      <li>
                        <Link
                          to="/water-management"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/water-management') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon
                            icon={faDroplet}
                            className={`w-4 h-4 mr-2 ${isActive('/water-management') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>Water Management</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/irrigation-schedule"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/irrigation-schedule') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon
                            icon={faWater}
                            className={`w-4 h-4 mr-2 ${isActive('/irrigation-schedule') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>Schedule & Control</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>

            {/* AI Assistant */}
            {/* Field Management */}
            <div className={`px-3 py-2 ${!isCollapsed && 'mb-1'}`}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Field Management
                </h3>
              )}
              <ul className="mt-1 space-y-1">
                <li>
                  <button
                    type="button"
                    className={`flex items-center w-full px-3 py-2.5 rounded-lg text-left text-gray-700 ${
                      isCollapsed ? 'justify-center' : ''
                    } hover:bg-gray-100 transition-colors duration-150`}
                    onClick={() => toggleMenu('fields')}
                  >
                    <FontAwesomeIcon
                      icon={faMap}
                      className="w-5 h-5 text-gray-500 group-hover:text-gray-900"
                    />
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 mr-auto font-medium">Fields</span>
                        <FontAwesomeIcon
                          icon={expandedMenus.fields ? faAngleDown : faAngleRight}
                          className="w-4 h-4"
                        />
                      </>
                    )}
                  </button>

                  {expandedMenus.fields && !isCollapsed && (
                    <ul className="mt-1 pl-7 space-y-1">
                      <li>
                        <Link
                          to="/create-field"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/create-field') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon
                            icon={faDraftingCompass}
                            className={`w-4 h-4 mr-2 ${isActive('/create-field') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>Create New Field</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/field-list"
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive('/field-list') 
                              ? 'bg-green-50 text-green-800' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          } transition-colors duration-150`}
                        >
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            className={`w-4 h-4 mr-2 ${isActive('/field-list') ? 'text-green-700' : 'text-gray-500'}`}
                          />
                          <span>My Fields</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>

            {/* Tools */}
            <div className={`px-3 py-2 ${!isCollapsed && 'mb-1'}`}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tools
                </h3>
              )}
              <ul className="mt-1 space-y-1">
                <li>
                  <Link
                    to="/ai-assistant"
                    className={`flex items-center px-3 py-2.5 rounded-lg ${isCollapsed ? 'justify-center' : ''} ${
                      isActive('/ai-assistant') 
                        ? 'bg-blue-100 text-blue-800 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    } group transition-colors duration-150`}
                  >
                    <FontAwesomeIcon
                      icon={faRobot}
                      className={`w-5 h-5 ${isActive('/ai-assistant') ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-900'}`}
                    />
                    {!isCollapsed && <span className="ml-3 whitespace-nowrap">AI Assistant</span>}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto">
          <div className="px-3 py-2">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Account
              </h3>
            )}
            <ul className="space-y-1">
              <li>
                <Link
                  to="/profile"
                  className={`flex items-center px-3 py-2.5 rounded-lg ${isCollapsed ? 'justify-center' : ''} ${
                    isActive('/profile') 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                  } group transition-colors duration-150`}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className={`w-5 h-5 ${isActive('/profile') ? 'text-gray-700' : 'text-gray-500'} group-hover:text-gray-700`}
                  />
                  {!isCollapsed && <span className="ml-3 whitespace-nowrap">Admin</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className={`flex items-center px-3 py-2.5 rounded-lg ${isCollapsed ? 'justify-center' : ''} ${
                    isActive('/settings') 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                  } group transition-colors duration-150`}
                >
                  <FontAwesomeIcon
                    icon={faCog}
                    className={`w-5 h-5 ${isActive('/settings') ? 'text-gray-700' : 'text-gray-500'} group-hover:text-gray-700`}
                  />
                  {!isCollapsed && <span className="ml-3 whitespace-nowrap">Settings</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  className="flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                >
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'text-gray-500'} group-hover:text-red-600`}
                  />
                  {!isCollapsed && <span className="ml-3 whitespace-nowrap">Logout</span>}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
