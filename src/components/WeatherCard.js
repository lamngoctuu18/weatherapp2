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
    return { anim: sunnyAnim, style: { top: 18, left: 10, width: 80, height: 80 } };
  }
  if (main === "Clouds") {
    return { anim: cloudyAnim, style: { top: 18, left: 10, width: 80, height: 80 } };
  }
  if (main === "Rain" || main === "Drizzle") {
    return {
      anim: rainAnim,
      style: {
        top: 10,
        left: 10,
        width: 110,
        height: 110,
        filter: "drop-shadow(0 0 8px #2196f3) drop-shadow(0 0 16px #1976d2)"
      }
    };
  }
  if (main === "Snow") {
    return {
      anim: snowAnim,
      style: {
        top: 10,
        left: 10,
        width: 110,
        height: 110,
        filter: "drop-shadow(0 0 8px #2196f3) drop-shadow(0 0 16px #1976d2)"
      }
    };
  }
  if (main === "Fog" || main === "Mist") {
    return {
      anim: fogAnim,
      style: {
        top: 10,
        left: 10,
        width: 110,
        height: 110,
        filter: "drop-shadow(0 0 8px #2196f3) drop-shadow(0 0 16px #1976d2)"
      }
    };
  }
  if (main === "Thunderstorm") {
    return {
      anim: stormAnim,
      style: {
        top: 10,
        left: 10,
        width: 110,
        height: 110,
        filter: "drop-shadow(0 0 8px #2196f3) drop-shadow(0 0 16px #1976d2)"
      }
    };
  }
  return null;
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
  const infoRows = [info.slice(0, 4), info.slice(4, 8)];
  const lastRow = info[8] ? [info[8]] : [];
  const allHours = Array.isArray(hourly) ? hourly : [];

  // Hiệu ứng động Lottie bên trong card theo thời tiết
  const lottie = getLottieEffect(weather[0].main);
  const cardBg = getCardBg(weather[0].main, bgGradient);

  return (
    <div
      className="weather-card"
      style={{
        background: cardBg,
        color: "#222",
        transition: "background 0.5s",
        position: "relative",
        boxShadow: "0 4px 24px 0 rgba(31,38,135,0.13)",
        borderRadius: 16,
        marginTop: "1rem",
        minHeight: 220,
        animation: "fadeIn 0.7s",
        willChange: "transform, box-shadow",
        cursor: "default",
        overflow: "hidden"
      }}
      tabIndex={0}
    >
      {/* Hiệu ứng động Lottie bên trong card */}
      {lottie && (
        <div style={{ position: "absolute", zIndex: 2, pointerEvents: "none", ...lottie.style }}>
          <Lottie animationData={lottie.anim} loop autoplay style={{ width: "100%", height: "100%" }} />
        </div>
      )}
      <h2 style={{ marginTop: 0 }}>{name}</h2>
      <div className="weather-icon" style={{ fontSize: "3.5rem" }}>
        {getWeatherIcon(weather[0].main)}
      </div>
      <p
        style={{
          fontFamily: "'Bebas Neue', 'Poppins', Arial, sans-serif",
          fontSize: "2.7rem",
          fontWeight: 800,
          color: getTempColor(main.temp),
          margin: "0.5rem 0 0.2rem 0",
          letterSpacing: 1,
          transition: "color 0.3s",
          textShadow: "0 2px 8px rgba(33,147,176,0.13)",
        }}
      >
        {Math.round(main.temp)}°C
      </p>
      <p
        style={{
          fontStyle: "normal",
          color: "#2d9cdb",
          margin: 0,
          textTransform: "capitalize",
          fontWeight: 500,
          fontSize: "1.1rem",
          letterSpacing: 0.2,
        }}
      >
        {weather[0].description}
      </p>
      {/* Thông tin chi tiết: 2 hàng 4 cột */}
      <div style={{ margin: "1.1rem 0 0.5rem 0", width: "100%" }}>
        {[...infoRows, lastRow].map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="weather-card-info-row"
          >
            {row.map((item) => (
              <div
                key={item.label}
                className="weather-card-info-box"
                title={item.tip}
              >
                <span className="info-icon">{item.icon}</span>
                <div className="info-label">{item.label}</div>
                <div className="info-value">{item.value}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Dự báo theo giờ: hiển thị đủ 24 mẫu, gồm cả các ngày sau */}
      {allHours && allHours.length > 0 && (
        <div style={{ marginTop: "1.2rem", width: "100%" }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: "#1976d2" }}>
            Dự báo 24h tiếp theo
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              justifyContent: "flex-start",
              paddingBottom: 6,
            }}
          >
            {allHours.map((item, idx) => {
              const date = new Date(item.dt_txt);
              const hour = date.getHours();
              const day = date.getDate();
              const month = date.getMonth() + 1;
              const label =
                idx === 0
                  ? "Bây giờ"
                  : `${hour}h${(idx > 0 && (hour === 0 || idx % 8 === 0)) ? `\n${day}/${month}` : ""}`;
              return (
                <div
                  key={item.dt}
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: 10,
                    padding: "0.5rem 0.7rem",
                    minWidth: 70,
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(44,62,80,0.07)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: idx === 0 ? 700 : 500,
                      color: idx === 0 ? "#1976d2" : "#444",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: "1.5rem" }}>
                    {getWeatherIcon(item.weather[0].main)}
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {Math.round(item.main.temp)}°C
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#1976d2", textTransform: "capitalize", fontStyle: "normal" }}>
                    {item.weather[0].description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Dự báo các ngày tiếp theo */}
      {daily && daily.length > 0 && (
        <div style={{ marginTop: "1.5rem", width: "100%" }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: "#1976d2" }}>
            Dự báo các ngày tới
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              justifyContent: "flex-start",
              paddingBottom: 6,
              scrollSnapType: "x mandatory",
            }}
          >
            {/* Dự báo bây giờ */}
            <div
              style={{
                background: "rgba(255,255,255,0.7)",
                borderRadius: 10,
                padding: "0.7rem 1rem",
                minWidth: 90,
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(44,62,80,0.07)",
                border: "2px solid #1976d2",
                scrollSnapAlign: "start",
                flex: "0 0 auto"
              }}
            >
              <div style={{ fontWeight: 600, color: "#1976d2" }}>Bây giờ</div>
              <div style={{ fontSize: "1.5rem" }}>
                {getWeatherIcon(weather[0].main)}
              </div>
              <div style={{ fontWeight: 700, color: getTempColor(main.temp) }}>
                {Math.round(main.temp)}°C
              </div>
              <div style={{ fontSize: "0.9rem", color: "#1976d2", textTransform: "capitalize", fontStyle: "normal" }}>
                {weather[0].description}
              </div>
            </div>
            {/* Dự báo ngày mai */}
            {daily[0] && (
              <div
                style={{
                  background: "rgba(255,255,255,0.7)",
                  borderRadius: 10,
                  padding: "0.7rem 1rem",
                  minWidth: 90,
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(44,62,80,0.07)",
                  border: "2px solid #fb8c00",
                  scrollSnapAlign: "start",
                  flex: "0 0 auto"
                }}
              >
                <div style={{ fontWeight: 600, color: "#fb8c00" }}>
                  Ngày mai
                </div>
                <div style={{ fontSize: "1.5rem" }}>
                  {getWeatherIcon(daily[0].weather[0].main)}
                </div>
                <div style={{ fontWeight: 700, color: getTempColor(daily[0].main.temp) }}>
                  {Math.round(daily[0].main.temp)}°C
                </div>
                <div style={{ fontSize: "0.9rem", color: "#1976d2", textTransform: "capitalize", fontStyle: "normal" }}>
                  {daily[0].weather[0].description}
                </div>
              </div>
            )}
            {/* Các ngày tiếp theo */}
            {daily.slice(1).map((item) => {
              const date = new Date(item.dt_txt);
              const day = date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });
              return (
                <div
                  key={item.dt}
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: 10,
                    padding: "0.7rem 1rem",
                    minWidth: 90,
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(44,62,80,0.07)",
                    scrollSnapAlign: "start",
                    flex: "0 0 auto"
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#1976d2" }}>{day}</div>
                  <div style={{ fontSize: "1.5rem" }}>
                    {getWeatherIcon(item.weather[0].main)}
                  </div>
                  <div style={{ fontWeight: 700, color: getTempColor(item.main.temp) }}>
                    {Math.round(item.main.temp)}°C
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#1976d2", textTransform: "capitalize", fontStyle: "normal" }}>
                    {item.weather[0].description}
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
