import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './contracts/Landing';
import Admin from './contracts/Admin';
import User from './contracts/User';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
