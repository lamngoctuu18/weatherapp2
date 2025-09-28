import React from 'react';

const LoadingCard = () => {
  return (
    <div
      className="weather-card modern-card loading"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "280px",
        animation: "fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      {/* Loading Animation */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "1.5rem"
      }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              animation: `pulse 1.5s infinite ${i * 0.2}s`,
              boxShadow: "0 4px 8px rgba(31,38,135,0.3)"
            }}
          />
        ))}
      </div>
      
      {/* Loading Text */}
      <h3 style={{
        color: "#ffffff",
        fontSize: "1.2rem",
        fontWeight: "600",
        textAlign: "center",
        margin: 0,
        textShadow: "0 2px 4px rgba(0,0,0,0.3)"
      }}>
        Đang tải dữ liệu thời tiết...
      </h3>
      
      {/* Loading Description */}
      <p style={{
        color: "rgba(255,255,255,0.8)",
        fontSize: "0.9rem",
        textAlign: "center",
        marginTop: "0.5rem",
        margin: 0
      }}>
        Vui lòng chờ một chút
      </p>
    </div>
  );
};

export default LoadingCard;