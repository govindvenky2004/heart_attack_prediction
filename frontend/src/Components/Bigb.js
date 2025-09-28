import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Bigb() {
  const navigate = useNavigate();
  const [buttonStyle, setButtonStyle] = useState({
    outerRing: '#36ff36',
    coreBg: 'radial-gradient(circle at 45% 45%, #393c3d 80%, #222 100%)',
    coreBorder: '#888',
  });
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
  style={{
    maxWidth: 900, // reduce max width for better readability
    margin: '150px auto 0 auto', // center horizontally
    background: 'radial-gradient(circle at center, #192239 67%, #10121a 100%)',
    padding: '80px 32px 48px 32px',
    borderRadius: 10,
    boxShadow: '0 8px 32px #000C, 0 1.5px 4px #00a4ff44',
    textAlign: 'center',
    boxSizing: 'border-box', // ensures padding is inside maxWidth
  }}
>

      <div
        style={{
          fontWeight: '900',
          fontSize: 36,
          color: '#71cbff',
          letterSpacing: '2px',
          textShadow: '0 2px 6px #00cfff, 0 0px 16px #21354b',
          marginBottom: 14,
        }}
      >
        RISK SCALE<br />INFORMATION
      </div>

      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: 'red',
          background: 'rgba(20,30,60,0.7)',
          borderRadius: 12,
          padding: 28,
          marginBottom: 40,
          boxShadow: '0 2px 18px #00c4ff22',
        }}
      >
        This tells us a few things:<br /><br />
        Your model is sensitive to the input features (age, cholesterol, blood pressure, etc.).<br /><br />
        You can use the probability value to implement a risk scale in your frontend instead of just 0/1. For example:
      </div>

      {/* Circular "Engine Start/Stop" styled button */}
      <div
        style={{
          position: 'relative',
          width: '128px',
          height: '128px',
          margin: '48px auto 0 auto',
        }}
      >
        {/* Outer Ring */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '128px',
            height: '128px',
            borderRadius: '50%',
            border: `6px solid ${isPressed ? '#1666f0' : buttonStyle.outerRing}`,
            boxSizing: 'border-box',
            boxShadow: `0 0 18px ${isPressed ? '#1666f0' : buttonStyle.outerRing}88,
                        0 0 28px ${isPressed ? '#1666f0' : buttonStyle.outerRing}80 inset`,
            zIndex: 0,
            transition: 'border 0.18s, box-shadow 0.18s',
          }}
        ></div>
        {/* Button core */}
        <button
          onClick={() => {
            setIsPressed(true);
            setTimeout(() => {
              setIsPressed(false);
              navigate('/table');
            }, 180); // short active color flash before navigation
          }}
          onMouseOver={() =>
            setButtonStyle({
              outerRing: '#1666f0',
              coreBg: 'radial-gradient(circle at 45% 45%, #2666e2 88%, #2a315b 100%)',
              coreBorder: '#2596f7',
            })
          }
          onMouseOut={() => {
            setButtonStyle({
              outerRing: '#36ff36',
              coreBg: 'radial-gradient(circle at 45% 45%, #393c3d 80%, #222 100%)',
              coreBorder: '#888',
            });
            setIsPressed(false);
          }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            width: '108px',
            height: '108px',
            borderRadius: '50%',
            background: isPressed ? 'radial-gradient(circle at 45% 45%, #1647a3 90%, #13243b 100%)' : buttonStyle.coreBg,
            border: `5px solid ${isPressed ? '#1647a3' : buttonStyle.coreBorder}`,
            color: '#e8e8e8',
            fontWeight: 'bold',
            fontSize: '1.54rem',
            letterSpacing: '1px',
            boxShadow: '0 4px 18px #222 inset, 0 2px 18px #222',
            textAlign: 'center',
            cursor: 'pointer',
            outline: 'none',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            transition: 'background 0.18s, border 0.18s, box-shadow 0.18s, color 0.18s',
            userSelect: 'none'
          }}
        >
          Click to
          Predict
          
        </button>
      </div>
    </div>
  );
}
