import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Seguimiento from './pages/Seguimiento';
import Home from './pages/Home';
import Login from './pages/Login';
import Internacional from './pages/Internacional';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="flex-1 flex flex-col bg-[#fafafa]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/seguimiento" element={<Seguimiento />} />
            <Route path="/login" element={<Login />} />
            <Route path="/internacional" element={<Internacional />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
