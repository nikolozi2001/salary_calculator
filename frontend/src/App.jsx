import React, { useState } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("GE");
  
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header language={language} setLanguage={setLanguage} />
      <div className="flex-grow overflow-hidden">
        <Dashboard language={language} />
      </div>
      <Footer language={language} />
    </div>
  );
}

export default App;
