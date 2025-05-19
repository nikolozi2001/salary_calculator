import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Dashboard from "./components/Dashboard";
import Footer from "./components/footer/Footer";
import "./App.css";



function App() {
  const [language, setLanguage] = useState("GE");
    return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header language={language} setLanguage={setLanguage} />
      <main className="flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<Dashboard language={language} />} />
        </Routes>
      </main>
      <Footer language={language} />
    </div>
  );
}

export default App;
