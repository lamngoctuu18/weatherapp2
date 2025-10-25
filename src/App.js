import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { WeatherCard, WeatherBackground, QuickStats, WeatherInsights, HistoryCard } from "./components";
import "./App.css";
import "./MobileModern.css";
import "./DesktopModern.css";

const API_KEY = "90ed417a48c3627d0549d3da4910bf2d";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [dailyWeather, setDailyWeather] = useState([]);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("weatherHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const weatherBgRef = useRef(null);
  const [cardKey, setCardKey] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Auto theme theo giờ
  useEffect(() => {
    const hour = new Date().getHours();
    setIsDark(hour >= 18 || hour < 6);
  }, []);

  // Detect mobile responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchWeather = useCallback(async (cityName) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=vi`
      );
      setWeather(res.data);
      setCardKey((k) => k + 1);
      setCity("");
      localStorage.setItem("lastCity", cityName);
      
      // Thêm vào lịch sử
      setHistory(prevHistory => {
        const newHistory = [
          { name: res.data.name, temp: Math.round(res.data.main.temp), time: Date.now() },
          ...prevHistory.filter((item) => item.name !== res.data.name),
        ].slice(0, 10);
        localStorage.setItem("weatherHistory", JSON.stringify(newHistory));
        return newHistory;
      });

      // Fetch hourly forecast
      try {
        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=vi`
        );
        setHourlyWeather(forecastRes.data.list);
        
        // Group by date for daily forecast
        const dailyMap = {};
        forecastRes.data.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0];
          if (!dailyMap[date]) {
            dailyMap[date] = item;
          }
        });
        setDailyWeather(Object.values(dailyMap));
      } catch (error) {
        console.log("Không lấy được dự báo:", error);
      }
    } catch (error) {
      alert("Không tìm thấy thành phố này!");
      setWeather(null);
      setHourlyWeather([]);
      setDailyWeather([]);
    }
  }, []);

  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) fetchWeather(lastCity);
  }, [fetchWeather]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const handleRefresh = () => {
    if (weather && weather.name) {
      fetchWeather(weather.name);
    }
  };

  const getBgByWeather = (weather, isDark) => {
    if (!weather || !weather.weather || !weather.weather[0]) {
      return isDark
        ? "linear-gradient(120deg, #232526 0%, #414345 100%)"
        : "linear-gradient(120deg, #ffe29f 0%, #ffa99f 100%)";
    }
    const main = weather.weather[0].main;
    if (isDark) return "linear-gradient(120deg, #232526 0%, #414345 100%)";
    if (main === "Clear") return "linear-gradient(120deg,rgb(253, 253, 253) 0%,rgb(102, 204, 248) 100%)";
    if (main === "Clouds") return "linear-gradient(120deg, #e0eafc 0%,rgb(9, 87, 143) 100%)";
    if (main === "Rain" || main === "Drizzle") return "linear-gradient(120deg, #b7cbe6 0%, #7fa1c7 100%)";
    if (main === "Thunderstorm") return "linear-gradient(120deg, #616161 0%, #9bc5c3 100%)";
    if (main === "Snow") return "linear-gradient(120deg, #e0eafc 0%, #f7fff7 100%)";
    if (main === "Fog" || main === "Mist") return "linear-gradient(120deg, #dbe6e4 0%, #b7cbe6 100%)";
    return "linear-gradient(120deg, #ffe29f 0%, #ffa99f 100%)";
  };

  const dynamicBg = getBgByWeather(weather, isDark);

  useEffect(() => {
    document.body.style.background = dynamicBg;
    document.body.style.backgroundSize = "200% 200%";
    document.body.style.animation = "gradientMove 18s ease-in-out infinite";
    return () => {
      document.body.style.background = "linear-gradient(120deg, #ffe29f 0%, #ffa99f 100%)";
      document.body.style.backgroundSize = "";
      document.body.style.animation = "";
    };
  }, [dynamicBg]);

  // Lấy vị trí hiện tại
  const handleGeo = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị!");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=vi`
        );
        setCity(res.data.name);
        fetchWeather(res.data.name);
      } catch {
        alert("Không lấy được vị trí!");
      }
    });
  };

  // Tìm kiếm bằng giọng nói
  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Trình duyệt không hỗ trợ tìm kiếm bằng giọng nói!");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setCity(text);
      fetchWeather(text);
    };
    recognition.start();
  };

  // Hàm xác định loại hiệu ứng nền theo weather code
  const getWeatherEffect = (weather) => {
    if (!weather || !weather.weather || !weather.weather[0]) return "clear";
    const code = weather.weather[0].id;
    if (code === 800) return "clear";
    if (code >= 200 && code < 300) return "storm";
    if (code >= 500 && code < 600) return "rain";
    if (code >= 600 && code < 700) return "snow";
    if (code >= 801 && code <= 803) return "cloud";
    if (code === 804) return "cloudy";
    return "clear";
  };

  // Thay đổi background body theo thời tiết
  useEffect(() => {
    if (weather) {
      const effect = getWeatherEffect(weather);
      document.body.className = `weather-${effect}`;
    } else {
      document.body.className = '';
    }
    return () => {
      document.body.className = '';
    };
  }, [weather]);

  // Hiệu ứng nền động theo thời tiết
  useEffect(() => {
    const effect = getWeatherEffect(weather);
    const bgDiv = weatherBgRef.current;
    if (!bgDiv) return;

    // Rain effect
    if (effect === "rain") {
      const canvas = document.createElement("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "1";
      canvas.style.opacity = "0.6";
      bgDiv.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      const drops = [];
      for (let i = 0; i < 100; i++) {
        drops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          l: Math.random() * 20 + 10,
          xs: Math.random() * 4 + 4,
          ys: Math.random() * 10 + 10,
        });
      }

      let animationId;
      function drawRain() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(180,200,255,0.35)";
        ctx.lineWidth = 1.2;
        ctx.lineCap = "round";
        for (let i = 0; i < drops.length; i++) {
          const d = drops[i];
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + d.xs, d.y + d.l);
          ctx.stroke();
          d.x += d.xs;
          d.y += d.ys;
          if (d.y > canvas.height) {
            d.x = Math.random() * canvas.width;
            d.y = -20;
          }
        }
        animationId = requestAnimationFrame(drawRain);
      }
      drawRain();
      return () => {
        cancelAnimationFrame(animationId);
        bgDiv.innerHTML = "";
      };
    }
  }, [weather]);

  // Helper functions
  const getWeatherEmoji = (weather) => {
    if (!weather || !weather.weather || !weather.weather[0]) return "🌤️";
    const code = weather.weather[0].id;
    if (code === 800) return "☀️";
    if (code >= 200 && code < 300) return "⛈️";
    if (code >= 500 && code < 600) return "🌧️";
    if (code >= 600 && code < 700) return "❄️";
    if (code >= 801 && code <= 804) return "☁️";
    return "🌤️";
  };

  const getWeatherAdvice = (weather) => {
    if (!weather) return [];
    const temp = weather.main.temp;
    const condition = weather.weather[0].main.toLowerCase();
    const advice = [];

    if (temp > 35) advice.push({ icon: "🔥", title: "Nhiệt độ rất cao", desc: "Hạn chế ra ngoài, uống nhiều nước" });
    else if (temp > 30) advice.push({ icon: "☀️", title: "Trời nóng", desc: "Mang theo nước và kem chống nắng" });
    else if (temp < 10) advice.push({ icon: "🧥", title: "Trời lạnh", desc: "Mặc ấm khi ra ngoài" });
    
    if (condition.includes("rain")) advice.push({ icon: "☔", title: "Có mưa", desc: "Nhớ mang theo ô" });
    if (condition.includes("storm")) advice.push({ icon: "⚠️", title: "Có bão", desc: "Hạn chế di chuyển" });
    if (weather.wind.speed > 10) advice.push({ icon: "💨", title: "Gió mạnh", desc: "Cẩn thận khi đi xe" });

    return advice;
  };

  // Mobile Layout Component
  const MobileLayout = () => (
    <div className="mobile-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-brand">
          <h1>🌤️ Weather App</h1>
        </div>
        <form onSubmit={handleSubmit} className="mobile-search-form">
          <div className="mobile-search-input-group">
            <input
              type="text"
              placeholder="Nhập tên thành phố..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mobile-search-input"
            />
            <div className="mobile-search-buttons">
              <button
                type="button"
                className="mobile-btn-icon"
                onClick={handleGeo}
                title="GPS"
              >
                📍
              </button>
              <button
                type="button"
                className="mobile-btn-icon"
                onClick={handleVoice}
                title="Giọng nói"
              >
                🎤
              </button>
              <button type="submit" className="mobile-btn-primary" title="Tìm kiếm">
                🔍
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Mobile History */}
      {history.length > 0 && (
        <div className="mobile-history">
          <div className="mobile-history-chips">
            {history.slice(0, 5).map((item) => (
              <div
                key={item.name}
                className="mobile-history-chip"
                onClick={() => fetchWeather(item.name)}
              >
                <span className="mobile-chip-city">{item.name}</span>
                <span className="mobile-chip-temp">{item.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {weather ? (
        <>
          {/* Mobile Main Weather */}
          <div className="mobile-main-weather">
            <div className="mobile-weather-header">
              <h2>{weather.name}</h2>
              <p>{weather.weather[0].description}</p>
            </div>
            <div className="mobile-weather-display">
              <div className="mobile-weather-icon">
                <span>{getWeatherEmoji(weather)}</span>
              </div>
              <div className="mobile-temperature">
                <div className="mobile-temp-main">{Math.round(weather.main.temp)}°</div>
                <div className="mobile-temp-feels">Cảm giác {Math.round(weather.main.feels_like)}°</div>
              </div>
            </div>
          </div>

          {/* Mobile Quick Stats */}
          <div className="mobile-quick-stats">
            <div className="mobile-stat-item">
              <div className="mobile-stat-icon">💧</div>
              <div className="mobile-stat-info">
                <div className="mobile-stat-label">Độ ẩm</div>
                <div className="mobile-stat-value">{weather.main.humidity}%</div>
              </div>
            </div>
            <div className="mobile-stat-item">
              <div className="mobile-stat-icon">💨</div>
              <div className="mobile-stat-info">
                <div className="mobile-stat-label">Gió</div>
                <div className="mobile-stat-value">{weather.wind.speed}m/s</div>
              </div>
            </div>
            <div className="mobile-stat-item">
              <div className="mobile-stat-icon">🌡️</div>
              <div className="mobile-stat-info">
                <div className="mobile-stat-label">Áp suất</div>
                <div className="mobile-stat-value">{weather.main.pressure}hPa</div>
              </div>
            </div>
            <div className="mobile-stat-item">
              <div className="mobile-stat-icon">👁️</div>
              <div className="mobile-stat-info">
                <div className="mobile-stat-label">Tầm nhìn</div>
                <div className="mobile-stat-value">{(weather.visibility / 1000).toFixed(1)}km</div>
              </div>
            </div>
          </div>

          {/* Mobile Analysis */}
          {getWeatherAdvice(weather).length > 0 && (
            <div className="mobile-analysis">
              <h3>💡 Lời khuyên</h3>
              <div className="mobile-analysis-items">
                {getWeatherAdvice(weather).map((item, idx) => (
                  <div key={idx} className="mobile-analysis-item">
                    <div className="mobile-analysis-icon">{item.icon}</div>
                    <div className="mobile-analysis-content">
                      <div className="mobile-analysis-title">{item.title}</div>
                      <div className="mobile-analysis-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Detailed Weather */}
          <div className="mobile-detailed-weather">
            <WeatherCard key={cardKey} data={weather} hourly={hourlyWeather} daily={dailyWeather} />
          </div>
        </>
      ) : (
        <div className="mobile-main-weather" style={{ marginTop: '2rem' }}>
          <div className="mobile-weather-header">
            <h2>Chào mừng! 👋</h2>
            <p>Nhập tên thành phố để xem thông tin thời tiết</p>
          </div>
        </div>
      )}
    </div>
  );

  // Desktop/Mobile conditional rendering
  if (isMobile) {
    return (
      <React.Fragment>
        <WeatherBackground ref={weatherBgRef} />
        <MobileLayout />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <WeatherBackground ref={weatherBgRef} />
      <div className="container">
        {/* Header Section */}
        <div className="app-header">
          <div className="header-content">
            <div className="header-brand">
              <h1>
                <span role="img" aria-label="weather">🌤️</span>
                Weather App
              </h1>
            </div>
            
            <div className="header-search">
              <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder="Nhập tên thành phố..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="search-input"
                  />
                  <div className="search-buttons">
                    <button
                      type="button"
                      className="search-btn-icon"
                      onClick={handleGeo}
                      title="Lấy vị trí hiện tại"
                    >
                      📍
                    </button>
                    <button
                      type="button"
                      className="search-btn-icon"
                      onClick={handleVoice}
                      title="Tìm kiếm bằng giọng nói"
                    >
                      🎤
                    </button>
                    <button type="submit" className="search-btn-primary" title="Tìm kiếm">
                      🔍
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="header-theme">
              <button 
                className="theme-toggle-btn"
                onClick={() => setIsDark((d) => !d)}
                title="Chuyển chế độ sáng/tối"
              >
                {isDark ? "🌙" : "☀️"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="app-sidebar">
          {/* Hiển thị lịch sử tìm kiếm */}
          {history.length > 0 && (
            <div style={{ margin: "1rem 0 0.5rem 0" }}>
              <div style={{ fontWeight: 600, color: "#1976d2", marginBottom: 6 }}>
                Lịch sử tìm kiếm
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  overflowX: "auto",
                  maxWidth: "100%",
                  paddingBottom: 4,
                  scrollbarWidth: "thin",
                }}
              >
                {(showAllHistory ? history : history.slice(0, 4)).map((item) => (
                  <button
                    key={item.name}
                    style={{
                      background: "rgba(255,255,255,0.8)",
                      border: "1px solid #90caf9",
                      borderRadius: 18,
                      padding: "6px 14px",
                      cursor: "pointer",
                      fontWeight: 500,
                      color: "#1976d2",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: "1rem",
                      boxShadow: "0 1px 4px rgba(44,62,80,0.07)",
                      whiteSpace: "nowrap",
                      marginBottom: 2,
                    }}
                    onClick={() => fetchWeather(item.name)}
                    title={`Xem thời tiết ${item.name}`}
                  >
                    <span>{item.name}</span>
                    <span style={{
                      fontWeight: 700,
                      color: item.temp <= 20 ? "#2196f3" : item.temp >= 35 ? "#e53935" : "#fb8c00"
                    }}>
                      {item.temp}°C
                    </span>
                  </button>
                ))}
                {history.length > 4 && (
                  <button
                    style={{
                      background: "#e3f2fd",
                      border: "1px solid #90caf9",
                      borderRadius: 18,
                      padding: "6px 14px",
                      cursor: "pointer",
                      fontWeight: 500,
                      color: "#1976d2",
                      fontSize: "1rem",
                      boxShadow: "0 1px 4px rgba(44,62,80,0.07)",
                      whiteSpace: "nowrap",
                      marginBottom: 2,
                    }}
                    onClick={() => setShowAllHistory((v) => !v)}
                  >
                    {showAllHistory ? "Ẩn bớt" : `+${history.length - 4} Xem thêm`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Stats Component */}
          {weather && (
            <QuickStats data={weather} />
          )}

          {/* History Card */}
          <HistoryCard 
            history={history} 
            onCitySelect={fetchWeather}
            onClearHistory={() => {
              setHistory([]);
              localStorage.removeItem("weatherHistory");
            }}
          />
        </div>

        {/* Main Content Section */}
        <div className="app-main">
          {weather ? (
            <div
              key={cardKey}
              className="weather-card-fade"
              style={{
                transition: "opacity 0.5s, transform 0.5s",
                opacity: 1,
                transform: "translateY(0)",
                willChange: "opacity, transform"
              }}
            >
              <WeatherCard
                data={weather}
                hourly={hourlyWeather}
                daily={dailyWeather}
                onRefresh={handleRefresh}
                bgGradient={dynamicBg}
              />
            </div>
          ) : (
            <div className="weather-card modern-card" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '1.5rem'
            }}>
              <div style={{ 
                fontSize: '5rem', 
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                animation: 'pulse 3s ease-in-out infinite'
              }}>🌤️</div>
              <div>
                <h2 style={{ 
                  color: '#ffffff', 
                  margin: '0 0 0.8rem 0',
                  fontSize: '1.8rem',
                  fontWeight: '600'
                }}>
                  Chào mừng đến với Weather App
                </h2>
                <p style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  fontSize: '1.1rem',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  Nhập tên thành phố để xem thông tin thời tiết chi tiết
                </p>
              </div>
              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.6)'
              }}>
                <span>📍 GPS</span>
                <span>🎤 Giọng nói</span>
                <span>🔍 Tìm kiếm</span>
              </div>
            </div>
          )}
        </div>

        {/* Info Panel Section */}
        <div className="app-info">
          {weather && (
            <WeatherInsights data={weather} hourly={hourlyWeather} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;