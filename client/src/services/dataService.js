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
    console.error('Error fetching fields:', error);
    return [];
  }
};

// Function to fetch a single field
export const fetchFieldData = async (fieldId) => {
  // If no fieldId is provided, return mock data
  if (!fieldId) {
    return {
      id: 'default',
      name: 'No Field Selected',
      size: 0, // acres
      location: 'N/A',
      crops: ['None'],
      soilType: 'N/A',
      plantingDate: 'N/A',
      ndviHistory: [
        { date: '2025-07-15', value: 0.65 },
        { date: '2025-07-22', value: 0.68 },
        { date: '2025-07-29', value: 0.72 },
        { date: '2025-08-05', value: 0.75 },
        { date: '2025-08-12', value: 0.78 },
      ]
    };
  }
  
  try {
    const response = await fetch(`${API_URLS.FIELDS}/${fieldId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching field ${fieldId}: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !data.field) {
      throw new Error('Invalid response format');
    }
    
    // Calculate field size in acres from coordinates
    const fieldSize = calculateFieldArea(data.field.coordinates);
    
    // Add additional properties needed for the dashboard
    // Handle the field with crop data
    const crop = data.field.crop || 'Not specified';
    
    return {
      ...data.field,
      size: fieldSize.toFixed(2), // converted to acres
      crops: [crop], // Use the crop from the field data
      mainCrop: crop, // Add main crop directly for easy access
      soilType: 'Clay Loam',
      plantingDate: '2025-06-10',
      ndviHistory: [
        { date: '2025-07-15', value: 0.65 },
        { date: '2025-07-22', value: 0.68 },
        { date: '2025-07-29', value: 0.72 },
        { date: '2025-08-05', value: 0.75 },
        { date: '2025-08-12', value: 0.78 },
      ]
    };
  } catch (error) {
    console.error(`Error fetching field data for ${fieldId}:`, error);
    // Return mock data on error
    return {
      id: fieldId,
      name: `Field ${fieldId}`,
      size: 20, // acres
      location: 'Unknown',
      crop: 'Wheat', // Default crop
      crops: ['Wheat'],
      mainCrop: 'Wheat',
      soilType: 'Clay Loam',
      plantingDate: '2025-06-10',
      ndviHistory: [
        { date: '2025-07-15', value: 0.65 },
        { date: '2025-07-22', value: 0.68 },
        { date: '2025-07-29', value: 0.72 },
        { date: '2025-08-05', value: 0.75 },
        { date: '2025-08-12', value: 0.78 },
      ]
    };
  }
};

// Helper function to calculate field area in acres from coordinates
function calculateFieldArea(coordinates) {
  if (!coordinates || coordinates.length < 3) return 0;

  // Implementation of the Shoelace formula to calculate polygon area
  let area = 0;
  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;
    area += coordinates[i].lat * coordinates[j].lng;
    area -= coordinates[j].lat * coordinates[i].lng;
  }

  area = Math.abs(area) / 2;
  
  // Convert square degrees to hectares
  const degreeToMeter = 111319.9; // At equator, varies by latitude
  const squareMetersToHectares = 0.0001;
  const hectaresToAcres = 2.47105;
  
  return area * Math.pow(degreeToMeter, 2) * squareMetersToHectares * hectaresToAcres;
};
