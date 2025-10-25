import React, { useMemo } from "react";
import getWeatherIcon from "../utils/getWeatherIcon";
import Lottie from "lottie-react";
import sunnyAnim from "../assets/lottie/Animation - 1748926459864.json";
import cloudyAnim from "../assets/lottie/Animation - 1748927475429.json";
import rainAnim from "../assets/lottie/Animation - 1748926672917.json";
import snowAnim from "../assets/lottie/Animation - 1749001725347.json";
import fogAnim from "../assets/lottie/Animation - 1749002093829.json";
import stormAnim from "../assets/lottie/Animation - 1748926736337.json";
import useUVI from "../hooks/useUVI";

function formatTime(unix) {
  if (!unix) return "--:--";
  const date = new Date(unix * 1000);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
}

function getTempColor(temp) {
  if (temp <= 20) return "#2196f3";
  if (temp >= 35) return "#e53935";
  return "#fb8c00";
}

function getLottieEffect(main) {
  if (main === "Clear") {
    return { anim: sunnyAnim, style: { top: 10, right: 10, width: 50, height: 50, opacity: 0.4 } };
  }
  if (main === "Clouds") {
    return { anim: cloudyAnim, style: { top: 10, right: 10, width: 50, height: 50, opacity: 0.4 } };
  }
  if (main === "Rain" || main === "Drizzle") {
    return {
      anim: rainAnim,
      style: {
        top: 10,
        right: 10,
        width: 55,
        height: 55,
        opacity: 0.5,
        filter: "drop-shadow(0 0 3px #2196f3)"
      }
    };
  }
  if (main === "Snow") {
    return {
      anim: snowAnim,
      style: {
        top: 10,
        right: 10,
        width: 55,
        height: 55,
        opacity: 0.5,
        filter: "drop-shadow(0 0 4px #b3e5fc)"
      }
    };
  }
  if (main === "Fog" || main === "Mist") {
    return {
      anim: fogAnim,
      style: {
        top: 10,
        right: 10,
        width: 50,
        height: 50,
        opacity: 0.4
      }
    };
  }
  if (main === "Thunderstorm") {
    return {
      anim: stormAnim,
      style: {
        top: 10,
        right: 10,
        width: 60,
        height: 60,
        opacity: 0.6,
        filter: "drop-shadow(0 0 6px #ff9800)"
      }
    };
  }
  return { anim: cloudyAnim, style: { top: 20, right: 20, width: 60, height: 60, opacity: 0.6 } };
}

function getCardBg(main, bgGradient) {
  if (main === "Rain" || main === "Drizzle") return "rgba(180,190,200,0.55)";
  return bgGradient || "rgba(255,255,255,0.35)";
}

