import { Activity, Ambulance, CalendarCheck, CreditCard, Pill, ScanLine, Stethoscope, TestTube } from "lucide-react";
import React from "react";

const showroomFAQs = [
  { id: 1, question: "Where is the Outpatient (OP) consultation area located?", Icon: Stethoscope },
  { id: 2, question: "How can I book an appointment with a specialist doctor?", Icon: CalendarCheck },
  { id: 3, question: "Where is the Radiology department for X-rays and scans?", Icon: ScanLine },
  { id: 4, question: "Where can I find the Laboratory for blood tests?", Icon: TestTube },
  { id: 5, question: "Which floor has the ICU and critical care units?", Icon: Activity },
  { id: 6, question: "Where is the Pharmacy to collect prescribed medicines?", Icon: Pill },
  { id: 7, question: "Do you offer cashless insurance or TPA support?", Icon: CreditCard },
  { id: 8, question: "Where is the Emergency department located?", Icon: Ambulance },
];

const FAQ = ({ handleAsk, setShowShowcase, loading }) => {
  const handleQuestionClick = (questionText) => {
    handleAsk(questionText);
    questionText === "I need a gaming laptop. What brands and options do you have?"
      ? setShowShowcase(true)
      : setShowShowcase(false);
  };

  const leftFAQs = showroomFAQs.slice(0, 4);
  const rightFAQs = showroomFAQs.slice(4, 8);

  return (
    <div
      style={{
        position: "absolute",
        top: "112px",
        right: "24px",
        marginTop: "10px",
        marginLeft: "20px",
        width: "95%",
        zIndex: 30,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "12px",
          paddingLeft: "2px",
        }}
      >
        <div
          style={{
            width: "3px",
            height: "20px",
            background: "#0eb48d",
            borderRadius: "2px",
          }}
        />
        <p
          style={{
            color: "#d1d5db",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "3px",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Quick Questions
        </p>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "linear-gradient(90deg, rgba(14,180,141,0.4), transparent)",
          }}
        />
      </div>

      {/* Two-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(16px)",
          borderRadius: "16px",
          padding: "14px",
          border: "1px solid rgba(14,180,141,0.15)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04) inset, 0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {leftFAQs.map((faq) => (
            <FAQButton
              key={faq.id}
              faq={faq}
              loading={loading}
              onClick={handleQuestionClick}
            />
          ))}
        </div>

        {/* Right column with subtle divider */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "-6px",
              top: "10%",
              bottom: "10%",
              width: "1px",
              background:
                "linear-gradient(180deg, transparent, rgba(14,180,141,0.3), transparent)",
            }}
          />
          {rightFAQs.map((faq) => (
            <FAQButton
              key={faq.id}
              faq={faq}
              loading={loading}
              onClick={handleQuestionClick}
            />
          ))}
        </div>
      </div>

      <style>{`
        .faq-btn {
          transition: all 0.2s ease;
        }

        .faq-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(14,180,141,0.85), rgba(10,144,112,0.9)) !important;
          border-color: rgba(14,180,141,0.8) !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(14,180,141,0.3), 0 0 0 1px rgba(14,180,141,0.4) !important;
        }

        .faq-btn:hover:not(:disabled) .faq-icon {
          background: #0a9070 !important;
        }

        .faq-btn:hover:not(:disabled) .faq-text {
          color: #fff !important;
        }

        .faq-btn:active:not(:disabled) {
          transform: translateY(0px) !important;
        }

        .faq-btn:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

const FAQButton = ({ faq, loading, onClick }) => {
  const { Icon } = faq;
  return (
    <button
      className="faq-btn"
      disabled={loading}
      onClick={() => onClick(faq.question)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        textAlign: "left",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "10px",
        padding: "10px 12px",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.3 : 1,
        width: "100%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <span
        className="faq-icon"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "28px",
          height: "28px",
          background: "#0eb48d",
          borderRadius: "7px",
          transition: "background 0.2s ease",
          color: "white",
        }}
      >
        <Icon size={15} strokeWidth={2} />
      </span>
      <span
        className="faq-text"
        style={{
          color: "#cbd5e1",
          fontSize: "15px",
          fontWeight: 500,
          lineHeight: "1.4",
          letterSpacing: "0.2px",
          transition: "color 0.2s ease",
        }}
      >
        {faq.question}
      </span>
    </button>
  );
};

export default FAQ;