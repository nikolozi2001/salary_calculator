import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="py-6 flex-grow">
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
}

export default App;
