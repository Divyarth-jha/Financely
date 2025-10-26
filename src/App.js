import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Signup from './pages/signup';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route 
            path='/dashboard' 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
