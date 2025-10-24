// 1. Import necessary libraries
const express = require('express');
const cors = require('cors');
const fs = require('fs'); // 'fs' is the File System module, used to read files
const path = require('path'); // 'path' helps create correct file paths

// 2. Initialize the Express app and define the port
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Use middleware
app.use(cors());
app.use(express.json());

// 4. Load the knowledge base data from data.json
const dbPath = path.join(__dirname, 'data.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 5. Create the main API endpoint
app.post('/api/calculate', (req, res) => {
  try {
    // Get user input from the request body
    const { plotSize, soilType, cropType } = req.body;

    // --- Validation (important for real apps) ---
    if (!plotSize || !soilType || !cropType) {
      return res.status(400).json({ error: 'Missing required fields: plotSize, soilType, cropType' });
    }
    if (!db.soil_data[soilType] || !db.crop_data[cropType]) {
        return res.status(400).json({ error: 'Invalid soilType or cropType provided.' });
    }

    // --- Calculation Logic ---
    // 1. Calculate Recipe
    const biochar_needed = plotSize * db.soil_data[soilType].biochar_recipe_kg_per_sqm;
    const hydrogel_needed = plotSize * db.amendment_data.hydrogel.recipe_kg_per_sqm;

    // 2. Calculate Cost
    const total_cost = 
        (biochar_needed * db.amendment_data.biochar.cost_per_kg) + 
        (hydrogel_needed * db.amendment_data.hydrogel.cost_per_kg);

    // 3. Generate Simulation Data
    const labels = Array.from({ length: 20 }, (_, i) => `Day ${i + 1}`);
    const normalSoil_simulation = [];
    let currentMoistureNormal = 100;
    const normalLossRate = db.soil_data[soilType].daily_water_loss_percent / 100;

    const aquaSpnge_simulation = [];
    let currentMoistureAqua = 100;
    const aquaLossRate = normalLossRate * (1 - (db.amendment_data.hydrogel.water_loss_reduction_percent / 100));

    for (let i = 0; i < 20; i++) {
        normalSoil_simulation.push(Math.round(currentMoistureNormal));
        currentMoistureNormal *= (1 - normalLossRate);
        if (currentMoistureNormal < 0) currentMoistureNormal = 0;

        aquaSpnge_simulation.push(Math.round(currentMoistureAqua));
        currentMoistureAqua *= (1 - aquaLossRate);
        if (currentMoistureAqua < 0) currentMoistureAqua = 0;
    }

    // 4. Get Pest Solution
    const ipmSolution = db.crop_data[cropType].ipm_solution;

    // --- Send the response back to the user ---
    res.json({
      recipe: {
        biochar: parseFloat(biochar_needed.toFixed(2)),
        hydrogel: parseFloat(hydrogel_needed.toFixed(2))
      },
      cost: parseFloat(total_cost.toFixed(2)),
      simulationData: {
        labels: labels,
        normalSoil: normalSoil_simulation,
        aquaSpngeSoil: aquaSpnge_simulation
      },
      ipmSolution: ipmSolution
    });

  } catch (error) {
    console.error('Error during calculation:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});


// 6. Root route and Server Start
app.get('/', (req, res) => {
  res.send('Agri-Architect Backend is running! Use the /api/calculate endpoint to get data.');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});