import { useState } from 'react';

function WateringSchedule({ simulationData, soilType, t }) {
  const [showSchedule, setShowSchedule] = useState(false);

  if (!simulationData) {
    return null;
  }

  // Calculate watering interval based on when moisture drops to critical level (40%)
  const criticalMoisture = 40;
  const aquaData = simulationData.aquaSpngeSoil;
  
  let wateringInterval = 20; // Default fallback
  for (let i = 0; i < aquaData.length; i++) {
    if (aquaData[i] <= criticalMoisture) {
      wateringInterval = i;
      break;
    }
  }

  // Generate next 4 watering dates
  const generateWateringDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 4; i++) {
      const wateringDate = new Date(today);
      wateringDate.setDate(today.getDate() + (wateringInterval * i));
      dates.push(wateringDate);
    }
    
    return dates;
  };

  const wateringDates = generateWateringDates();

  // Generate .ics calendar file
  const generateICS = () => {
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const events = wateringDates.map((date, index) => {
      const endDate = new Date(date);
      endDate.setHours(date.getHours() + 1); // 1-hour event

      return `BEGIN:VEVENT
UID:watering-${index}-${Date.now()}@agri-architect.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(date)}
DTEND:${formatDate(endDate)}
SUMMARY:💧 Water Your Farm (AquaSpnge Schedule)
DESCRIPTION:Time to water your ${soilType} soil using your AquaSpnge plan. This keeps your soil moisture at optimal levels.
LOCATION:Your Farm
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT1H
DESCRIPTION:Water your farm in 1 hour
ACTION:DISPLAY
END:VALARM
END:VEVENT`;
    }).join('\n');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Agri-Architect//Watering Schedule//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:AquaSpnge Watering Schedule
X-WR-TIMEZONE:UTC
${events}
END:VCALENDAR`;

    return icsContent;
  };

  const downloadICS = () => {
    const icsContent = generateICS();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'agri-architect-watering-schedule.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="results-card watering-schedule">
      <h2>📅 Your Watering Schedule</h2>
      
      <div className="schedule-summary">
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          Based on your soil type (<strong>{soilType}</strong>) and the AquaSpnge plan:
        </p>
        <div className="watering-interval-box">
          <span className="interval-label">Water every</span>
          <span className="interval-value">{wateringInterval}</span>
          <span className="interval-label">days</span>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#555', marginTop: '1rem' }}>
          Your improved soil retains moisture much longer, reducing watering frequency and saving time and water costs.
        </p>
      </div>

      <button 
        className="schedule-toggle-btn"
        onClick={() => setShowSchedule(!showSchedule)}
      >
        {showSchedule ? '▼' : '▶'} View Upcoming Watering Dates
      </button>

      {showSchedule && (
        <div className="schedule-details">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Next 4 Watering Events:</h3>
          <ul className="watering-dates-list">
            {wateringDates.map((date, index) => (
              <li key={index} className="watering-date-item">
                <span className="date-number">{index + 1}</span>
                <span className="date-text">{formatDate(date)}</span>
                {index === 0 && <span className="date-badge">Next</span>}
              </li>
            ))}
          </ul>

          <div className="schedule-actions">
            <button onClick={downloadICS} className="download-calendar-btn">
              📥 Download Calendar (.ics)
            </button>
            <p style={{ fontSize: '0.85rem', color: '#777', marginTop: '0.5rem' }}>
              Compatible with Google Calendar, Apple Calendar, Outlook, and more
            </p>
          </div>

          <div className="reminder-section">
            <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>🔔 Set Reminders</h4>
            <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>
              Get notified before each watering event:
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="reminder-btn" disabled>
                📧 Email Reminder (Coming Soon)
              </button>
              <button className="reminder-btn" disabled>
                📱 SMS Reminder (Coming Soon)
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.75rem', fontStyle: 'italic' }}>
              For now, use the calendar download above. Your calendar app can send you notifications.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WateringSchedule;