import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header />
      <div className="flex-grow overflow-hidden">
        <Dashboard />
      </div>
      <Footer />
    </div>
  );
}

export default App;
