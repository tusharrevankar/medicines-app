import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MedicineListings from './MedicineListings';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MedicineListings />} />
      </Routes>
    </Router>
  );
};

export default App;
