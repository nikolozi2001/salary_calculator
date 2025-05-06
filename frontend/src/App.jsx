import { useState } from "react";
import Header from "./components/Header";
import RegionsComponent from "./components/RegionsComponent";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-6">
        <RegionsComponent />
        <Dashboard />
      </main>
      <footer className="bg-gray-100 text-center py-4 text-gray-600 text-sm mt-auto">
        <p>© {new Date().getFullYear()} Salary Calculator - Modern Design</p>
      </footer>
    </div>
  );
}

export default App;
