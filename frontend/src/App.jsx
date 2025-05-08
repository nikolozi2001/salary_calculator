import React, { useState } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("GE");
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header language={language} setLanguage={setLanguage} />
      <main className="flex-grow">
        <Dashboard language={language} />
      </main>
      <Footer language={language} />
    </div>
  );
}

export default App;
