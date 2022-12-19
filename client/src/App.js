
import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


import Alert from './components/Alert';
import AppState from './context/notes/AppState';
import Login from './components/Login';
import Reg from './components/Reg';
import Profile from './components/Profile';

function App() {
   const [alert, setAlert] = useState(null);
   const showAlert = (message, type) => {
     setAlert({
       msg: message,
       type: type
     })
     setTimeout(() => {
       setAlert(null);
     }, 1500);
   }
  return (
    <>
      <AppState>
        <Router>
          <div className="body">
            <div className="container1">
              <Alert alert={alert}/>
              <Routes>
                <Route exact path='/' element={<Login showAlert={showAlert}/>} />
                <Route exact path='/reg' element={<Reg showAlert={showAlert}/>} />
                <Route exact path='/profile' element={<Profile showAlert={showAlert}/>} />
              </Routes>
            </div>
          </div>
        </Router>
      </AppState>
    </>
  );
}

export default App;
