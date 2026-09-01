"use client";

import { useState } from "react";
import { X, Ruler, Sparkles, Check } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  selectedSize,
  onSelectSize,
}: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"inches" | "cm">("inches");

  if (!isOpen) return null;

  const sizeChart = [
    {
      size: "XS",
      uk: "6",
      us: "2",
      bustIn: "31 - 33",
      waistIn: "24 - 26",
      hipIn: "34 - 36",
      bustCm: "79 - 84",
      waistCm: "61 - 66",
      hipCm: "86 - 91",
    },
    {
      size: "S",
      uk: "8",
      us: "4",
      bustIn: "33 - 35",
      waistIn: "26 - 28",
      hipIn: "36 - 38",
      bustCm: "84 - 89",
      waistCm: "66 - 71",
      hipCm: "91 - 96",
    },
    {
      size: "M",
      uk: "10",
      us: "6",
      bustIn: "35 - 37",
      waistIn: "28 - 30",
      hipIn: "38 - 40",
      bustCm: "89 - 94",
      waistCm: "71 - 76",
      hipCm: "96 - 101",
    },
    {
      size: "L",
      uk: "12",
      us: "8",
      bustIn: "37 - 40",
      waistIn: "30 - 33",
      hipIn: "40 - 43",
      bustCm: "94 - 101",
      waistCm: "76 - 84",
      hipCm: "101 - 109",
    },
    {
      size: "XL",
      uk: "14",
      us: "10",
      bustIn: "40 - 43",
      waistIn: "33 - 36",
      hipIn: "43 - 46",
      bustCm: "101 - 109",
      waistCm: "84 - 91",
      hipCm: "109 - 117",
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(17, 24, 39, 0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          padding: "clamp(20px, 4vw, 32px)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FF7A54", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>
              <Ruler size={14} />
              <span>ATELIER TAILORING</span>
            </div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "24px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              Size &amp; Fit Guide
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6B7280" }}>
              All silhouettes are designed with relaxed, breathable coastal drapes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#F3F4F6",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#374151",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Unit Toggle Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "12px", color: "#4B5563", fontWeight: 600 }}>Measurements Table</span>
          <div style={{ display: "inline-flex", background: "#F3F4F6", padding: "3px", borderRadius: "8px" }}>
            <button
              type="button"
              onClick={() => setUnit("inches")}
              style={{
                border: "none",
                background: unit === "inches" ? "#FFFFFF" : "transparent",
                color: unit === "inches" ? "var(--ink)" : "#6B7280",
                fontWeight: 700,
                fontSize: "12px",
                padding: "4px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: unit === "inches" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              Inches (in)
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              style={{
                border: "none",
                background: unit === "cm" ? "#FFFFFF" : "transparent",
                color: unit === "cm" ? "var(--ink)" : "#6B7280",
                fontWeight: 700,
                fontSize: "12px",
                padding: "4px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: unit === "cm" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Size Chart Table */}
        <div style={{ overflowX: "auto", border: "1px solid #E5E7EB", borderRadius: "12px", marginBottom: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", color: "#374151", fontWeight: 600 }}>
                <th style={{ padding: "12px 14px" }}>Size</th>
                <th style={{ padding: "12px 14px" }}>UK / US</th>
                <th style={{ padding: "12px 14px" }}>Bust ({unit === "inches" ? "in" : "cm"})</th>
                <th style={{ padding: "12px 14px" }}>Waist ({unit === "inches" ? "in" : "cm"})</th>
                <th style={{ padding: "12px 14px" }}>Hips ({unit === "inches" ? "in" : "cm"})</th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((row) => {
                const isCurrent = selectedSize === row.size;
                return (
                  <tr
                    key={row.size}
                    onClick={() => onSelectSize && onSelectSize(row.size)}
                    style={{
                      borderBottom: "1px solid #F3F4F6",
                      cursor: onSelectSize ? "pointer" : "default",
                      background: isCurrent ? "#FFF7ED" : "transparent",
                      transition: "background 0.15s ease",
                    }}
                  >
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: isCurrent ? "#EA580C" : "var(--ink)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{row.size}</span>
                        {isCurrent && <Check size={14} color="#EA580C" />}
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#6B7280" }}>
                      UK {row.uk} / US {row.us}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#374151" }}>
                      {unit === "inches" ? row.bustIn : row.bustCm}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#374151" }}>
                      {unit === "inches" ? row.waistIn : row.waistCm}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#374151" }}>
                      {unit === "inches" ? row.hipIn : row.hipCm}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Fit Advice & Custom Atelier Tailoring */}
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#166534", fontWeight: 700, fontSize: "12.5px", marginBottom: "4px" }}>
            <Sparkles size={15} />
            <span>Complimentary Bespoke Sizing Available</span>
          </div>
          <p style={{ margin: 0, fontSize: "12px", color: "#15803D", lineHeight: 1.5 }}>
            Between sizes or need custom length? Place your order and mention your measurements or contact our atelier via WhatsApp. We customize fit at zero extra cost.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%",
            background: "var(--ink)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "30px",
            padding: "14px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Space Mono', monospace",
            letterSpacing: "0.5px",
          }}
        >
          {selectedSize ? `CONTINUE WITH SIZE ${selectedSize} →` : "CLOSE SIZE GUIDE"}
        </button>
      </div>
    </div>
  );
}
