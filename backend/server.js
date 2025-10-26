const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'data.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// In-memory storage for saved plans
const savedPlans = {};

// === MAIN CALCULATION ENDPOINT ===
app.post('/api/calculate', (req, res) => {
  try {
    const { plotSize, soilType, cropType } = req.body;

    // Validation - only validate required fields and soilType
    if (!plotSize || !soilType || !cropType) {
      return res.status(400).json({ error: 'Missing required fields: plotSize, soilType, cropType' });
    }
    
    // Only validate soilType - cropType can be custom
    if (!db.soil_data[soilType]) {
      return res.status(400).json({ error: 'Invalid soilType provided.' });
    }

    // Calculate recipe
    const biochar_needed = plotSize * db.soil_data[soilType].biochar_recipe_kg_per_sqm;
    const hydrogel_needed = plotSize * db.amendment_data.hydrogel.recipe_kg_per_sqm;
    
    const total_cost = 
      (biochar_needed * db.amendment_data.biochar.cost_per_kg) + 
      (hydrogel_needed * db.amendment_data.hydrogel.cost_per_kg);

    // Generate simulation data
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

    // Get pest solution - handle custom crops gracefully
    let ipmSolution;
    if (db.crop_data[cropType]) {
      // Crop exists in database
      ipmSolution = db.crop_data[cropType].ipm_solution;
    } else {
      // Custom crop - provide generic advice
      ipmSolution = {
        title: "General Pest Control Advice",
        technique: "Integrated Pest Management",
        description: `For ${cropType}, we recommend researching Integrated Pest Management (IPM) specific to your plant. General tips include encouraging beneficial insects, using natural sprays like Neem oil, and practicing crop rotation.`
      };
    }

    // Send response
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

// === SAVE PLAN ENDPOINT ===
app.post('/api/save-plan', (req, res) => {
  try {
    const { formData, results } = req.body;

    if (!formData || !results) {
      return res.status(400).json({ error: 'Missing plan data' });
    }

    // Generate unique ID
    const planId = crypto.randomBytes(4).toString('hex');

    // Save plan
    savedPlans[planId] = {
      formData,
      results,
      createdAt: new Date().toISOString()
    };

    console.log(`Plan saved with ID: ${planId}`);

    res.json({ planId });

  } catch (error) {
    console.error('Error saving plan:', error);
    res.status(500).json({ error: 'Failed to save plan' });
  }
});

// === RETRIEVE PLAN ENDPOINT ===
app.get('/api/plan/:id', (req, res) => {
  try {
    const { id } = req.params;

    const plan = savedPlans[id];

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json(plan);

  } catch (error) {
    console.error('Error retrieving plan:', error);
    res.status(500).json({ error: 'Failed to retrieve plan' });
  }
});

// === ROOT ENDPOINT ===
app.get('/', (req, res) => {
  res.send('Agri-Architect Backend is running! Use the /api/calculate endpoint to get data.');
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});