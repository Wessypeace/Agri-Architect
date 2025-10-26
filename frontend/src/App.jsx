import { useState, useEffect } from 'react';
import PDFExport from './components/PDFExport';
import WateringSchedule from './components/WateringSchedule';
import axios from 'axios';
import { STRINGS } from './i18n/strings';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import PestShield from './components/PestShield';
import SimulationChart from './components/SimulationChart';


function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const [unit, setUnit] = useState(localStorage.getItem('unit') || 'm²');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const [shareLink, setShareLink] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  const t = (key) => {
    const translated = key.split('.').reduce((o, k) => o?.[k], STRINGS[lang]);
    return translated || key;
  };

  const currencyRates = {
    USD: { symbol: '$', rate: 1 },
    ZAR: { symbol: 'R', rate: 18 },
    NGN: { symbol: '₦', rate: 1500 },
    GHS: { symbol: '₵', rate: 12 },
    KES: { symbol: 'KSh', rate: 130 },
  };

  const convertFromUnit = (value, sourceUnit) => {
    const conversions = { 'm²': 1, 'ha': 10000, 'acres': 4046.86 };
    return value * conversions[sourceUnit];
  };

  // Check if URL contains a plan ID on mount
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/plan\/([a-f0-9]+)$/);
    
    if (match) {
      const planId = match[1];
      loadSharedPlan(planId);
    }
  }, []);

  const loadSharedPlan = async (planId) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`https://agri-architect-backend.onrender.com/api/plan/${planId}`);
      setFormData(response.data.formData);
      setResults(response.data.results);
    } catch (err) {
      console.error('Error loading shared plan:', err);
      setError('This plan link is invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculate = async (formData) => {
    console.log("Sending data to backend:", formData);
    setIsLoading(true);
    setError('');
    setResults(null);
    setShareLink('');
    setFormData(formData);

    try {
      const response = await axios.post('https://agri-architect-backend.onrender.com/api/calculate', formData);
      console.log("Received data from backend:", response.data);
      setResults(response.data);
    } catch (err) {
      console.error("API Error:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(t('errors.apiGeneric'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSharePlan = async () => {
    if (!formData || !results) return;

    setIsSaving(true);

    try {
      const response = await axios.post('https://agri-architect-backend.onrender.com/api/save-plan', {
        formData,
        results
      });

      const planId = response.data.planId;
      const link = `${window.location.origin}/plan/${planId}`;
      setShareLink(link);

      // Copy to clipboard
      navigator.clipboard.writeText(link);
      alert('Link copied to clipboard! Share it with anyone.');
    } catch (err) {
      console.error('Error saving plan:', err);
      alert('Failed to generate share link. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetry = () => {
    setError('');
  };

  return (
    <main>
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <h1>{t('appTitle')}</h1>
            <p>{t('appTagline')}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              id="language"
              name="language"
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                localStorage.setItem('lang', e.target.value);
              }}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label htmlFor="unit" style={{ fontSize: '0.9rem' }}>{t('settings.units')}</label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value);
                  localStorage.setItem('unit', e.target.value);
                }}
              >
                <option value="m²">m²</option>
                <option value="ha">ha</option>
                <option value="acres">acres</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label htmlFor="currency" style={{ fontSize: '0.9rem' }}>{t('settings.currency')}</label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  localStorage.setItem('currency', e.target.value);
                }}
              >
                <option value="USD">$ (USD)</option>
                <option value="ZAR">R (ZAR)</option>
                <option value="NGN">₦ (NGN)</option>
                <option value="GHS">₵ (GHS)</option>
                <option value="KES">KSh (KES)</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <InputForm onCalculate={handleCalculate} t={t} unit={unit} convertFromUnit={convertFromUnit} />
      
      {isLoading && (
        <div className="loading-skeleton">
          <div className="skeleton-card">
            <div className="skeleton-title"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
          <p className="loading-message">{t('loading')}</p>
        </div>
      )}
      
      {error && (
        <div className="error-card">
          <p style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>
          <button onClick={handleRetry} className="retry-btn">{t('errors.retry')}</button>
        </div>
      )}

      {results && (
        <>

        <PDFExport 
      formData={formData} 
      results={results} 
      currency={currency}
      currencyRates={currencyRates}
    />
          {/* Share Button */}
          <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
            <button 
              onClick={handleSharePlan} 
              className="share-btn"
              disabled={isSaving}
            >
              {isSaving ? '⏳ Generating Link...' : '🔗 Share This Plan'}
            </button>
            {shareLink && (
              <div className="share-link-box">
                <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>✅ Share link:</p>
                <input 
                  type="text" 
                  value={shareLink} 
                  readOnly 
                  className="share-link-input"
                  onClick={(e) => e.target.select()}
                />
              </div>
            )}
          </div>

          <div className="results-container">
            <SimulationChart simulationData={results.simulationData} title={t('chart.title')} t={t} />
            <ResultsDisplay 
              recipe={results.recipe} 
              cost={results.cost} 
              t={t} 
              currency={currency}
              currencyRates={currencyRates}
            />
            <PestShield ipmSolution={results.ipmSolution} t={t} />
             <WateringSchedule 
        simulationData={results.simulationData} 
        soilType={formData?.soilType || 'Sandy'} 
        t={t} 
      />
          </div>
        </>
      )}
    </main>
  );
}

export default App;