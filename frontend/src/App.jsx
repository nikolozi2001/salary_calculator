import { useState } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('employees')

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Salary Calculator</h1>
          <p className="mt-1 text-blue-100">Manage employees and salaries</p>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-6">
              <button 
                className={`py-2 px-1 border-b-2 ${activeTab === 'employees' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('employees')}
              >
                Employees
              </button>
              <button 
                className={`py-2 px-1 border-b-2 ${activeTab === 'salaries' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('salaries')}
              >
                Salaries
              </button>
              <button 
                className={`py-2 px-1 border-b-2 ${activeTab === 'calculator' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('calculator')}
              >
                Calculator
              </button>
            </nav>
          </div>

          {activeTab === 'salaries' && (
            <div className="py-8 text-center">
              <p className="text-gray-500">Salary management feature coming soon</p>
            </div>
          )}
          {activeTab === 'calculator' && (
            <div className="py-8 text-center">
              <p className="text-gray-500">Salary calculator feature coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
