import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Dashboard from "./components/Dashboard";
import Footer from "./components/footer/Footer";
import "./App.css";



function App() {
  const [language, setLanguage] = useState("GE");
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header language={language} setLanguage={setLanguage} />      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Dashboard language={language} />} />
        </Routes>
      </main>
      <Footer language={language} />
    </div>
  );
}

export default App;
