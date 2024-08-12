// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import AuthForm from './components/AuthForm';
import MainApp from './components/MainApp';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/main" element={<MainApp />} />
      </Routes>
    </Router>
  );
};

export default App;
