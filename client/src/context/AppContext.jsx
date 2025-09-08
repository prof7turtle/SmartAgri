import { createContext, useState, useContext, useEffect } from 'react';
import { fetchFields } from '../services/dataService';

// Create the context with default values
const AppContext = createContext({
  selectedField: '',
  setSelectedField: () => {},
  selectedLocation: '',
  setSelectedLocation: () => {},
  fields: [],
  loading: false,
  addField: () => {},
  refreshFields: async () => {},
  analyticsData: {
    weather: {},
    vegetation: {},
    soil: {},
    water: {}
  },
  updateAnalyticsData: () => {}
});

// Create a custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Create the provider component
export const AppProvider = ({ children }) => {
  // State for user selections
  const [selectedField, setSelectedField] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // State for field data
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState({
    weather: {},
    vegetation: {},
    soil: {},
    water: {}
  });

  // Fetch fields from backend on component mount
  useEffect(() => {
    const loadFields = async () => {
      try {
        setLoading(true);
        const fieldData = await fetchFields();
        setFields(fieldData);
        
        // Select the first field by default if available
        if (fieldData.length > 0 && !selectedField) {
          setSelectedField(fieldData[0].id);
          if (fieldData[0].location) {
            setSelectedLocation(fieldData[0].location);
          }
        }
      } catch (error) {
        console.error('Error loading fields:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFields();
  }, []);
  
  // Function to add a new field (will be replaced with API call in production)
  const addField = (field) => {
    setFields([...fields, field]);
  };
  
  // Function to update analytics data
  const updateAnalyticsData = (category, data) => {
    setAnalyticsData(prev => ({
      ...prev,
      [category]: data
    }));
  };
  
  // Function to refresh fields from backend
  const refreshFields = async () => {
    try {
      setLoading(true);
      const fieldData = await fetchFields();
      setFields(fieldData);
    } catch (error) {
      console.error('Error refreshing fields:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Values to be provided to consumers
  const value = {
    selectedField,
    setSelectedField,
    selectedLocation,
    setSelectedLocation,
    fields,
    loading,
    addField,
    refreshFields,
    analyticsData,
    updateAnalyticsData
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
