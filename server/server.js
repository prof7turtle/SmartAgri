const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'], // Allow requests from various development URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Create directory for field coordinates if it doesn't exist
const fieldCoordsDir = path.join(__dirname, 'Field_co-ordinates');
if (!fs.existsSync(fieldCoordsDir)) {
  fs.mkdirSync(fieldCoordsDir, { recursive: true });
}

// API endpoint to save field coordinates
app.post('/api/fields', (req, res) => {
  try {
    console.log('Received field data request:', req.body);
    const fieldData = req.body;
    
    // Validate required fields
    if (!fieldData.name || !fieldData.location || !fieldData.coordinates || fieldData.coordinates.length < 3) {
      console.log('Validation failed:', { 
        name: !!fieldData.name, 
        location: !!fieldData.location, 
        coordinates: fieldData.coordinates ? fieldData.coordinates.length : 0 
      });
      
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid field data. Name, location, and at least 3 coordinates are required.' 
      });
    }
    
    // Create a filename based on field name with unique ID
    const sanitizedName = fieldData.name.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
    const filename = `${sanitizedName}_${fieldData.id}.json`;
    const filePath = path.join(fieldCoordsDir, filename);
    
    console.log('Saving field data to:', filePath);
    
    // Write the field data to a JSON file
    fs.writeFileSync(filePath, JSON.stringify(fieldData, null, 2));
    console.log('Field data saved successfully');
    
    return res.status(201).json({
      success: true,
      message: 'Field data saved successfully',
      filename: filename
    });
    
  } catch (error) {
    console.error('Error saving field data:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error while saving field data: ${error.message}`
    });
  }
});

// API endpoint to get all saved fields
app.get('/api/fields', (req, res) => {
  try {
    const files = fs.readdirSync(fieldCoordsDir);
    
    // Read each JSON file and extract field data
    const fields = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(fieldCoordsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
      });
    
    return res.status(200).json({
      success: true,
      fields: fields
    });
    
  } catch (error) {
    console.error('Error getting fields:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while getting fields'
    });
  }
});

// API endpoint to get a specific field by ID
app.get('/api/fields/:id', (req, res) => {
  try {
    const fieldId = req.params.id;
    const files = fs.readdirSync(fieldCoordsDir);
    
    // Find the file that contains the field ID
    const fieldFile = files.find(file => file.includes(fieldId) && file.endsWith('.json'));
    
    if (!fieldFile) {
      return res.status(404).json({
        success: false,
        message: 'Field not found'
      });
    }
    
    // Read the field data from the file
    const filePath = path.join(fieldCoordsDir, fieldFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fieldData = JSON.parse(fileContent);
    
    return res.status(200).json({
      success: true,
      field: fieldData
    });
    
  } catch (error) {
    console.error('Error getting field:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while getting field'
    });
  }
});

// Delete a field
app.delete('/api/fields/:id', (req, res) => {
  try {
    const fieldId = req.params.id;
    const files = fs.readdirSync(fieldCoordsDir);
    
    // Find the file that contains the field ID
    const fieldFile = files.find(file => file.includes(fieldId) && file.endsWith('.json'));
    
    if (!fieldFile) {
      return res.status(404).json({
        success: false,
        message: 'Field not found'
      });
    }
    
    // Delete the file
    const filePath = path.join(fieldCoordsDir, fieldFile);
    fs.unlinkSync(filePath);
    
    return res.status(200).json({
      success: true,
      message: 'Field deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting field:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting field'
    });
  }
});

// Serve static files from public directory for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
