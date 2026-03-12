import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Welcome to Vite + React
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Edit{" "}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/App.jsx
          </code>{" "}
          and save to test HMR
        </p>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Count is {count}
          </button>
        </div>
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">🎨 Styled with Tailwind CSS 3.x</p>
          <p>⚡ Powered by Vite</p>
        </div>
      </div>
    </div>
  );
}

export default App;
