import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { WeatherCard, WeatherBackground } from "./components";
import "./App.css";

const API_KEY = "90ed417a48c3627d0549d3da4910bf2d";

// Hàm map weather icon code sang lottie type
function mapWeatherIconToType(iconCode) {
  if (!iconCode) return 'cloudy';
  if (iconCode.includes('01')) return 'sunny';
  if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return 'cloudy';
  if (iconCode.includes('09')) return 'rainy';
  if (iconCode.includes('10')) return 'rain';
  if (iconCode.includes('11')) return 'storm';
  if (iconCode.includes('13')) return 'snow';
  if (iconCode.includes('50')) return 'fog';
  if (iconCode.includes('n')) return 'night';
  return 'cloudy';
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [dailyWeather, setDailyWeather] = useState([]); // Thêm state lưu dự báo ngày
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("weatherHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const weatherBgRef = useRef(null);
  const [cardKey, setCardKey] = useState(0); // key để trigger hiệu ứng

  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) fetchWeather(lastCity);
  }, []);

  // Auto theme theo giờ
  useEffect(() => {
    const hour = new Date().getHours();
    setIsDark(hour >= 18 || hour < 6);
  }, []);

  const fetchWeather = async (cityName) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=vi`
      );
      setWeather(res.data);
      setCardKey((k) => k + 1); // Thay đổi key để hiệu ứng chuyển động
      localStorage.setItem("lastCity", cityName);

      // Lấy dữ liệu dự báo theo giờ và ngày
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=vi`
      );
      // Lấy 24 mẫu tiếp theo (3h/mẫu, đủ 3 ngày)
      setHourlyWeather(forecastRes.data.list.slice(0, 24));

      // Xử lý dự báo ngày (lấy 1 mẫu mỗi ngày, thường là mẫu 12:00)
      const dailyMap = {};
      forecastRes.data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        const hour = item.dt_txt.split(" ")[1].split(":")[0];
        // Ưu tiên mẫu 12:00, nếu không có thì lấy mẫu đầu tiên của ngày
        if (!dailyMap[date] || hour === "12") {
          dailyMap[date] = item;
        }
      });
      // Lấy 5 ngày tiếp theo (bỏ ngày hiện tại)
      const today = new Date().toISOString().split("T")[0];
      const dailyArr = Object.keys(dailyMap)
        .filter((date) => date !== today)
        .slice(0, 5)
        .map((date) => dailyMap[date]);
      setDailyWeather(dailyArr);

      // Cập nhật lịch sử tìm kiếm
      setHistory((prev) => {
        const filtered = prev.filter(
          (item) => item.name.toLowerCase() !== res.data.name.toLowerCase()
        );
        const newHistory = [
          {
            name: res.data.name,
            temp: Math.round(res.data.main.temp),
          },
          ...filtered,
        ].slice(0, 8); // Giới hạn 8 thành phố gần nhất
        localStorage.setItem("weatherHistory", JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (error) {
      alert("Không tìm thấy thành phố!");
      setWeather(null);
      setHourlyWeather([]);
      setDailyWeather([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  // Hàm làm mới dữ liệu thời tiết cho thành phố hiện tại
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
    if (code >= 801 && code <= 803) return "cloud";
    if (code === 804) return "cloudy";
    return "clear";
  };

  // Hiệu ứng nền động theo thời tiết
  useEffect(() => {
    const effect = getWeatherEffect(weather);
    const bgDiv = weatherBgRef.current;
    if (!bgDiv) return;

    // Xóa hiệu ứng cũ
    bgDiv.innerHTML = "";

    if (effect === "rain") {
      const canvas = document.createElement("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = "fixed";
      canvas.style.top = 0;
      canvas.style.left = 0;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = 0;
      bgDiv.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      const drops = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        l: 10 + Math.random() * 15,
        xs: -2 + Math.random() * 4,
        ys: 8 + Math.random() * 8,
      }));

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

  const weatherType = weather && weather.weather && weather.weather[0]
    ? mapWeatherIconToType(weather.weather[0].icon)
    : 'cloudy';

  return (
    <>
      <div className="container" style={{ position: "relative", overflow: "hidden" }}>
        <WeatherBackground weatherType={weatherType} />
        <h1>
          Weather App
          <span
            style={{
              marginLeft: 12,
              cursor: "pointer",
              fontSize: 22,
              verticalAlign: "middle"
            }}
            title="Chuyển chế độ sáng/tối"
            onClick={() => setIsDark((d) => !d)}
          >
            {isDark ? "🌙" : "☀️"}
          </span>
        </h1>
        <form onSubmit={handleSubmit} className="form-search-bar">
          <input
            type="text"
            placeholder="Nhập tên thành phố "
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {/* Nút định vị GPS */}
          <button
            type="button"
            className="icon-btn gps"
            onClick={handleGeo}
            title="Lấy vị trí hiện tại"
          >
            <span className="circle">
              <span className="icon" role="img" aria-label="gps">🧭</span>
            </span>
          </button>
          {/* Nút micro tìm kiếm giọng nói */}
          <button
            type="button"
            className="icon-btn voice"
            onClick={handleVoice}
            title="Tìm kiếm bằng giọng nói"
          >
            <span className="circle">
              <span className="icon" role="img" aria-label="micro">🎤</span>
            </span>
          </button>
          {/* Nút tìm kiếm */}
          <button type="submit" className="search-btn" title="Tìm kiếm">
            <span className="icon" role="img" aria-label="search">🔍</span>
          </button>
        </form>
        {/* Hiển thị lịch sử tìm kiếm dạng scroll ngang, tối đa 4 mục, còn lại ẩn */}
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
        {/* Thay WeatherCard bằng div bọc hiệu ứng */}
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
      </div>
    </>
  );
}

export default App;
