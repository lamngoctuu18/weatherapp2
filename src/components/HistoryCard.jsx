import React from 'react';

const HistoryCard = ({ history, onCitySelect, onClearHistory }) => {
  if (!history || history.length === 0) return null;

  return (
    <div
      className="weather-card modern-card"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        marginTop: "1.5rem",
        animation: "fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        padding: "1.5rem"
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem"
      }}>
        <h3 style={{
          color: "#ffffff",
          fontSize: "1.2rem",
          fontWeight: "700",
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <span>🕒</span>
          Tìm kiếm gần đây
        </h3>
        
        {onClearHistory && (
          <button
            onClick={onClearHistory}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.8)",
              padding: "6px 12px",
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.1)";
              e.target.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
              e.target.style.color = "rgba(255,255,255,0.8)";
            }}
          >
            Xóa
          </button>
        )}
      </div>

      {/* History Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "12px"
      }}>
        {history.map((item, index) => (
          <button
            key={`${item.name}-${index}`}
            onClick={() => onCitySelect(item.name)}
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "12px",
              padding: "12px 8px",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backdropFilter: "blur(10px)",
              textAlign: "center",
              color: "#222"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px) scale(1.02)";
              e.target.style.boxShadow = "0 8px 16px rgba(31,38,135,0.15)";
              e.target.style.background = "rgba(255,255,255,0.95)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.boxShadow = "none";
              e.target.style.background = "rgba(255,255,255,0.9)";
            }}
          >
            <div style={{
              fontWeight: "600",
              fontSize: "0.9rem",
              marginBottom: "4px",
              color: "#1565c0"
            }}>
              {item.name}
            </div>
            <div style={{
              fontSize: "0.8rem",
              color: "#666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px"
            }}>
              🌡️ {item.temp}°C
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryCard;