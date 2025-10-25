import React from 'react';

const WeatherInsights = ({ data, hourly }) => {
  if (!data) return null;

  const getWeatherTrend = () => {
    if (!hourly || hourly.length < 3) return null;
    
    const current = data.main.temp;
    const next3h = hourly[2]?.main.temp;
    const next6h = hourly[5]?.main.temp;
    
    if (next3h > current && next6h > next3h) {
      return { trend: 'tăng', icon: '📈', color: '#ff6b6b' };
    } else if (next3h < current && next6h < next3h) {
      return { trend: 'giảm', icon: '📉', color: '#4ecdc4' };
    } else {
      return { trend: 'ổn định', icon: '➡️', color: '#45b7d1' };
    }
  };

  const getWeatherAdvice = () => {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const main = data.weather[0].main;
    
    if (main === 'Rain') return '☔ Nhớ mang ô khi ra ngoài';
    if (temp > 35) return '🔥 Trời rất nóng, hạn chế ra ngoài';
    if (temp < 10) return '🧥 Mặc ấm khi ra ngoài';
    if (humidity > 80) return '💧 Độ ẩm cao, có thể cảm thấy oi bức';
    if (main === 'Clear' && temp > 25) return '☀️ Thời tiết đẹp, thích hợp dạo chơi';
    return '🌤️ Thời tiết bình thường';
  };

  const trend = getWeatherTrend();
  const advice = getWeatherAdvice();

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
        🧠 Phân tích thời tiết
      </h3>
      
      {trend && (
        <div className="info-panel">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            marginBottom: '0.8rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>{trend.icon}</span>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.95rem' }}>
                Xu hướng nhiệt độ
              </div>
              <div style={{ 
                color: trend.color, 
                fontSize: '0.85rem',
                textTransform: 'capitalize'
              }}>
                Nhiệt độ đang {trend.trend}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="info-panel">
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.8rem'
        }}>
          <span style={{ fontSize: '1.2rem', marginTop: '0.1rem' }}>💡</span>
          <div>
            <div style={{ 
              color: '#FFFFFF', 
              fontWeight: '700', 
              fontSize: '0.95rem', 
              marginBottom: '0.3rem',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)'
            }}>
              Lời khuyên
            </div>
            <div style={{ 
              color: '#FFFFFF', 
              fontSize: '0.85rem',
              lineHeight: 1.4,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
              filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))'
            }}>
              {advice}
            </div>
          </div>
        </div>
      </div>
      
      <div className="info-panel">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>📍</span>
          <div>
            <div style={{ 
              color: '#FFFFFF', 
              fontWeight: '700', 
              fontSize: '0.95rem',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)'
            }}>
              Vị trí hiện tại
            </div>
            <div style={{ 
              color: '#FFFFFF', 
              fontSize: '0.85rem',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
              filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))'
            }}>
              {data.name}, {data.sys?.country}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherInsights;