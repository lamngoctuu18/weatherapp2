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
            <div className="stat-value" style={{
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
              WebkitTextFillColor: '#FFFFFF',
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
            }}>{stat.value}</div>
            <div className="stat-label" style={{
              color: 'rgba(255, 255, 255, 0.98)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
              WebkitTextFillColor: 'rgba(255, 255, 255, 0.98)'
            }}>{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="info-panel">
        <div style={{
          color: '#FFFFFF',
          fontSize: '0.9rem',
          lineHeight: 1.4
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '0.5rem',
            alignItems: 'center'
          }}>
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.98)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
              fontWeight: '600'
            }}>🌪️ Gió:</span>
            <span style={{
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
              fontWeight: '700',
              filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))'
            }}>{data.wind?.speed || 0} m/s</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '0.5rem',
            alignItems: 'center'
          }}>
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.98)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
              fontWeight: '600'
            }}>☁️ Mây:</span>
            <span style={{
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
              fontWeight: '700',
              filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))'
            }}>{data.clouds?.all || 0}%</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.98)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
              fontWeight: '600'
            }}>👁️ Tầm nhìn:</span>
            <span style={{
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
              fontWeight: '700',
              filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))'
            }}>{data.visibility ? (data.visibility / 1000).toFixed(1) + ' km' : '--'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;