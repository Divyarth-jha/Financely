
import './App.css';

import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Dashboard from './pages/Dashboard';
import Signup from './pages/signup';

 import { ToastContainer, toast } from 'react-toastify';
  

function App() {
  return (
   <>
   <ToastContainer/>
    <Router>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </Router>
   </>
  );
}

export default App;
