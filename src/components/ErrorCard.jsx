import React from 'react';

const ErrorCard = ({ message, onRetry }) => {
  return (
    <div
      className="weather-card modern-card"
      style={{
        background: "linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(255,255,255,0.05) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "280px",
        animation: "fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        textAlign: "center"
      }}
    >
      {/* Error Icon */}
      <div style={{
        fontSize: "3rem",
        marginBottom: "1rem",
        filter: "drop-shadow(0 4px 8px rgba(244, 67, 54, 0.3))"
      }}>
        ⚠️
      </div>
      
      {/* Error Title */}
      <h3 style={{
        color: "#ffffff",
        fontSize: "1.3rem",
        fontWeight: "700",
        margin: "0 0 0.5rem 0",
        textShadow: "0 2px 4px rgba(0,0,0,0.3)"
      }}>
        Oops! Có lỗi xảy ra
      </h3>
      
      {/* Error Message */}
      <p style={{
        color: "rgba(255,255,255,0.9)",
        fontSize: "1rem",
        marginBottom: "1.5rem",
        lineHeight: 1.5,
        maxWidth: "300px"
      }}>
        {message || "Không thể tải dữ liệu thời tiết. Vui lòng thử lại."}
      </p>
      
      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "12px 24px",
            border: "none",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            fontWeight: "600",
            fontSize: "0.95rem",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(31,38,135,0.2)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px) scale(1.02)";
            e.target.style.boxShadow = "0 8px 24px rgba(31,38,135,0.25)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0) scale(1)";
            e.target.style.boxShadow = "0 4px 16px rgba(31,38,135,0.2)";
          }}
        >
          🔄 Thử lại
        </button>
      )}
    </div>
  );
};

export default ErrorCard;