import { parseCSV } from '../utils/dataUtils';
import { API_URLS } from '../config';

// This service fetches data from our APIs

// Function to fetch vegetation indices data
export const fetchVegetationIndices = async (indexName) => {
  try {
    // In a real application, this would be an API call
    // For now, we'll simulate loading a CSV file
    const response = await fetch(`/local_csv/${indexName}.csv`);
    const csvData = await response.text();
    return parseCSV(csvData);
  } catch (error) {
    console.error(`Error loading ${indexName} data:`, error);
    return [];
  }
};

// Function to fetch weather forecast data
export const fetchWeatherForecast = async (location) => {
  // This would be an API call to a weather service
  // For now, return mock data
  return {
    location,
    forecast: [
      { date: '2025-08-15', high: 32, low: 24, condition: 'sunny' },
      { date: '2025-08-16', high: 30, low: 23, condition: 'partly_cloudy' },
      { date: '2025-08-17', high: 29, low: 22, condition: 'cloudy' },
      { date: '2025-08-18', high: 31, low: 23, condition: 'sunny' },
      { date: '2025-08-19', high: 33, low: 25, condition: 'sunny' },
    ]
  };
};

// Function to fetch all fields
export const fetchFields = async () => {
  try {
    const response = await fetch(API_URLS.FIELDS);
    
    if (!response.ok) {
      throw new Error(`Error fetching fields: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !Array.isArray(data.fields)) {
      throw new Error('Invalid response format');
    }
    
    return data.fields;
  } catch (error) {
    console.warn('API not available, using fallback field data:', error.message);
    
    // Return mock data when API is not available
    return [
      {
        id: 1,
        name: "North Field",
        crop: "Wheat",
        area: 5.2,
        status: "Active",
        lastIrrigated: "2025-09-07",
        soilMoisture: 68,
        coordinates: [
          { lat: 28.6139, lng: 77.2090 },
          { lat: 28.6149, lng: 77.2090 },
          { lat: 28.6149, lng: 77.2110 },
          { lat: 28.6139, lng: 77.2110 }
        ]
      },
      {
        id: 2,
        name: "South Field",
        crop: "Rice",
        area: 3.8,
        status: "Active",
        lastIrrigated: "2025-09-06",
        soilMoisture: 72,
        coordinates: [
          { lat: 28.6120, lng: 77.2090 },
          { lat: 28.6130, lng: 77.2090 },
          { lat: 28.6130, lng: 77.2110 },
          { lat: 28.6120, lng: 77.2110 }
        ]
      }
    ];
  }
};

// Function to fetch a specific field by ID
export const fetchFieldData = async (fieldId) => {
  try {
    const response = await fetch(`${API_URLS.FIELDS}/${fieldId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching field data: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !data.field) {
      throw new Error('Invalid response format');
    }
    
    return data.field;
  } catch (error) {
    console.warn('API not available, using fallback field data:', error.message);
    
    // Return mock data for specific field when API is not available
    const mockFields = [
      {
        id: 1,
        name: "North Field",
        crop: "Wheat",
        area: 5.2,
        status: "Active",
        lastIrrigated: "2025-09-07",
        soilMoisture: 68,
        location: "North Farm Area",
        coordinates: [
          { lat: 28.6139, lng: 77.2090 },
          { lat: 28.6149, lng: 77.2090 },
          { lat: 28.6149, lng: 77.2110 },
          { lat: 28.6139, lng: 77.2110 }
        ],
        sensorData: {
          temperature: 28,
          humidity: 65,
          ph: 6.8,
          nutrients: { nitrogen: 45, phosphorus: 32, potassium: 67 }
        }
      },
      {
        id: 2,
        name: "South Field",
        crop: "Rice",
        area: 3.8,
        status: "Active",
        lastIrrigated: "2025-09-06",
        soilMoisture: 72,
        location: "South Farm Area",
        coordinates: [
          { lat: 28.6120, lng: 77.2090 },
          { lat: 28.6130, lng: 77.2090 },
          { lat: 28.6130, lng: 77.2110 },
          { lat: 28.6120, lng: 77.2110 }
        ],
        sensorData: {
          temperature: 29,
          humidity: 70,
          ph: 7.2,
          nutrients: { nitrogen: 52, phosphorus: 28, potassium: 58 }
        }
      }
    ];
    
    // Find and return the specific field, or return the first one if not found
    const field = mockFields.find(f => f.id === parseInt(fieldId)) || mockFields[0];
    return field;
  }
};

// Function to create a new field
export const createField = async (fieldData) => {
  try {
    const response = await fetch(API_URLS.FIELDS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fieldData),
    });

    if (!response.ok) {
      throw new Error(`Error creating field: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create field');
    }

    return data.field;
  } catch (error) {
    console.warn('API not available for field creation:', error.message);
    
    // Return mock success response when API is not available
    return {
      id: Date.now(),
      ...fieldData,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
  }
};

// Function to update a field
export const updateField = async (fieldId, fieldData) => {
  try {
    const response = await fetch(`${API_URLS.FIELDS}/${fieldId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fieldData),
    });

    if (!response.ok) {
      throw new Error(`Error updating field: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update field');
    }

    return data.field;
  } catch (error) {
    console.warn('API not available for field update:', error.message);
    
    // Return mock success response when API is not available
    return {
      id: fieldId,
      ...fieldData,
      updatedAt: new Date().toISOString()
    };
  }
};

// Function to delete a field
export const deleteField = async (fieldId) => {
  try {
    const response = await fetch(`${API_URLS.FIELDS}/${fieldId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error deleting field: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete field');
    }

    return true;
  } catch (error) {
    console.warn('API not available for field deletion:', error.message);
    
    // Return mock success response when API is not available
    return true;
  }
};
