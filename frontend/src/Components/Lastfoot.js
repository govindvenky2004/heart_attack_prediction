import React from "react";

export default function Lastfoot() {
  return (
    <footer
      style={{
        width: "100%",
        background: "#111",
        color: "#fff",
        padding: "170px 0 130px 0", // Increased height
        fontFamily: "'Inter', Arial, Helvetica, sans-serif",
        minHeight: "390px",
      }}
    >
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {/* Left: Logo + Branding + About */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <img
              src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/4d1fa457433889.59d58301d9bb2.png"
              alt="SharkBite Logo"
              style={{
                height: 64,
                width: "auto",
                marginRight: 16,
                borderRadius: 10,
                background: "#fff"
              }}
            />
            <span
              style={{
                fontSize: "3.25rem",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: -2,
              }}
            >
              SharkBite
            </span>
          </div>
          <div
            style={{
              fontSize: "1.05rem",
              color: "#cfcfcf",
              opacity: 0.85,
              fontWeight: 500,
              letterSpacing: 1,
              marginBottom: 28,
              marginLeft: 6,
            }}
          >
            Solutions and private limited
          </div>
          <div
            style={{
              background: "#181818",
              borderRadius: 11,
              padding: "22px 30px 18px 22px",
              maxWidth: 430,
              color: "#fafafa",
              fontSize: "1.09rem",
              fontWeight: 400,
              lineHeight: 1.65,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>About</div>
            <div>
              <span style={{ opacity: 0.85, fontWeight: 500 }}>
                Founder: Amruth M
              </span>
              <br />
              <span>
                SharkBite is dedicated to delivering innovative and reliable digital solutions for every business need. Our experienced team ensures quality and privacy at every step, empowering clients to succeed and grow.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Social Media Icons + Partners */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            minWidth: 300,
            marginTop: 18,
          }}
        >
          <div
            style={{
              fontSize: "1.14rem",
              color: "#cfcfcf",
              letterSpacing: 1,
              marginBottom: 20,
              fontWeight: 500,
              opacity: 0.85,
            }}
          >
            CONNECT WITH US
          </div>
          <div
            style={{
              display: "flex",
              gap: 30,
              fontSize: 0,
              marginBottom: 28,
            }}
          >
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              style={{ display: "inline-block" }}
            >
              <svg width="36" height="36" fill="#fff" style={{ transition: 'fill 0.2s' }} viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill="#222" />
                <path d="M18.67 13.883V12.418c0-.429.036-.667.666-.667h1.084V9.3h-2.031c-2.05 0-2.706.936-2.706 2.499V13.9h-1.235v2.38h1.236V22h2.48v-5.72h1.698l.28-2.38h-1.978z" fill="#fff" />
              </svg>
            </a>
            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Twitter"
              style={{ display: "inline-block" }}
            >
              <svg width="36" height="36" fill="#fff" style={{ transition: 'fill 0.2s' }} viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill="#222" />
                <path d="M25.398 11.024c-.55.244-1.146.409-1.77.484a3.062 3.062 0 0 0 1.342-1.692 6.067 6.067 0 0 1-1.933.738A3.056 3.056 0 0 0 16.09 14.25a8.67 8.67 0 0 1-6.293-3.193 3.065 3.065 0 0 0 .948 4.088c-.49-.015-.95-.15-1.352-.374v.038c0 1.503 1.07 2.759 2.491 3.044a3.073 3.073 0 0 1-1.349.05c.38 1.186 1.481 2.05 2.788 2.075A6.142 6.142 0 0 1 8 22.198c.725.047 1.444.054 2.167 0A8.681 8.681 0 0 0 24 13.07c0-.132-.004-.264-.011-.395a6.25 6.25 0 0 0 1.545-1.65z" fill="#fff" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              style={{ display: "inline-block" }}
            >
              <svg width="36" height="36" fill="#fff" style={{ transition: 'fill 0.2s' }} viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill="#222" />
                <g>
                  <circle cx="16" cy="16" r="5" stroke="#fff" strokeWidth="2" fill="none" />
                  <circle cx="22.1" cy="9.9" r="1" fill="#fff" />
                </g>
                <rect x="10" y="10" width="12" height="12" rx="4" fill="none" stroke="#fff" strokeWidth="2" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
              style={{ display: "inline-block" }}
            >
              <svg width="36" height="36" fill="#fff" style={{ transition: 'fill 0.2s' }} viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill="#222" />
                <path d="M24.375 13.1a1.85 1.85 0 0 0-1.3-1.306C21.72 11.25 16 11.25 16 11.25s-5.721 0-7.075.544A1.85 1.85 0 0 0 7.626 13.1C7.083 14.454 7.083 16 7.083 16s0 1.546.543 2.9a1.85 1.85 0 0 0 1.299 1.306C10.279 20.751 16 20.751 16 20.751s5.721 0 7.075-.544a1.85 1.85 0 0 0 1.299-1.306C24.917 17.546 24.917 16 24.917 16s0-1.546-.542-2.9zM14.39 18.345v-4.691l4.513 2.345-4.513 2.346z" fill="#fff" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
              style={{ display: "inline-block" }}
            >
              <svg width="36" height="36" fill="#fff" style={{ transition: 'fill 0.2s' }} viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill="#222" />
                <path d="M22.1 9.9a10.2 10.2 0 0 0-15.1 12.18l-1.02 3.72 3.83-1c2.87 1.56 6.45 1.27 9-0.74A10.2 10.2 0 0 0 22.1 9.9zm-2.68 11.98c-2.2 1.22-4.93 1.39-7.27.43l-.52-.18-2.27.6.59-2.2-.17-.54c-.84-2.67-.16-5.63 1.97-7.74 2.93-2.91 7.66-2.73 10.44.44s2.6 7.37-.44 10.44zm-2.08-5.97c-.29-.15-.62-.24-.94-.15-.24.07-.54.27-.94.56-.41.29-.7.51-1.1.5-.63-.03-1.17-.36-1.56-.84-.43-.5-.48-.97-.43-1.25.05-.3.19-.37.52-.5.13-.06.26-.13.4-.2.2-.12.41-.25.49-.42.09-.18.07-.43-.09-.64-1.26-1.67-2.26-2.24-2.83-2.25-.51 0-1.05.69-1.05 1.33 0 .75.67 2.19 2.29 3.89 1.63 1.69 3.09 2.19 3.84 2.19.59 0 1.33-.6 1.35-1.06.02-.41-.51-.72-1.13-1.14z" fill="#fff" />
              </svg>
            </a>
          </div>
          {/* Company Partners Section */}
          <div
            style={{
              marginTop: 15,
              fontSize: "1.13rem",
              letterSpacing: 1,
              fontWeight: 600,
              color: "#cfcfcf",
              opacity: 0.80,
              textAlign: "right",
              width: "100%",
            }}
          >
            Company Partners
          </div>
          <div
            style={{
              color: "#eee",
              fontSize: "1.05rem",
              letterSpacing: "1px",
              marginTop: 6,
              textAlign: "right",
              fontWeight: 500,
              lineHeight: 1.7,
              whiteSpace: "pre-line",
            }}
          >
            Amruth M&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-1DT22CS011<br />
            Amogh Siddarth K J&nbsp;&nbsp;-1DT22CS010<br />
            Govind Venkatesh&nbsp;&nbsp;&nbsp;-1DT22CS049<br />
            Hemanth M&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-1DT22CS059
          </div>
        </div>
      </div>
      {/* copyright row */}
      <div
        style={{
          color: "#aaa",
          fontSize: "0.92rem",
          fontWeight: 400,
          textAlign: "center",
          marginTop: 38,
          opacity: 0.65,
          letterSpacing: 0.5,
        }}
      >
        &copy; {new Date().getFullYear()} SharkBite Solutions and private limited. All rights reserved.
      </div>
    </footer>
  );
}
