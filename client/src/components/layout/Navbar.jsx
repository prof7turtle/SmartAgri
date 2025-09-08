import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMicrophone, 
  faMagnifyingGlass, 
  faBars, 
  faXmark,
  faChevronDown,
  faPlus,
  faMap,
  faLeaf
} from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '../../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Safely use context with default values if context is undefined
  const contextValue = useAppContext() || {};
  const { 
    selectedField = '', 
    setSelectedField = () => {}, 
    selectedLocation = '', 
    setSelectedLocation = () => {}, 
    fields = [], 
    addField = () => {} 
  } = contextValue;
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewFieldDialog, setShowNewFieldDialog] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  
  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  const handleFieldChange = (e) => {
    const value = e.target.value;
    
    if (value === 'new_field') {
      setShowNewFieldDialog(true);
    } else {
      setSelectedField(value);
    }
  };
  
  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };
  
  const handleNewFieldSubmit = (e) => {
    e.preventDefault();
    
    if (newFieldName.trim()) {
      addField(newFieldName.trim());
      setSelectedField(newFieldName.trim());
      setNewFieldName('');
      setShowNewFieldDialog(false);
    }
  };
  
  const navigateToClimateAnalysis = () => {
    navigate('/climate');
  };
  
  const navigateToFarmConsole = () => {
    navigate('/farm-console');
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-gradient-to-r from-green-900 to-[#192a06] border-b border-green-800 shadow-lg">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">            
            <Link to="/" className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faLeaf} className="text-green-400 text-2xl" />
              <span className="text-xl font-bold text-white whitespace-nowrap">
                Smart Agriculture
              </span>
            </Link> 
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white hover:bg-green-800 p-2 rounded-md transition duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} />
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 flex-grow mx-6">
              {/* Search Bar */}
              <div className="flex-grow max-w-md">
                <form onSubmit={handleSearch} className="relative flex items-center rounded-full overflow-hidden bg-white/90 border border-green-200 shadow-sm h-10">
                  <input 
                    type="text" 
                    id="searchInput" 
                    placeholder="Search (/) for tools, analytics, and more" 
                    className="w-full px-4 py-2 outline-none text-gray-700 bg-transparent"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="flex px-3 space-x-2">
                    <button type="button" className="text-green-600 hover:text-green-800 transition duration-200">
                      <FontAwesomeIcon icon={faMicrophone} />
                    </button>
                    <button type="submit" className="text-green-600 hover:text-green-800 transition duration-200">
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Create Field Button */}
              <button 
                onClick={() => navigate('/create-field')}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition duration-200 shadow-sm"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                <span>Create Field</span>
              </button>
              
              {/* Field Selection */}
              {/* <div className="relative min-w-[160px]">
                <select
                  name="Select Field"
                  id="selectField"
                  className="w-full h-10 border border-green-200 rounded-md px-4 py-2 bg-white/90 text-gray-700 appearance-none cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  onChange={handleFieldChange}
                  value={selectedField || ''}
                >
                  <option value="" disabled hidden>Select Field</option>
                  
                  {fields.map(field => (
                    <option key={field.id} value={field.name}>{field.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
                </div>
              </div> */}
              
              {/* Navigation Buttons */}
              {/* <button 
                onClick={navigateToClimateAnalysis} 
                className={`bg-white border rounded px-3 py-1.5 font-medium h-8.5 transition-colors ${location.pathname === '/climate' ? 'bg-green-100 text-green-800 border-green-500' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Climate Analysis
              </button>
              
              <button 
                onClick={navigateToFarmConsole} 
                className={`bg-white border rounded px-3 py-1.5 font-medium transition-colors ${location.pathname === '/farm-console' ? 'bg-green-100 text-green-800 border-green-500' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Farm Console
              </button> */}
            </div>
            
            {/* Location Selector - Desktop */}
            <div className="hidden md:block relative">
              <div className="relative">
                <input 
                  list="location-options" 
                  id="location" 
                  name="location" 
                  placeholder="📍 Location" 
                  className="h-10 w-40 border border-green-200 rounded-md px-4 py-2 bg-white/90 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                />
                <datalist id="location-options">
                  <option value="DIT Pune" />
                  <option value="Baramati" />
                  <option value="Sterling Castle Bhopal" />
                </datalist>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 py-4 border-t border-green-800 bg-gradient-to-b from-[#192a06] to-green-900 rounded-b-lg shadow-lg">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4 px-4">
                <div className="flex rounded-md overflow-hidden shadow-sm">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="flex-1 px-4 py-2 outline-none border-2 border-green-100 focus:border-green-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 transition duration-200">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </button>
                </div>
              </form>
              
              {/* Create Field Button - Mobile */}
              <div className="px-4 mb-4">
                <button 
                  onClick={() => {
                    navigate('/create-field');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition duration-200"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  <span>Create Field</span>
                </button>
              </div>
              
              {/* Mobile Field Selection */}
              <div className="mb-4 px-4">
                <label className="block text-sm font-medium text-white mb-1">Select Field</label>
                <div className="relative">
                  <select
                    className="w-full border border-green-100 rounded-md px-3 py-2 bg-white text-gray-700 appearance-none focus:outline-none"
                    onChange={handleFieldChange}
                    value={selectedField || ''}
                  >
                    <option value="" disabled hidden>Select Field</option>
                    <option value="new_field">Create New Field</option>
                    {fields.map(field => (
                      <option key={field.id} value={field.name}>{field.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              {/* Mobile Location */}
              <div className="mb-4 px-4">
                <label className="block text-sm font-medium text-white mb-1">Location</label>
                <input 
                  list="mobile-location-options" 
                  className="w-full border border-green-100 rounded-md px-3 py-2 bg-white text-gray-700"
                  placeholder="Select Location"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                />
                <datalist id="mobile-location-options">
                  <option value="DIT Pune" />
                  <option value="Baramati" />
                  <option value="Sterling Castle Bhopal" />
                </datalist>
              </div>
              
              {/* Mobile Navigation Buttons */}
              <div className="space-y-2">
                <button 
                  onClick={navigateToClimateAnalysis}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 block"
                >
                  Climate Analysis
                </button>
                <button 
                  onClick={navigateToFarmConsole}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 block"
                >
                  Farm Console
                </button>
                <Link 
                  to="/reports"
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 block"
                >
                  Reports
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
        
      {/* New Field Dialog */}
      {showNewFieldDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Field</h3>
            <form onSubmit={handleNewFieldSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter field name"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  onClick={() => setShowNewFieldDialog(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Create Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
