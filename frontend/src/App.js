import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './Components/ScrollToTop'; // ✅ Add this line

import Navbar from './Components/Navbar';
import './App.css';
import Infobar from './Components/Infobar';
import Nav2 from './Components/Nav2';
import Rcards from './Components/Rcards';
import Lastfoot from './Components/Lastfoot';
import Bigb from './Components/Bigb';
import Table from './Components/Table';
import HeartChat from './Components/HeartChat';
import Quote from './Components/quote';
import ECGAnalyzer from './Components/ECGAnalyzer';

function App() {
  return (
    <>
      <ScrollToTop /> {/* ✅ ensures scroll resets to top on route change */}
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Nav2 />
              <Infobar />
              <Bigb />
              <div className="Rcards"><Rcards /></div>
              <Lastfoot />
            </>
          }
        />

        {/* Table Page */}
        <Route
          path="/table"
          element={
            <>
              <Navbar />
              <Table />
              <Lastfoot />
            </>
          }
        />

        {/* Heart Chat Page */}
        <Route
          path="/chat"
          element={
            <>
              <Navbar />
              <HeartChat />
              <Lastfoot />
            </>
          }
        />

        {/* ECG Analyzer Page */}
        <Route
          path="/ecg-analyzer"
          element={
            <>
              <Navbar />
              <ECGAnalyzer />
              <Lastfoot />
            </>
          }
        />

        {/* Quote Page */}
        <Route
          path="/quote"
          element={
            <>
              <Navbar />
              <Quote />
              <Lastfoot />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
