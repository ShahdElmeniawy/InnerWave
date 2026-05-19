"use client";
const ArtistsImage = ({IMAGS, name}) => {
  return (
    <div
      style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        overflow: "hidden",
        margin: "0 auto 10px",
        border: "2px solid var(--border)",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "var(--accent)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--border)")
      }
    >
      <img
        src={String(IMAGS)}
        alt={name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export default ArtistsImage;
