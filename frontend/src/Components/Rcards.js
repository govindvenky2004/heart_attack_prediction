import React from "react";

// Sample card data (replace or expand as needed)
const cardData = [
  {
    imgSrc: "https://tse3.mm.bing.net/th/id/OIP.uOJ5td_PCz8J2uS5FzPnhAHaEK?pid=Api&P=0&h=180",
    title: "Dr CN Manjunath : ಸರ್ ಹೃದಯಾಘಾತದ ಲಕ್ಷಣಗಳೇನು..?",
    text: "The #1 Best Remedy to Prevent a Heart Attack for $3.19",
    link: "https://www.youtube.com/watch?v=m_VaOug5AR4",
  },
  {
    imgSrc: "https://i.ytimg.com/vi/DUaxt8OlT3o/hq720.jpg?sqp=-oaymwFBCNAFEJQDSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGGUgRChKMA8=&rs=AOn4CLCTFgAKr-1CeDLe6Y9vYyQPymsNDg",
    title: "CPR in Action | A 3D look inside the body",
    text: "2014 • Sci-Fi • 5⭐\nA journey through space and time by Christopher Nolan.",
    link: "https://www.youtube.com/watch?v=DUaxt8OlT3oE",
  },
  {
    imgSrc: "https://i.ytimg.com/vi/xq01MiHIZLs/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDEN04ajiRuVklqLrfaWb0oXTr-Tw",
    title: "Can Exercise Prevent Heart Attacks?",
    text: "2012 • Thriller • 4.5⭐\nA time-travel crime drama starring Joseph Gordon-Levitt.",
    link: "https://www.youtube.com/watch?v=xq01MiHIZLs",
  },
  {
    imgSrc: "https://i.ytimg.com/vi/Kjy0IlnQDSU/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCaeFxr6_qUerwoE9YXPrPhFrU2ow",
    title: "Heart Attack Every 40 Seconds in the US | What Really Happens",
    text: "2014 • Horror • 4⭐\nA terrifying adventure beneath the streets of Paris.",
    link: "https://www.youtube.com/watch?v=Kjy0IlnQDSU",
  },
  {
    imgSrc: "https://i.ytimg.com/vi/IZ8ThdPyB68/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCAN6W0g3lefXQxmpsjhe-RTz77NA",
    title: "Top 10 Veggies Seniors MUST Eat to Prevent Stroke",
    text: "2017 • Fantasy • 4⭐\nA gritty buddy cop movie set in a magical world.",
    link: "https://www.youtube.com/watch?v=IZ8ThdPyB68",
  },
  {
    imgSrc: "https://i.ytimg.com/vi/R0kS26BA5BY/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLA-Jovw7qE1JgXFgkrw0zc74VMMCg",
    title: "The #1 Best Remedy to Prevent a Heart Attack for $3.19",
    text: "2018 • Superhero • 5⭐\nMarvel heroes assemble against Thanos in an epic clash.",
    link: "https://www.youtube.com/watch?v=R0kS26BA5BY",
  },
];

export default function VideoCardsReference() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Live Wallpaper Layer */}
      <div
        style={{
          position: "fixed",
          top: 10, left: 0, width: "100vw", height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {/* Example: animated CSS particles, or swap for a <video> or <img> for gif animation */}
        <div className="live-wallpaper"></div>
      </div>

      {/* Main Section Container */}
      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        justifyContent: "center",
        padding: "70px 0 40px 0",
      }}>
        <div
          style={{
            background: "rgba(18,18,18,0.97)",
            borderRadius: 18,
            maxWidth: 1250,
            margin: "0 28px",
            width: "100%",
            boxShadow: "0 8px 38px 0 rgba(0,0,0,0.21)",
            padding: "38px 0 34px 0",
          }}
        >
          <h2
            style={{
              color: "gold",
              textAlign: "center",
              marginBottom: 35,
              fontWeight: 700,
              letterSpacing: 1,
              fontSize: "2.1rem",
            }}
          >
            Recomended Videos.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(310px,1fr))",
              gap: 32,
              justifyContent: "center",
              padding: "0 2vw",
            }}
          >
            {cardData.map(({ imgSrc, title, text, link }, idx) => (
              <div
                key={idx}
                style={{
                  background: "#181818",
                  border: "2.5px solid gold",
                  borderRadius: 18,
                  boxShadow: "0 6px 24px rgba(0,0,0,0.28)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transition: "transform 0.16s, box-shadow 0.16s",
                  minHeight: 420,
                  margin: "auto",
                  width: "100%",
                  maxWidth: 340,
                }}
              >
                <img
                  src={imgSrc}
                  alt={title}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    borderBottom: "1.5px solid gold",
                    background: "#222",
                  }}
                />
                <div style={{ padding: "26px 18px 18px 18px", width: "100%" }}>
                  <h4
                    style={{
                      color: "gold",
                      fontSize: "1.16rem",
                      fontWeight: "bold",
                      margin: "0 0 10px 0",
                      letterSpacing: 0.5,
                    }}
                  >
                    {title}
                  </h4>
                  <p
                    style={{
                      color: "#ddd",
                      fontSize: "1rem",
                      margin: "0 0 18px 0",
                      minHeight: 58,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {text}
                  </p>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "gold",
                      color: "#121212",
                      fontWeight: 600,
                      padding: "10px 20px",
                      borderRadius: 6,
                      textDecoration: "none",
                      display: "inline-block",
                      boxShadow: "0 2px 7px rgba(0,0,0,0.08)",
                      transition: "background 0.16s, color 0.16s",
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = "#d4af37";
                      e.currentTarget.style.color = "#000";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = "gold";
                      e.currentTarget.style.color = "#121212";
                    }}
                  >
                    Watch Video
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
}
