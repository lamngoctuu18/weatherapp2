import React from 'react';

const QuickStats = ({ data }) => {
  if (!data) return null;

  const stats = [
    {
      label: 'Nhiệt độ',
      value: `${Math.round(data.main.temp)}°C`,
      icon: '🌡️'
    },
    {
      label: 'Cảm nhận',
      value: `${Math.round(data.main.feels_like)}°C`,
      icon: '🤲'
    },
    {
      label: 'Độ ẩm',
      value: `${data.main.humidity}%`,
      icon: '💧'
    },
    {
      label: 'Áp suất',
      value: `${data.main.pressure} hPa`,
      icon: '🔽'
    }
  ];

  return (
    <div className="sidebar-card">
      <h3 style={{
        color: '#ffffff',
        fontSize: '1.2rem',
        fontWeight: '700',
        margin: '0 0 1rem 0',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        ⚡ Thông tin nhanh
      </h3>
      
      <div className="quick-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>
              {stat.icon}
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="info-panel">
        <div style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: '0.9rem',
          lineHeight: 1.4
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>🌪️ Gió:</span>
            <span>{data.wind?.speed || 0} m/s</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>☁️ Mây:</span>
            <span>{data.clouds?.all || 0}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>👁️ Tầm nhìn:</span>
            <span>{data.visibility ? (data.visibility / 1000).toFixed(1) + ' km' : '--'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;