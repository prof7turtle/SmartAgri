# Smart Agriculture Platform

![Smart Agriculture Platform](client/public/bg-pattern.svg)

## Overview

Smart Agriculture is a comprehensive digital platform designed to transform traditional farming practices by leveraging data analytics, satellite imagery, machine learning, and IoT sensors. This platform provides farmers with actionable insights for crop management, climate analysis, field mapping, and financial aid opportunities to optimize productivity and sustainability.

## Features

### 1. Dashboard
- Real-time farm health overview
- Weather forecasts and alerts
- Soil moisture monitoring
- Crop health visualization
- Field activity timeline

### 2. Climate Analysis
- **Weather Analysis**: Daily and weekly forecasts
- **Vegetation Analysis**: NDVI and other vegetation indices
- **Water & Irrigation Analysis**: Soil moisture, irrigation planning
- **Soil & Land Analysis**: Soil composition, pH levels, nutrients

### 3. Field Management
- Interactive field mapping
- Field creation with polygon drawing
- Field-specific analytics
- Multiple field management

### 4. Crop Management
- **Crop Lifecycle Tracking**: Planting to harvesting timeline
- **Inventory Management**: Seed, fertilizer, and equipment tracking

### 5. Financial Aid
- **Scheme Eligibility**: Government program recommendations
- **Subsidies & Freebies**: Available subsidies for farmers
- **Loan & Bank Finder**: Agricultural loan options
- **Support Guide**: Application assistance
- **Notification Center**: Updates on deadlines and new programs

### 6. AI Assistant
- Natural language queries for farm data
- Actionable recommendations
- Problem diagnosis for crops

## Technical Architecture

### Frontend
- React.js with Hooks and Context API
- Tailwind CSS for responsive UI
- Chart.js for data visualization
- FontAwesome icons
- React Router for navigation

### Backend
- Node.js with Express
- File-based data storage (JSON)
- REST API endpoints

### Data Sources
- Google Earth Engine for satellite imagery
- Local CSV data for vegetation indices:
  - NDVI (Normalized Difference Vegetation Index)
  - EVI (Enhanced Vegetation Index)
  - NDWI (Normalized Difference Water Index)
  - And many more

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/sujal-pawar/SmartAgri.git
cd SmartAgri
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

### Running the Application

1. Start the backend server
```bash
cd server
node server.js
```

2. Start the frontend development server
```bash
cd client
npm run dev
```

3. Access the application at http://localhost:5173

## Usage Guide

### Creating a New Field
1. Navigate to "Create Field" in the sidebar or top navigation
2. Draw the field boundary on the map using the polygon tools
3. Fill in field details (name, location, crop type)
4. Save the field

### Analyzing Field Health
1. Select a field from the dropdown in the navigation bar
2. Visit the Climate Analysis section
3. Explore different tabs for Weather, Vegetation, Water, and Soil analysis

### Accessing Financial Aid
1. Navigate to the Financial Aid section
2. Browse through available schemes and subsidies
3. Use the eligibility checker to find suitable programs
4. Get guided assistance for application processes

## Project Structure

```
client/
  ├── src/
  │   ├── components/      # UI components
  │   ├── context/         # React context for state management
  │   ├── pages/           # Main application pages
  │   ├── services/        # API service functions
  │   └── utils/           # Utility functions
  ├── public/              # Static assets
  └── local_csv/           # Local data sources

server/
  ├── Field_co-ordinates/  # Field boundary data storage
  ├── field_corrdinates/   # Additional field data
  └── Google_Earth_Engine/ # GEE Python scripts for data export
```

## Environment Variables

The application uses environment variables for configuration. Create a `.env` file in both client and server directories:

### Client
```
VITE_API_BASE_URL=http://localhost:5000
```

### Server
```
PORT=5000
NODE_ENV=development
```

## Data Flow

1. **Field Selection**: When a field is selected in the UI, the field's coordinates are used to update the manipal.json file
2. **Data Retrieval**: The application fetches field-specific data based on selected field coordinates
3. **Analysis**: Various indices are calculated and displayed in the respective analysis sections
4. **Recommendations**: The system generates recommendations based on analyzed data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Developed for IIC Jaipur Hackathon
- Satellite imagery provided by Google Earth Engine
- Weather data from open meteorological sources
- Agricultural best practices from domain experts

## Contact

For questions or support, please contact the development team.
