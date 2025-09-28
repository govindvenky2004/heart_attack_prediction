import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar';
import './App.css';

import Infobar from './Components/Infobar';
import Nav2 from './Components/Nav2';
import Rcards from './Components/Rcards';
import Lastfoot from './Components/Lastfoot';
import Bigb from './Components/Bigb';
import Table from './Components/Table';
import HeartChat from './Components/HeartChat'; // Import the new Chatbot page
import Quote from './Components/quote'; // Import the Quote page

function App() {
  return (
    <Router>
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
        <Route path="/table" element={<Table />} />

        {/* Heart Chat Page */}
        <Route path="/chat" element={<HeartChat />} />

        {/* Quote Page */}
        <Route path="/quote" element={<Quote />} />
      </Routes>
    </Router>
  );
}

export default App;