const WeatherCard = ({ data, hourly = [], daily = [], onRefresh, bgGradient }) => {
  const uvi = useUVI(data?.coord);

  // Tránh render lại không cần thiết
  const info = useMemo(() => {
    if (!data) return [];
    const main = data.main;
    return [
      { icon: "🌡️", label: "Cảm nhận", value: `${Math.round(main.feels_like)}°C`, tip: "Nhiệt độ cảm nhận" },
      { icon: "💧", label: "Độ ẩm", value: `${main.humidity}%`, tip: "Độ ẩm không khí" },
      { icon: "💨", label: "Gió", value: `${data.wind?.speed} m/s`, tip: "Tốc độ gió" },
      { icon: "🔽", label: "Áp suất", value: `${main.pressure} hPa`, tip: "Áp suất khí quyển" },
      { icon: "☁️", label: "Mây", value: `${data.clouds ? data.clouds.all : 0}%`, tip: "Tỷ lệ mây che phủ" },
      { icon: "🌧️", label: "Mưa", value: `${data.rain && data.rain["1h"] ? data.rain["1h"] : 0} mm`, tip: "Lượng mưa 1h gần nhất" },
      { icon: "🔆", label: "UV", value: uvi !== null ? uvi : "--", tip: "Chỉ số tia cực tím" },
      { icon: "👁️", label: "Tầm nhìn", value: data.visibility ? (data.visibility / 1000).toFixed(1) + " km" : "--", tip: "Tầm nhìn xa" },
      { icon: "🌇", label: "Mặt trời lặn", value: formatTime(data.sys?.sunset), tip: "Giờ mặt trời lặn" },
    ];
  }, [data, uvi]);

  if (!data) return null;

  const main = data.main;
  const weather = data.weather;
  const name = data.name;
  // const infoRows = [info.slice(0, 4), info.slice(4, 8)];
  // const lastRow = info[8] ? [info[8]] : [];
  const allHours = Array.isArray(hourly) ? hourly : [];

  // Hiệu ứng động Lottie bên trong card theo thời tiết
  const lottie = getLottieEffect(weather[0].main);
  const cardBg = getCardBg(weather[0].main, bgGradient);

  return (
    <div
      className="weather-card modern-card"
      style={{
        background: `linear-gradient(135deg, ${cardBg} 0%, rgba(255,255,255,0.2) 100%)`,
        color: "#222",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        boxShadow: "0 8px 32px rgba(31,38,135,0.15), 0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: 24,
        marginTop: "1rem",
        minHeight: 280,
        animation: "fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform, box-shadow",
        cursor: "default",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(20px)"
      }}
      tabIndex={0}
    >
      {/* Hiệu ứng động Lottie bên trong card */}
      {lottie && (
        <div style={{ position: "absolute", zIndex: 2, pointerEvents: "none", ...lottie.style }}>
          <Lottie animationData={lottie.anim} loop autoplay style={{ width: "100%", height: "100%" }} />
        </div>
      )}
      {/* Header Section - Compact */}
      <div className="weather-header" style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        width: "100%",
        marginBottom: "1rem",
        padding: "1rem",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "16px",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        position: "relative",
        zIndex: 5
      }}>
        <div style={{ flex: 1, zIndex: 6 }}>
          <h2 style={{ 
            marginTop: 0, 
            marginBottom: "0.3rem",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "#ffffff",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            letterSpacing: "0.5px"
          }}>{name}</h2>
          <p style={{
            fontStyle: "normal",
            color: "rgba(255,255,255,0.9)",
            margin: 0,
            textTransform: "capitalize",
            fontWeight: 500,
            fontSize: "1rem",
            letterSpacing: 0.3,
            textShadow: "0 1px 4px rgba(0,0,0,0.3)"
          }}>
            {weather[0].description}
          </p>
        </div>
        <div style={{ 
          display: "flex", 
          alignItems: "center",
          gap: "0.8rem",
          zIndex: 6
        }}>
          <div className="weather-icon" style={{ 
            fontSize: "2.5rem", 
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))"
          }}>
            {getWeatherIcon(weather[0].main)}
          </div>
          <p style={{
            fontFamily: "'Bebas Neue', 'Poppins', Arial, sans-serif",
            fontSize: "2.2rem",
            fontWeight: 800,
            color: getTempColor(main.temp),
            margin: 0,
            letterSpacing: 1,
            transition: "color 0.3s",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}>
            {Math.round(main.temp)}°C
          </p>
        </div>
      </div>
      {/* Thông tin chi tiết: Optimized Grid */}
      <div style={{ 
        margin: "1rem 0", 
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px",
        position: "relative",
        zIndex: 10
      }}>
        {info.slice(0, 6).map((item) => (
          <div
            key={item.label}
            className="weather-card-info-box modern-info-box"
            title={item.tip}
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
              borderRadius: "16px",
              padding: "1rem 0.8rem",
              textAlign: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(20px)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              position: "relative"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px) scale(1.02)";
              e.target.style.background = "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)";
              e.target.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.background = "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)";
              e.target.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
          >
            <span className="info-icon" style={{ 
              fontSize: "1.5rem", 
              display: "block", 
              marginBottom: "0.5rem",
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
            }}>{item.icon}</span>
            <div className="info-label" style={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.98)",
              fontWeight: 700,
              marginBottom: "0.3rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              textShadow: "0 2px 6px rgba(0,0,0,0.9)"
            }}>{item.label}</div>
            <div className="info-value" style={{
              fontWeight: 700,
              fontSize: "1rem",
              color: "#FFFFFF",
              textShadow: "0 2px 10px rgba(0,0,0,0.9)",
              filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))",
              WebkitTextFillColor: "#FFFFFF"
            }}>{item.value}</div>
          </div>
        ))}
      </div>
      
      {/* Thông tin bổ sung */}
      {info.length > 6 && (
        <div style={{ 
          margin: "0.5rem 0", 
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          position: "relative",
          zIndex: 10
        }}>
          {info.slice(6, 9).map((item) => (
            <div
              key={item.label}
              className="weather-card-info-box modern-info-box"
              title={item.tip}
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
                borderRadius: "14px",
                padding: "0.8rem 0.6rem",
                textAlign: "center",
                boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(15px)",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.background = "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.background = "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)";
              }}
            >
              <span className="info-icon" style={{ 
                fontSize: "1.2rem", 
                display: "block", 
                marginBottom: "0.3rem" 
              }}>{item.icon}</span>
              <div className="info-label" style={{
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.98)",
                fontWeight: 700,
                marginBottom: "0.2rem",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                textShadow: "0 2px 6px rgba(0,0,0,0.9)"
              }}>{item.label}</div>
              <div className="info-value" style={{
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#FFFFFF",
                textShadow: "0 2px 10px rgba(0,0,0,0.9)",
                filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))",
                WebkitTextFillColor: "#FFFFFF"
              }}>{item.value}</div>
            </div>
          ))}
        </div>
      )}
      {/* Dự báo theo giờ: Compact */}
      {allHours && allHours.length > 0 && (
        <div style={{ marginTop: "1rem", width: "100%" }}>
          <div style={{ 
            fontWeight: 600, 
            marginBottom: "0.8rem", 
            color: "#ffffff",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span>🕐</span>
            Dự báo 24h
          </div>
          <div
            className="hourly-forecast-container"
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 12,
              scrollSnapType: "x mandatory",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.4) rgba(255,255,255,0.1)"
            }}
          >
            {allHours.slice(0, 12).map((item, idx) => {
              const date = new Date(item.dt_txt);
              const hour = date.getHours();
              const label = idx === 0 ? "Bây giờ" : `${hour}h`;
              return (
                <div
                  key={item.dt}
                  className="hourly-item"
                  style={{
                    background: idx === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: "0.8rem 0.6rem",
                    minWidth: 70,
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: idx === 0 ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    scrollSnapAlign: "start",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.background = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.background = idx === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.1)";
                  }}
                >
                  <div style={{
                    fontWeight: idx === 0 ? 700 : 500,
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    marginBottom: "0.5rem"
                  }}>
                    {label}
                  </div>
                  <div style={{ 
                    fontSize: "1.5rem", 
                    margin: "0.3rem 0",
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
                  }}>
                    {getWeatherIcon(item.weather[0].main)}
                  </div>
                  <div style={{ 
                    fontWeight: 700, 
                    fontSize: "0.9rem",
                    color: getTempColor(item.main.temp),
                  }}>
                    {Math.round(item.main.temp)}°C
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Dự báo các ngày tiếp theo */}
      {daily && daily.length > 0 && (
        <div style={{ marginTop: "1rem", width: "100%" }}>
          <div style={{ 
            fontWeight: 600, 
            marginBottom: "0.8rem", 
            color: "#ffffff",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span>📅</span>
            Dự báo 7 ngày
          </div>
          <div
            className="daily-forecast-container"
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 12,
              scrollSnapType: "x mandatory",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.4) rgba(255,255,255,0.1)"
            }}
          >
            {/* Dự báo bây giờ */}
            <div
              className="daily-item current"
              style={{
                background: "rgba(33, 150, 243, 0.12)",
                borderRadius: 8,
                padding: "0.6rem 0.5rem",
                minWidth: 75,
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "1px solid rgba(33, 150, 243, 0.2)",
                scrollSnapAlign: "start",
                flex: "0 0 auto",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.background = "rgba(33, 150, 243, 0.18)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.background = "rgba(33, 150, 243, 0.12)";
              }}
            >
              <div style={{ 
                fontWeight: 600, 
                color: "#ffffff", 
                fontSize: "0.7rem",
                marginBottom: "0.3rem"
              }}>Bây giờ</div>
              <div style={{ 
                fontSize: "1.5rem", 
                margin: "0.2rem 0",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
              }}>
                {getWeatherIcon(weather[0].main)}
              </div>
              <div style={{ 
                fontWeight: 700, 
                color: getTempColor(main.temp), 
                fontSize: "0.9rem"
              }}>
                {Math.round(main.temp)}°C
              </div>
            </div>
            
            {/* Dự báo ngày mai */}
            {daily[0] && (
              <div
                className="daily-item tomorrow"
                style={{
                  background: "rgba(251, 140, 0, 0.12)",
                  borderRadius: 8,
                  padding: "0.6rem 0.5rem",
                  minWidth: 75,
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(251, 140, 0, 0.2)",
                  scrollSnapAlign: "start",
                  flex: "0 0 auto",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.background = "rgba(251, 140, 0, 0.18)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.background = "rgba(251, 140, 0, 0.12)";
                }}
              >
                <div style={{ 
                  fontWeight: 600, 
                  color: "#ffffff", 
                  fontSize: "0.7rem",
                  marginBottom: "0.3rem"
                }}>
                  Ngày mai
                </div>
                <div style={{ 
                  fontSize: "1.5rem", 
                  margin: "0.2rem 0",
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
                }}>
                  {getWeatherIcon(daily[0].weather[0].main)}
                </div>
                <div style={{ 
                  fontWeight: 700, 
                  color: getTempColor(daily[0].main.temp), 
                  fontSize: "0.9rem"
                }}>
                  {Math.round(daily[0].main.temp)}°C
                </div>
              </div>
            )}
            
            {/* Các ngày tiếp theo */}
            {daily.slice(1, 6).map((item) => {
              const date = new Date(item.dt_txt);
              const day = date.toLocaleDateString("vi-VN", { weekday: "short" });
              return (
                <div
                  key={item.dt}
                  className="daily-item"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    padding: "0.6rem 0.5rem",
                    minWidth: 75,
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    scrollSnapAlign: "start",
                    flex: "0 0 auto",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.background = "rgba(255,255,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.background = "rgba(255,255,255,0.08)";
                  }}
                >
                  <div style={{ 
                    fontWeight: 600, 
                    color: "#ffffff", 
                    fontSize: "0.7rem",
                    marginBottom: "0.3rem"
                  }}>{day}</div>
                  <div style={{ 
                    fontSize: "1.5rem", 
                    margin: "0.2rem 0",
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
                  }}>
                    {getWeatherIcon(item.weather[0].main)}
                  </div>
                  <div style={{ 
                    fontWeight: 700, 
                    color: getTempColor(item.main.temp), 
                    fontSize: "0.9rem"
                  }}>
                    {Math.round(item.main.temp)}°C
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
