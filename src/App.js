import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';


import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";



function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Signup' element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
     
      
    </div>
  );
}

export default App;
