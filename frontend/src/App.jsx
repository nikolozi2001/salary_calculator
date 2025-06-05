import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/footer/Footer";
import SearchResults from "./pages/SearchResults";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("GE");
  return (    <div className="min-h-screen flex flex-col bg-gray-50">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header language={language} setLanguage={setLanguage} />
              <main className="flex-1 relative">
                <Dashboard language={language} />
              </main>
              <Footer language={language} />
            </>
          }
        />
        <Route
          path="/search-results"
          element={
            <SearchResults language={language} setLanguage={setLanguage} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
