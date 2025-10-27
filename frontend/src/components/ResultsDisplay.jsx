import { useState } from 'react';

const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 4 13V7a1.92 1.92 0 0 1 .54-1.3L8 2h4l3.46 3.7A1.92 1.92 0 0 1 16 7v6a7 7 0 0 1-7 7Z"></path><path d="M11 20v-9"></path>
  </svg>
);

const WaterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5s-3 3.5-3 5.5a7 7 0 0 0 7 7Z"></path>
  </svg>
);

function ResultsDisplay({ recipe, cost, t, currency, currencyRates }) {
  const [pricePerKg, setPricePerKg] = useState(2.5);
  const [expectedYield, setExpectedYield] = useState(100);
  const [yieldIncrease, setYieldIncrease] = useState(25);
  const [showROI, setShowROI] = useState(false);

  if (!recipe || cost === null) {
    return null;
  }

  const { symbol, rate } = currencyRates[currency];
  const convertedCost = (cost * rate).toFixed(2);

  const baselineYield = expectedYield;
  const improvedYield = expectedYield * (1 + yieldIncrease / 100);
  const yieldGain = improvedYield - baselineYield;
  const revenueGain = yieldGain * pricePerKg * rate;
  const paybackCycles = revenueGain > 0 ? (convertedCost / revenueGain) : 0;
  const paybackMonths = (paybackCycles * 4).toFixed(1);

  return (
    <div id="results-recipe" className="results-card">
      <h2>{t('results.recipeTitle')}</h2>
      <div className="recipe-details">
        <div className="recipe-item">
          <div className="icon-wrapper">
            <LeafIcon />
          </div>
          <h3>{t('results.biochar')}</h3>
          <span className="amount">{recipe.biochar} kg</span>
          <p>{t('results.biocharDesc')}</p>
        </div>
        <div className="recipe-item">
          <div className="icon-wrapper">
            <WaterIcon />
          </div>
          <h3>{t('results.hydrogels')}</h3>
          <span className="amount">{recipe.hydrogel} kg</span>
          <p>{t('results.hydrogelsDesc')}</p>
        </div>
      </div>
      
      <div className="cost-summary">
        <h3>{t('results.costTitle')}</h3>
        <span className="total-cost">{symbol}{convertedCost}</span>
      </div>

      <div id="results-roi" className="roi-section">
        <button className="roi-toggle-btn" onClick={() => setShowROI(!showROI)}>
          {showROI ? '▼' : '▶'} Calculate Your Payback Time
        </button>

        {showROI && (
          <div className="roi-calculator">
            <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', color: '#555' }}>
              Adjust the values below to see how quickly this investment pays for itself.
            </p>
            <div className="roi-input-group">
              <label htmlFor="pricePerKg"><strong>Your crop's selling price (per kg):</strong></label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{symbol}</span>
                <input type="number" id="pricePerKg" step="0.1" value={pricePerKg} onChange={(e) => setPricePerKg(Number(e.target.value))} className="roi-input" />
              </div>
            </div>
            <div className="roi-input-group">
              <label htmlFor="expectedYield"><strong>Expected harvest without plan (kg):</strong></label>
              <input type="number" id="expectedYield" step="10" value={expectedYield} onChange={(e) => setExpectedYield(Number(e.target.value))} className="roi-input" />
            </div>
            <div className="roi-input-group">
              <label htmlFor="yieldIncrease"><strong>Yield increase with plan (%):</strong> {yieldIncrease}%</label>
              <input type="range" id="yieldIncrease" min="10" max="50" value={yieldIncrease} onChange={(e) => setYieldIncrease(Number(e.target.value))} className="roi-slider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888' }}>
                <span>10%</span>
                <span>50%</span>
              </div>
            </div>
            <div className="roi-results">
              <div className="roi-metric"><span className="roi-label">Extra Harvest:</span><span className="roi-value">{yieldGain.toFixed(1)} kg</span></div>
              <div className="roi-metric"><span className="roi-label">Extra Revenue per Cycle:</span><span className="roi-value">{symbol}{revenueGain.toFixed(2)}</span></div>
              <div className="roi-metric highlight"><span className="roi-label">Payback Time:</span><span className="roi-value">{paybackCycles < 1 ? `${paybackMonths} months` : `${paybackCycles.toFixed(1)} cycles (≈${paybackMonths} months)`}</span></div>
              <p style={{ fontSize: '0.9rem', marginTop: '1rem', fontStyle: 'italic', color: '#2c6e49' }}>💡 Your investment pays for itself in <strong>{paybackCycles < 1 ? 'less than one harvest' : `${paybackCycles.toFixed(1)} harvests`}</strong>!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsDisplay;