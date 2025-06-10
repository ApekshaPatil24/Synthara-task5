import logo from './logo.svg';
import './App.css';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
