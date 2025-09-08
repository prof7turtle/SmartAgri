/**
 * Climate Analysis Service
 * Handles API calls and data processing for all climate analysis features
 */

// Mock weather data generation
const generateMockWeatherData = (days, min, max, startDate = new Date()) => {
  const data = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - (days - i - 1));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat((Math.random() * (max - min) + min).toFixed(1))
    });
  }
  
  return data;
};

// Generate mock vegetation index data
const generateMockVegetationData = (days, min = 0.4, max = 0.85, increaseOverTime = true, startDate = new Date()) => {
  const data = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - (days - i - 1));
    
    let value;
    if (increaseOverTime) {
      // Slightly increasing trend with some randomness
      value = parseFloat((min + (max - min) * (i / days) + Math.random() * 0.1 - 0.05).toFixed(2));
    } else {
      value = parseFloat((Math.random() * (max - min) + min).toFixed(2));
    }
    
    // Ensure within range
    value = Math.max(min, Math.min(max, value));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: value
    });
  }
  
  return data;
};

/**
 * Fetch weather forecast data
 * @param {string} fieldId - Field identifier
 * @param {string} location - Location name
 * @param {Object} dateRange - Date range object with startDate and endDate
 * @returns {Promise} Promise resolving to weather data
 */
export const fetchWeatherData = (fieldId, location, dateRange) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      try {
        // Calculate days difference for proper data generation
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        // Generate the data
        const weatherData = {
          temperature: generateMockWeatherData(daysDiff, 25, 35, endDate),
          humidity: generateMockWeatherData(daysDiff, 50, 85, endDate),
          rainfall: generateMockWeatherData(daysDiff, 0, 25, endDate)
        };
        
        resolve(weatherData);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

/**
 * Fetch vegetation and crop health data
 * @param {string} fieldId - Field identifier
 * @param {string} location - Location name
 * @param {Object} dateRange - Date range object with startDate and endDate
 * @returns {Promise} Promise resolving to vegetation data
 */
export const fetchVegetationData = (fieldId, location, dateRange) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Calculate days difference for proper data generation
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        // Generate vegetation data with various indices
        const vegetationData = {
          ndvi: generateMockVegetationData(daysDiff, 0.4, 0.85, true, endDate),
          evi: generateMockVegetationData(daysDiff, 0.2, 0.7, true, endDate),
          gci: generateMockVegetationData(daysDiff, 1, 3, false, endDate),
          fieldSections: [
            { name: 'North Section', value: parseFloat((0.75 + Math.random() * 0.1).toFixed(2)), status: 'Excellent' },
            { name: 'Central Section', value: parseFloat((0.65 + Math.random() * 0.1).toFixed(2)), status: 'Good' },
            { name: 'South Section', value: parseFloat((0.55 + Math.random() * 0.1).toFixed(2)), status: 'Moderate' }
          ]
        };
        
        resolve(vegetationData);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

/**
 * Fetch water and irrigation data
 * @param {string} fieldId - Field identifier
 * @param {string} location - Location name
 * @param {Object} dateRange - Date range object with startDate and endDate
 * @returns {Promise} Promise resolving to water data
 */
export const fetchWaterData = (fieldId, location, dateRange) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Calculate days difference for proper data generation
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        // Generate water and irrigation data
        const waterData = {
          soilMoisture: generateMockWeatherData(daysDiff, 30, 70, endDate),
          irrigationEvents: [
            { date: '2025-08-14', amount: 12000, duration: '1h 45m', fieldSection: 'North Field', status: 'Completed' },
            { date: '2025-08-11', amount: 15000, duration: '2h 15m', fieldSection: 'All Sections', status: 'Completed' },
            { date: '2025-08-08', amount: 8500, duration: '1h 10m', fieldSection: 'South Field', status: 'Completed' }
          ],
          recommendations: [
            {
              type: 'schedule',
              title: 'Next Irrigation Schedule',
              description: 'Based on soil moisture trends and weather forecast, schedule next irrigation for August 17, 2025.',
              priority: 'normal'
            },
            {
              type: 'alert',
              title: 'Water Conservation Alert',
              description: 'Lower North field section shows higher than average water usage. Consider adjusting irrigation in this area.',
              priority: 'warning'
            }
          ]
        };
        
        resolve(waterData);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

/**
 * Fetch fire and hazards data
 * @param {string} fieldId - Field identifier
 * @param {string} location - Location name
 * @param {Object} dateRange - Date range object with startDate and endDate
 * @returns {Promise} Promise resolving to hazard data
 */
export const fetchHazardData = (fieldId, location, dateRange) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const hazardData = {
          fireRiskIndex: parseFloat((Math.random() * 0.4 + 0.2).toFixed(2)),
          hazardAlerts: [
            {
              type: 'information',
              title: 'Low Fire Risk',
              description: 'Current fire risk is low due to recent rainfall and moderate temperatures.'
            }
          ],
          historicalEvents: []
        };
        
        resolve(hazardData);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

/**
 * Fetch rainfall and monsoon data
 * @param {string} fieldId - Field identifier
 * @param {string} location - Location name
 * @param {Object} dateRange - Date range object with startDate and endDate
 * @returns {Promise} Promise resolving to rainfall data
 */
export const fetchRainfallData = (fieldId, location, dateRange) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Calculate days difference for proper data generation
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        const rainfallData = {
          dailyRainfall: generateMockWeatherData(daysDiff, 0, 25, endDate),
          monsoonProgress: 0.65, // 65% progress
          seasonalTotal: 450, // mm
          averageComparison: 0.9, // 90% of average
          forecast: {
            nextRain: '2025-08-18',
            intensity: 'Moderate',
            probability: 0.75
          }
        };
        
        resolve(rainfallData);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

/**
 * Fetch soil and land data
 * @param {string} fieldId - Field identifier
 * @param {string} location - Location name
 * @param {Object} dateRange - Date range object with startDate and endDate
 * @returns {Promise} Promise resolving to soil data
 */
export const fetchSoilData = (fieldId, location, dateRange) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Randomize but ensure values stay in realistic ranges
        const phValue = parseFloat((6.5 + Math.random() * 1.0 - 0.5).toFixed(1));
        const nitrogenValue = parseFloat((Math.random() * 20 + 40).toFixed(1));
        const phosphorusValue = parseFloat((Math.random() * 15 + 25).toFixed(1));
        const potassiumValue = parseFloat((Math.random() * 50 + 150).toFixed(1));
        const organicMatterValue = parseFloat((Math.random() * 1.5 + 2.0).toFixed(1));

        // More comprehensive soil data
        const soilData = {
          soilType: 'Clay Loam',
          ph: phValue,
          // Primary macronutrients (NPK)
          nitrogen: nitrogenValue,
          phosphorus: phosphorusValue,
          potassium: potassiumValue,
          // Secondary macronutrients
          calcium: parseFloat((Math.random() * 500 + 1000).toFixed(1)),
          magnesium: parseFloat((Math.random() * 20 + 45).toFixed(1)),
          sulfur: parseFloat((Math.random() * 10 + 10).toFixed(1)),
          // Micronutrients
          zinc: parseFloat((Math.random() * 2 + 1).toFixed(1)),
          iron: parseFloat((Math.random() * 10 + 15).toFixed(1)),
          manganese: parseFloat((Math.random() * 5 + 5).toFixed(1)),
          copper: parseFloat((Math.random() * 1 + 1).toFixed(1)),
          boron: parseFloat((Math.random() * 0.5 + 0.5).toFixed(2)),
          molybdenum: parseFloat((Math.random() * 0.1 + 0.1).toFixed(2)),
          // Physical properties
          organicMatter: organicMatterValue,
          cec: parseFloat((Math.random() * 5 + 12).toFixed(1)), // Cation Exchange Capacity
          waterCapacity: parseFloat((Math.random() * 0.1 + 0.15).toFixed(2)),
          soilTemperature: parseFloat((Math.random() * 5 + 20).toFixed(1)),
          soilCompaction: parseFloat((Math.random() * 0.2 + 1.1).toFixed(1)),
          // Soil composition
          sandPercentage: 35,
          siltPercentage: 40, 
          clayPercentage: 25,
          // Historical data (would be more comprehensive in a real app)
          history: [
            {
              date: '2025-02-15',
              ph: parseFloat((phValue - 0.2).toFixed(1)),
              organicMatter: parseFloat((organicMatterValue - 0.3).toFixed(1)),
              nitrogen: parseFloat((nitrogenValue - 5).toFixed(1))
            },
            {
              date: '2024-08-10',
              ph: parseFloat((phValue - 0.4).toFixed(1)),
              organicMatter: parseFloat((organicMatterValue - 0.6).toFixed(1)),
              nitrogen: parseFloat((nitrogenValue - 8).toFixed(1))
            }
          ],
          // Recommendations based on soil test
          recommendations: [
            {
              nutrient: 'Nitrogen',
              current: `${nitrogenValue} kg/ha`,
              recommendation: `Apply ${Math.max(0, Math.round(60 - nitrogenValue))} kg/ha of nitrogen-rich fertilizer before next planting`,
              fertilizers: ['Urea (46-0-0)', 'Ammonium Nitrate (34-0-0)']
            },
            {
              nutrient: 'Phosphorus',
              current: `${phosphorusValue} kg/ha`,
              recommendation: `Apply ${Math.max(0, Math.round(40 - phosphorusValue))} kg/ha of phosphatic fertilizer to improve root development`,
              fertilizers: ['Triple Superphosphate (0-46-0)', 'DAP (18-46-0)']
            },
            {
              nutrient: 'Potassium',
              current: `${potassiumValue} kg/ha`,
              recommendation: `Apply ${Math.max(0, Math.round(200 - potassiumValue))} kg/ha of potassium fertilizer for drought resistance`,
              fertilizers: ['Potassium Chloride (0-0-60)', 'Potassium Sulfate (0-0-50)']
            }
          ],
          // pH management
          phManagement: phValue < 5.5 ? {
            action: 'Increase pH',
            amount: '50 kg/ha',
            material: 'agricultural lime',
            benefit: 'Improve nutrient availability and microbial activity'
          } : phValue > 7.5 ? {
            action: 'Decrease pH',
            amount: '30 kg/ha',
            material: 'elemental sulfur',
            benefit: 'Improve nutrient availability, especially phosphorus and micronutrients'
          } : null,
          // Soil management practices
          managementPractices: [
            {
              practice: 'Apply Organic Matter',
              description: 'Add compost or manure to improve soil structure and water retention',
              priority: 'high',
              schedule: 'Fall 2025'
            },
            {
              practice: 'Implement Crop Rotation',
              description: 'Alternate different crop families to prevent nutrient depletion',
              priority: 'medium',
              schedule: 'Next planting season'
            },
            {
              practice: 'Use Cover Crops',
              description: 'Plant legumes or grasses during off-seasons to prevent erosion',
              priority: 'high',
              schedule: 'After harvest'
            }
          ]
        };
        
        resolve(soilData);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

export default {
  fetchWeatherData,
  fetchVegetationData,
  fetchWaterData,
  fetchHazardData,
  fetchRainfallData,
  fetchSoilData
};
