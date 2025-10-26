import { useState } from 'react';

function InputForm({ onCalculate, t }) {
  const [plotSize, setPlotSize] = useState('');
  const [soilType, setSoilType] = useState('Sandy');
  const [cropType, setCropType] = useState('Maize');
  const [otherCrop, setOtherCrop] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validation with translated error messages
    if (plotSize <= 0) {
      alert(t('errors.requiredPlotSize'));
      return;
    }

    const finalCropType = cropType === 'Other' ? otherCrop : cropType;

    if (!finalCropType) {
      alert(t('errors.requiredCrop'));
      return;
    }

    const formData = {
      plotSize: Number(plotSize),
      soilType: soilType,
      cropType: finalCropType,
    };
    
    onCalculate(formData);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {/* Plot Size */}
        <div className="form-group">
          <label htmlFor="plotSize">{t('form.plotSizeLabel')}</label>
          <input
            type="number"
            id="plotSize"
            step="any"
            value={plotSize}
            onChange={(e) => setPlotSize(e.target.value)}
            placeholder={t('form.plotSizePlaceholder')}
            required
          />
        </div>

        {/* Soil Type */}
        <div className="form-group">
          <label htmlFor="soilType">{t('form.soilTypeLabel')}</label>
          <select
            id="soilType"
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
          >
            <option value="Sandy">{t('soil.Sandy')}</option>
            <option value="Loamy">{t('soil.Loamy')}</option>
            <option value="Clay">{t('soil.Clay')}</option>
          </select>
        </div>

        {/* Crop Type */}
        <div className="form-group">
          <label htmlFor="cropType">{t('form.cropTypeLabel')}</label>
          <select
            id="cropType"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
          >
            <option value="Maize">{t('crops.Maize')}</option>
            <option value="Tomato">{t('crops.Tomato')}</option>
            <option value="Cabbage">{t('crops.Cabbage')}</option>
            <option value="Other">{t('crops.Other')}</option>
          </select>
        </div>
        
        {/* Conditional "Other" Crop Input */}
        {cropType === 'Other' && (
          <div className="form-group">
            <label htmlFor="otherCrop">{t('form.otherCropLabel')}</label>
            <input
              type="text"
              id="otherCrop"
              value={otherCrop}
              onChange={(e) => setOtherCrop(e.target.value)}
              placeholder={t('form.otherCropPlaceholder')}
              required
            />
          </div>
        )}

        <button type="submit" className="calculate-btn">
          {t('form.submit')}
        </button>
      </form>
    </div>
  );
}

export default InputForm;